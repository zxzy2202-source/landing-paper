import React from 'react';
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle } from "lucide-react";
import type { HeroContent } from "@/lib/siteSettingsTypes";

type Props = {
  hero: HeroContent;
};

const Hero = ({ hero }: Props) => {
  return (
    <header id="n" className="relative bg-slate-900 overflow-hidden min-h-[80vh] flex items-center bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('${hero.backgroundImage}')` }}>
      
      {/* Gradient Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/30 via-slate-900/10 to-transparent z-0 pointer-events-none"></div>

      {/* Hero Content */}
      <div className="container mx-auto px-4 lg:px-8 py-16 lg:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Section: Main Copywriting */}
          <div className="lg:col-span-8 text-left">
            {/* Trust Kicker */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-blue-900/80 border border-blue-700/50 text-blue-100 text-sm font-bold tracking-wider mb-8 shadow-sm backdrop-blur-sm">
              <CheckCircle className="w-4 h-4 text-blue-300" />
              {hero.eyebrow}
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 tracking-tight drop-shadow-md">
              {hero.title} <span className="text-blue-400">{hero.highlight}</span> Globally
            </h1>
            
            <p className="text-lg md:text-xl text-slate-100 font-medium max-w-2xl leading-relaxed mb-10 drop-shadow-sm">
              {hero.description}
            </p>

            <div className="flex flex-wrap gap-4">
              <a 
                href={hero.primaryCtaHref}
                className={cn(
                  buttonVariants({ variant: "default", size: "lg" }),
                  "px-8 py-4 text-base font-bold text-white transition-all duration-300 bg-blue-600 rounded-sm hover:bg-blue-500 shadow-lg shadow-blue-600/30 flex items-center"
                )}
              >
                {hero.primaryCtaLabel}
              </a>
              <a
                href={hero.secondaryCtaHref}
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "px-8 py-4 text-base font-bold rounded-sm border-[#1650fe] bg-[#1650fe] text-white backdrop-blur-sm hover:bg-[#0f46e0] hover:border-[#0f46e0]"
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
