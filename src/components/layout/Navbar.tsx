import React from "react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { getPublicMediaSlots } from "@/lib/services/site-settings";
import { cn } from "@/lib/utils";
import {
  buildImageSrcSet,
  buildMediaProxyUrl,
  DEFAULT_LOGO_IMAGE_WIDTHS,
} from "@/lib/media-url";

const NAV_LINKS = {
  contact: "/#contact",
  home: "/",
  products: "/#x",
  quote: "/#contact",
  trust: "/#trust",
  whyUs: "/#why-us",
} as const;

const Navbar = async () => {
  const mediaSlots = await getPublicMediaSlots();
  const logoUrl = mediaSlots["brand.logo.primary"];

  return (
    <nav className="fixed left-0 top-0 z-50 flex h-[72px] w-full items-center border-b border-gray-100 bg-white shadow-sm">
      <div className="container mx-auto flex w-full items-center justify-between px-4 lg:px-8">
        <a href={NAV_LINKS.home} className="flex-shrink-0">
          <img
            src={buildMediaProxyUrl(logoUrl, 320)}
            srcSet={buildImageSrcSet(logoUrl, DEFAULT_LOGO_IMAGE_WIDTHS)}
            sizes="160px"
            alt="Zhixinpaper Logo"
            loading="eager"
            decoding="async"
            className="h-auto max-h-12 w-auto cursor-pointer object-contain transition-transform duration-300 hover:scale-105 md:max-h-16"
          />
        </a>

        <div className="hidden items-center space-x-8 text-lg font-medium text-gray-700 md:flex">
          <a href={NAV_LINKS.home} className="transition-colors hover:text-blue-600">
            Home
          </a>
          <a href={NAV_LINKS.products} className="transition-colors hover:text-blue-600">
            Products
          </a>
          <a href={NAV_LINKS.whyUs} className="transition-colors hover:text-blue-600">
            Why Us
          </a>
          <a href={NAV_LINKS.trust} className="transition-colors hover:text-blue-600">
            Quality/Trust
          </a>
          <a href={NAV_LINKS.contact} className="transition-colors hover:text-blue-600">
            Contact
          </a>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <a
            href={NAV_LINKS.quote}
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "flex items-center rounded-full bg-blue-600 px-6 text-base font-semibold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg",
            )}
          >
            Request a Quote
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
