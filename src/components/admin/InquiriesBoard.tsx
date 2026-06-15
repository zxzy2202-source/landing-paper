"use client";

import { startTransition, useState } from "react";

import { Button } from "@/components/ui/button";

type InquiryItem = {
  companyName?: string | null;
  contactEmail: string;
  contactName: string;
  createdAt: Date;
  id: string;
  message?: string | null;
  productInterest?: string | null;
  status: string;
  whatsappNumber?: string | null;
};

type Props = {
  contact: InquiryItem[];
  quote: InquiryItem[];
  sample: InquiryItem[];
};

const tabs = [
  { key: "contact", label: "联系表单" },
  { key: "quote", label: "报价需求" },
  { key: "sample", label: "样品申请" },
] as const;

const statusLabels: Record<string, string> = {
  new: "新建",
  reviewing: "跟进中",
  quoted: "已报价",
  closed: "已关闭",
};

export function InquiriesBoard({ contact, quote, sample }: Props) {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["key"]>("contact");
  const [items, setItems] = useState({ contact, quote, sample });
  const currentItems = items[activeTab];

  async function updateStatus(id: string, nextStatus: string) {
    const response = await fetch(`/api/admin/inquiries/${activeTab}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: nextStatus }),
    });

    if (!response.ok) {
      return;
    }

    setItems((current) => ({
      ...current,
      [activeTab]: current[activeTab].map((item) =>
        item.id === id ? { ...item, status: nextStatus } : item,
      ),
    }));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        {tabs.map((tab) => (
          <Button
            key={tab.key}
            type="button"
            variant={activeTab === tab.key ? "default" : "outline"}
            className="rounded-full px-5"
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      <div className="grid gap-4">
        {currentItems.length ? (
          currentItems.map((item) => (
            <article
              key={item.id}
              className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-950">
                    {item.contactName}
                  </h3>
                  <p className="text-sm text-slate-500">{item.contactEmail}</p>
                  <p className="mt-1 text-sm text-slate-600">
                    {item.companyName || "未填写公司名称"}
                  </p>
                </div>
                <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-600">
                  {statusLabels[item.status] ?? item.status}
                </div>
              </div>

              <div className="mt-4 grid gap-2 text-sm text-slate-600">
                <p>意向产品：{item.productInterest || "-"}</p>
                <p>WhatsApp：{item.whatsappNumber || "-"}</p>
                <p>提交时间：{new Date(item.createdAt).toLocaleString("zh-CN")}</p>
                <p>留言内容：{item.message || "-"}</p>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {["new", "reviewing", "quoted", "closed"].map((status) => (
                  <Button
                    key={status}
                    type="button"
                    variant={item.status === status ? "default" : "outline"}
                    size="sm"
                    onClick={() => startTransition(() => void updateStatus(item.id, status))}
                  >
                    {statusLabels[status]}
                  </Button>
                ))}
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white/70 p-10 text-center text-slate-500">
            当前分类下还没有询盘记录。
          </div>
        )}
      </div>
    </div>
  );
}
