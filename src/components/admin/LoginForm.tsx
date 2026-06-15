"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(formData: FormData) {
    setPending(true);
    setError("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });

    const result = (await response.json()) as { error?: string };

    if (!response.ok) {
      setPending(false);
      setError(result.error ?? "登录失败，请检查账号和密码。");
      return;
    }

    startTransition(() => {
      router.push("/admin");
      router.refresh();
    });
  }

  return (
    <form
      action={onSubmit}
      className="space-y-5 rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60"
    >
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="email">
          管理员邮箱
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="请输入管理员邮箱"
          required
          className="h-11"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="password">
          登录密码
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="请输入密码"
          required
          className="h-11"
        />
      </div>

      {error ? (
        <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={pending}
        className="h-11 w-full rounded-2xl bg-slate-950 text-white hover:bg-slate-800"
      >
        {pending ? "登录中..." : "进入后台"}
      </Button>
    </form>
  );
}
