"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function signOut() {
    setPending(true);
    await fetch("/api/admin/logout", { method: "POST" });

    startTransition(() => {
      router.push("/admin/login");
      router.refresh();
    });
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={signOut}
      disabled={pending}
      className="rounded-full border-slate-300 bg-white/70 px-4"
    >
      {pending ? "退出中..." : "退出登录"}
    </Button>
  );
}
