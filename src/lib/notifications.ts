import "@/lib/serverOnly";

import { Resend } from "resend";

import { env } from "@/lib/env";

type NotifyPayload = {
  category: "contact" | "quote" | "sample";
  message: string;
  replyTo?: string;
  title: string;
};

async function notifyServerChan(payload: NotifyPayload) {
  if (!env.SERVERCHAN_SENDKEY) {
    return { channel: "serverchan", skipped: true as const };
  }

  const response = await fetch(
    `https://sctapi.ftqq.com/${env.SERVERCHAN_SENDKEY}.send`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        title: payload.title,
        desp: payload.message,
      }),
    },
  );

  return {
    channel: "serverchan",
    ok: response.ok,
  };
}

async function notifyResend(payload: NotifyPayload) {
  if (!env.RESEND_API_KEY || !env.RESEND_FROM_EMAIL || !env.NOTIFICATION_EMAIL_TO) {
    return { channel: "resend", skipped: true as const };
  }

  const resend = new Resend(env.RESEND_API_KEY);

  const result = await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: env.NOTIFICATION_EMAIL_TO,
    subject: payload.title,
    text: payload.message,
    replyTo: payload.replyTo,
  });

  return {
    channel: "resend",
    id: result.data?.id ?? null,
    error: result.error ?? null,
  };
}

export async function notifyAll(payload: NotifyPayload) {
  return Promise.allSettled([
    notifyServerChan(payload),
    notifyResend(payload),
  ]);
}
