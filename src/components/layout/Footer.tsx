import React from "react";
import Link from "next/link";

import { getPublicMediaSlots } from "@/lib/services/site-settings";
import {
  buildImageSrcSet,
  buildMediaProxyUrl,
  DEFAULT_LOGO_IMAGE_WIDTHS,
} from "@/lib/media-url";

const PRODUCTS_SECTION_HREF = "/#x";

const Footer = async () => {
  const mediaSlots = await getPublicMediaSlots();
  const logoUrl =
    mediaSlots["brand.logo.footer"] ||
    mediaSlots["brand.logo.primary"] ||
    "https://pos.zhixinpaper.com/wp-content/uploads/2026/05/02.png";

  return (
    <footer className="border-t border-white/5 bg-[#0e0e0e] pb-8 pt-16 text-gray-400">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mb-16 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="mb-6 inline-flex rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-white/10">
              <img
                src={buildMediaProxyUrl(logoUrl, 320)}
                srcSet={buildImageSrcSet(logoUrl, DEFAULT_LOGO_IMAGE_WIDTHS)}
                sizes="160px"
                alt="Zhixinpaper Logo"
                loading="lazy"
                decoding="async"
                className="h-16 w-auto max-w-full object-contain"
              />
            </div>
            <p className="mb-6 max-w-sm text-sm leading-relaxed">
              Zhixinpaper is a premier global manufacturer of specialty thermal paper
              solutions. With 15+ years of factory-direct excellence, we empower
              businesses with reliable, high-performance receipt and labeling products.
            </p>
          </div>

          <div className="lg:col-span-2">
            <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-white">
              Solutions
            </h4>
            <ul className="space-y-4 text-sm">
              <li>
                <Link
                  href={PRODUCTS_SECTION_HREF}
                  className="transition-colors hover:text-blue-500"
                >
                  POS Receipt Rolls
                </Link>
              </li>
              <li>
                <Link
                  href={PRODUCTS_SECTION_HREF}
                  className="transition-colors hover:text-blue-500"
                >
                  Mobile Printer Rolls
                </Link>
              </li>
              <li>
                <Link
                  href={PRODUCTS_SECTION_HREF}
                  className="transition-colors hover:text-blue-500"
                >
                  Custom Logo Rolls
                </Link>
              </li>
              <li>
                <Link
                  href={PRODUCTS_SECTION_HREF}
                  className="transition-colors hover:text-blue-500"
                >
                  BPA-Free Options
                </Link>
              </li>
              <li>
                <Link
                  href={PRODUCTS_SECTION_HREF}
                  className="transition-colors hover:text-blue-500"
                >
                  Industry Pages
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-white">
              Trust
            </h4>
            <ul className="space-y-4 text-sm">
              <li>
                <Link href="#trust" className="transition-colors hover:text-blue-500">
                  Factory Workshop
                </Link>
              </li>
              <li>
                <Link href="#trust" className="transition-colors hover:text-blue-500">
                  ISO/FSC Certified
                </Link>
              </li>
              <li>
                <Link href="#contact" className="transition-colors hover:text-blue-500">
                  Global Logistics
                </Link>
              </li>
              <li>
                <Link href="#hg" className="transition-colors hover:text-blue-500">
                  Get Free Samples
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-4">
            <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-white">
              Global Inquiries
            </h4>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3">
                <span className="w-12 font-bold text-blue-500">EM:</span>
                <a
                  href="mailto:Sales@zxpapers.com"
                  className="transition-colors hover:text-white"
                >
                  Sales@zxpapers.com
                </a>
              </li>
              <li className="flex gap-3">
                <span className="w-12 font-bold text-blue-500">TEL:</span>
                <a
                  href="tel:+8618092117618"
                  className="transition-colors hover:text-white"
                >
                  +86 180 9211 7618
                </a>
              </li>
              <li className="flex gap-3">
                <span className="w-12 font-bold text-blue-500">AD:</span>
                <span>
                  Building 15, Phase 1 Zone 2, Ronghao Industrial Park, Gaoling
                  District, Xi&apos;an, Shaanxi, China
                </span>
              </li>
              <li className="flex gap-3">
                <span className="w-12 font-bold text-blue-500">CMS:</span>
                <Link
                  href="/admin/login"
                  className="transition-colors hover:text-white"
                >
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-xs font-medium uppercase tracking-wider md:flex-row">
          <p>&copy; 2026 ZHIXINPAPER CO., LTD. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/login"
              className="inline-flex items-center rounded-full border border-white/10 bg-black px-3 py-1.5 text-[10px] font-semibold tracking-[0.24em] text-white transition hover:border-white/20 hover:bg-neutral-900"
            >
              Admin
            </Link>
            <div className="flex space-x-6">
              <Link href="#" className="transition-colors hover:text-white">
                Privacy Policy
              </Link>
              <Link href="#" className="transition-colors hover:text-white">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
