import Link from "next/link";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingActions from "@/components/layout/FloatingActions";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { IndustryPageRecord } from "@/lib/services/product-overrides";
import type { ContactConfig } from "@/lib/siteSettingsTypes";
import {
  buildImageSrcSet,
  buildMediaProxyUrl,
  DEFAULT_HERO_IMAGE_WIDTHS,
} from "@/lib/media-url";

type Props = {
  contact: ContactConfig;
  industry: IndustryPageRecord;
};

export function IndustryPageView({ industry, contact }: Props) {
  const heroImage = industry.content.heroImageUrl
    ? buildMediaProxyUrl(industry.content.heroImageUrl, 1600)
    : "";
  const heroImageSrcSet = industry.content.heroImageUrl
    ? buildImageSrcSet(industry.content.heroImageUrl, DEFAULT_HERO_IMAGE_WIDTHS)
    : "";

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_100%)] selection:bg-blue-100 selection:text-blue-900">
      <Navbar />

      <section className="relative overflow-hidden bg-slate-950 pb-20 pt-36 text-white">
        {industry.content.heroImageUrl ? (
          <img
            src={heroImage}
            srcSet={heroImageSrcSet}
            sizes="100vw"
            alt={industry.title}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover opacity-25"
          />
        ) : null}
        <div className="absolute inset-0 bg-slate-950/72" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.35),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.24),transparent_28%)]" />
        <div className="relative mx-auto max-w-6xl px-4 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-blue-300">
            {industry.content.heroEyebrow}
          </p>
          <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
            {industry.content.heroTitle}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-200">
            {industry.content.heroDescription}
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href={industry.content.ctaHref}
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "rounded-full bg-blue-500 px-8 text-white hover:bg-blue-400",
              )}
            >
              {industry.content.ctaLabel}
            </Link>
            <Link
              href={`mailto:${contact.email}`}
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "rounded-full border-white/20 bg-white/5 px-8 text-white hover:bg-white/10",
              )}
            >
              Email Sales
            </Link>
          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {industry.content.metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur"
              >
                <p className="text-3xl font-semibold text-white">{metric.value}</p>
                <p className="mt-2 text-sm text-slate-300">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-16 lg:grid-cols-2 lg:px-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-600">
            Challenge
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-950">
            {industry.content.challengeTitle}
          </h2>
          <div className="mt-6 space-y-4 text-slate-600">
            {industry.content.challenges.map((item) => (
              <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-600">
            Solution
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-950">
            {industry.content.solutionTitle}
          </h2>
          <div className="mt-6 space-y-4 text-slate-600">
            {industry.content.solutions.map((item) => (
              <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-600">
              Capabilities
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-950">
              What this industry program includes
            </h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {industry.content.capabilities.map((item) => (
              <div key={item} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-base leading-7 text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-6xl px-4 py-16 lg:px-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-600">
                FAQ
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950">
                Questions buyers usually ask before quoting
              </h2>
              <div className="mt-8 space-y-4">
                {industry.content.faqs.map((item) => (
                  <div key={item.question} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <h3 className="text-lg font-semibold text-slate-950">{item.question}</h3>
                    <p className="mt-2 leading-7 text-slate-600">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>

            <aside className="rounded-[2rem] bg-slate-950 p-6 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-300">
                Contact
              </p>
              <h3 className="mt-3 text-2xl font-semibold">Discuss your program</h3>
              <div className="mt-6 space-y-4 text-sm text-slate-200">
                <p>{contact.email}</p>
                <p>{contact.phone}</p>
                <p>{contact.address}</p>
              </div>
              <div className="mt-8 flex flex-col gap-3">
                <Link
                  href={`mailto:${contact.email}`}
                  className={cn(
                    buttonVariants({ variant: "default", size: "lg" }),
                    "justify-center rounded-full bg-blue-500 text-white hover:bg-blue-400",
                  )}
                >
                  Send an Email
                </Link>
                <Link
                  href="https://api.whatsapp.com/send/?phone=8618092117618"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "justify-center rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10",
                  )}
                >
                  WhatsApp Sales
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingActions />
    </main>
  );
}
