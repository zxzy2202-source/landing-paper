# 本次移动端优化与部署修复经验总结

## 背景

本次工作有两条主线：

1. **移动端性能优化**：重点解决首页与行业页的 LCP 过高、展示图片尺寸不合理、R2 静态资源缓存不可控的问题。
2. **Vercel 构建修复**：在将代码推到 GitHub 并触发 Vercel 部署后，连续暴露出一批生产构建和 TypeScript 检查问题，需要逐个修复。

这份文档用于沉淀本次过程中的有效做法、典型坑位和后续标准，避免下一次重复踩坑。

---

## 一、移动端优化做了什么

### 1. 首屏 LCP 图优先级提升

目标：让首屏主视觉不再因为错误加载策略拖慢 LCP。

已做调整：

- 首页 Hero 图改为 `loading="eager"`
- 首页 Hero 图增加 `fetchPriority="high"`
- 行业页 Hero 图同样改为高优先级加载
- 保留 `decoding="async"`，避免阻塞渲染线程

对应文件：

- `src/components/sections/Hero.tsx`
- `src/components/pages/IndustryPageView.tsx`

### 2. 展示图片接入响应式尺寸策略

目标：避免小卡片加载过大的原图。

已做调整：

- 新增统一图片 URL 构造工具：`src/lib/media-url.ts`
- 为不同场景拆分宽度集合：
  - `DEFAULT_HERO_IMAGE_WIDTHS`
  - `DEFAULT_SECTION_IMAGE_WIDTHS`
  - `DEFAULT_CARD_IMAGE_WIDTHS`
  - `DEFAULT_LOGO_IMAGE_WIDTHS`
- 为主要图片组件补充 `srcSet` 和 `sizes`
- 逐步把首页产品卡、痛点卡、物流卡、工厂图库、横幅、Logo、后台预览图切到统一策略

对应文件包括：

- `src/components/sections/ProductShowcase.tsx`
- `src/components/sections/PainPoints.tsx`
- `src/components/sections/Logistics.tsx`
- `src/components/sections/ProductMatrix.tsx`
- `src/components/sections/Marquee.tsx`
- `src/components/sections/TrustSection.tsx`
- `src/components/layout/Navbar.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/admin/MediaImagePicker.tsx`
- `src/components/admin/MediaManager.tsx`

### 3. 建立站内媒体代理，统一缓存与缩放

目标：不要直接把前台图片请求打到不可控的外部 R2 公网地址。

已做调整：

- 新增 `src/app/api/media/route.ts`
- 将公开图片先走 `/api/media?src=...&w=...`
- 代理支持：
  - 来源域名限制
  - 按 `w` 参数真实缩放
  - 输出 `webp`
  - 返回统一 `Cache-Control`
- SEO OG 图也改为走代理后的绝对地址

对应文件：

- `src/app/api/media/route.ts`
- `src/lib/media-url.ts`
- `src/lib/seo.ts`
- `next.config.ts`

---

## 二、这次 Vercel 构建为什么会连续报错

这次不是单一故障，而是“**本地未完整做生产构建校验**”导致的一串问题被 Vercel 逐个暴露。

### 问题类型 1：语法残留

问题表现：

- `src/lib/seo.ts` 文件尾部残留错误文本，导致解析失败。

经验：

- 改动 metadata 或大段替换代码后，必须检查文件尾部是否有拼接残留。
- 这类问题本地如果不跑 build，容易漏掉。

### 问题类型 2：仓库文件未真正进入版本控制

问题表现：

- `src/lib/db/client.ts`
- `src/lib/db/schema.ts`

在本地存在，但 Vercel 构建时提示模块不存在。

根因：

- `.gitignore` 中的裸 `db` 规则误伤了 `src/lib/db`。
- 文件存在于本地磁盘，但没有被 git 跟踪，因此远程仓库没有这些文件。

经验：

- “本地有文件”不等于“仓库里有文件”。
- 对于关键模块，必须用 `git ls-files` 或 `git status` 确认是否真的被跟踪。

### 问题类型 3：Next.js / TypeScript 类型收紧

问题表现：

- `NextResponse` 不接受 `Buffer` 直接作为 body。

修复方式：

- 将媒体代理的返回体改为 `Uint8Array`。

经验：

- 服务端代码在 Node 环境能跑，不代表符合 Next 的 Web Response 类型要求。
- 只要进入 App Router Route Handler，就优先使用 Web 标准兼容类型。

### 问题类型 4：重构中改了常量名，但引用未同步

问题表现：

- `MediaImagePicker.tsx` 漏掉 `buildMediaProxyUrl` 导入
- `Marquee.tsx` 仍引用旧的图片宽度常量名
- `TrustSection.tsx` 仍引用旧的图片宽度常量名

经验：

- 当把一个通用常量拆成多个版本时，最容易漏的是“使用方文件顶部的 import”。
- 这类问题在大型替换后非常高发。

