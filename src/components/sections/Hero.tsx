import React from "react";

import { buttonVariants } from "@/components/ui/button";
import {
  buildImageSrcSet,
  buildMediaProxyUrl,
  DEFAULT_HERO_IMAGE_WIDTHS,
} from "@/lib/media-url";
import { cn } from "@/lib/utils";
import type { HeroContent } from "@/lib/siteSettingsTypes";

type Props = {
  hero: HeroContent;
};

const Hero = ({ hero }: Props) => {
  const primaryHref =
    hero.primaryCtaHref?.startsWith("mailto:") || !hero.primaryCtaHref
      ? "#contact"
      : hero.primaryCtaHref;
  const heroSrc = buildMediaProxyUrl(hero.backgroundImage, 1600);
  const heroSrcSet = buildImageSrcSet(hero.backgroundImage, DEFAULT_HERO_IMAGE_WIDTHS);

  return (
    <header id="n" className="relative flex min-h-[68svh] items-center overflow-hidden bg-slate-950 sm:min-h-[74svh] lg:min-h-[80vh]">
      <div className="absolute inset-0">
        <img
          src={heroSrc}
          srcSet={heroSrcSet}
          sizes="100vw"
          alt=""
          aria-hidden="true"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="h-full w-full object-cover object-[62%_center] sm:object-[68%_center] lg:object-center"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-slate-950/28 to-slate-950/72 sm:from-slate-950/36 sm:via-slate-950/20 sm:to-slate-950/56 lg:bg-gradient-to-r lg:from-slate-950/56 lg:via-slate-950/24 lg:to-transparent z-0 pointer-events-none"></div>

      <div className="container mx-auto px-4 sm:px-5 lg:px-8 py-12 sm:py-16 lg:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          <div className="lg:col-span-8 text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-sm border border-blue-700/50 bg-blue-900/80 px-3 py-2 text-[11px] font-bold tracking-[0.2em] text-blue-100 shadow-sm backdrop-blur-sm sm:mb-8 sm:px-4 sm:text-sm sm:tracking-wider">
              <span className="w-2 h-2 rounded-full bg-blue-300" />
              {hero.eyebrow}
            </div>

            <h1 className="mb-5 max-w-[11ch] text-3xl font-extrabold leading-[1.02] tracking-tight text-white drop-shadow-md sm:mb-6 sm:max-w-[12ch] sm:text-4xl md:text-5xl lg:max-w-none lg:text-6xl">
              {hero.title} <span className="text-blue-400">{hero.highlight}</span> Globally
            </h1>

            <p className="mb-8 max-w-xl text-base font-medium leading-7 text-slate-100 drop-shadow-sm sm:mb-10 sm:text-lg md:text-xl">
              {hero.description}
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
              <a
                href={primaryHref}
                className={cn(
                  buttonVariants({ variant: "default", size: "lg" }),
                  "flex min-h-12 w-full items-center justify-center rounded-sm bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition-all duration-300 hover:bg-blue-500 sm:min-h-14 sm:w-auto sm:px-8 sm:py-4 sm:text-base",
                )}
              >
                {hero.primaryCtaLabel}
              </a>
              <a
                href={hero.secondaryCtaHref}
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "min-h-12 w-full rounded-sm border-[#1650fe] bg-[#1650fe] px-6 py-3 text-center text-sm font-bold text-white backdrop-blur-sm hover:border-[#0f46e0] hover:bg-[#0f46e0] sm:min-h-14 sm:w-auto sm:px-8 sm:py-4 sm:text-base",
                )}
              >
                {hero.secondaryCtaLabel}
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Hero;