---

## 三、这次实际用到的修复提交

本次与部署修复直接相关的提交：

- `d1037a1` — `Optimize mobile image delivery and caching`
- `8fa8df4` — `Fix deployment build errors`
- `ac1c9a4` — `Include db sources in repository`
- `7adc8db` — `Fix media route response body type`
- `8d3fbb0` — `Fix media picker proxy import`
- `6f3e6b5` — `Fix marquee image width import`
- `19eae5a` — `Fix trust section image width import`

说明：

- 第一版功能提交解决的是业务目标。
- 后续多个小提交解决的是“生产构建链路暴露出的工程完整性问题”。
- 这是正常现象，但也说明首版提交前缺少生产级校验。

---

## 四、以后遇到同类问题的标准排查顺序

### 第一步：先区分是哪一类问题

看到 Vercel 失败后，先判断属于哪一层：

1. **编译失败**：语法错误、模块找不到、导入错误
2. **TypeScript 失败**：类型不兼容、变量未定义、泛型不匹配
3. **运行时失败**：环境变量缺失、数据库连接失败、R2 权限失败
4. **业务结果失败**：页面能部署，但效果不对，比如图片没变小、缓存没生效、LCP 没下降

### 第二步：优先修最前面的报错

Vercel 日志里通常会给出第一条关键错误。

标准动作：

- 先修第一条
- 不要同时猜测 5 个原因
- 第一条修完再重新构建，看下一条

原因：

- 后面的报错很多时候是前面错误的连带结果

### 第三步：对“模块不存在”类问题，必须做三项确认

如果报：`Module not found`

必须依次检查：

1. 文件在不在磁盘上
2. 文件有没有被 git 跟踪
3. `.gitignore` 是否误伤

不能只看本地目录。

### 第四步：对“Cannot find name”类问题，优先查 import

如果报：

- `Cannot find name 'xxx'`

优先查：

- 顶部 import 是否漏了
- 常量名是否重命名后未替换干净
- 是否从旧集合切换到新集合时只改了使用处没改导入处

### 第五步：对图片代理或 API Route，优先按 Web 标准写

不要假设 Node 类型一定能过 Next 的类型检查。

优先使用：

- `Uint8Array`
- `ArrayBuffer`
- 标准 `Response` / `NextResponse`

而不是直接依赖 Node 专属对象作为响应体。

---

## 五、以后提交前必须做的最小检查清单

### 代码改完后至少检查这几项

#### 1. Git 完整性检查

执行：

- `git status --short`
- `git ls-files <关键目录>`
- 必要时 `git check-ignore -v <文件>`

目的：

- 防止“文件在本地，但没进仓库”

#### 2. 图片链路检查

检查项：

- 首屏图是否 `eager`
- 首屏图是否 `fetchPriority="high"`
- 展示图是否有 `srcSet` / `sizes`
- 是否还残留直链外部图绕开代理
- 代理是否真的缩放，而不是只换 URL

#### 3. SEO 检查

检查项：

- metadata 是否动态生成
- OG 图是否有效
- 改完后是否看渲染结果��而不是只看代码

#### 4. 构建检查

本地至少要执行与线上等价的：

- `pnpm run build`

如果本地不方便，也至少要意识到：

- Vercel 第一次构建很可能会继续暴露隐藏问题

---

## 六、后续开发建议

### 1. 统一做一层图片组件约束

当前虽然已经有统一 URL 工具，但还可以继续收敛：

- 建议后续抽一个统一图片组件/辅助封装
- 把 `src`、`srcSet`、`sizes`、`loading`、`decoding` 组合规范固定下来

这样可以减少“每个区块单独拼一套”的遗漏风险。

### 2. 补一份部署前自检脚本

建议后续加一个最小自检流程，例如：

- 检查关键目录是否被 git 跟踪
- 检查是否存在明显未导入变量
- 执行 build

目标不是复杂，而是降低“推上去才发现最基础问题”的概率。

### 3. 后台与前台继续严格分层

这次不少问题都出在后台媒体管理和前台图片链路交汇的位置。

后续建议：

- 后台预览可以走代理
- 但后台专用逻辑、前台营销逻辑、SEO 输出逻辑继续保持边界清晰

---

## 七、结论

这次经验最重要的不是“修掉了几个报错”，而是确认了三件事：

1. **移动端图片性能优化必须同时抓加载优先级、尺寸策略、缓存控制**。
2. **Vercel 构建失败大多不是平台问题，而是项目代码、类型、提交完整性问题**。
3. **以后每次上线前，都要把“git 完整性 + build 校验 + 图片链路检查”当作固定流程。**

如果后续继续扩展多 GEO 页面、后台媒体系统、SEO 配置或行业页模板，优先沿用这次沉淀出的统一思路，不要再回到分散硬编码。
