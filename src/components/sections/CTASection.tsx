import React from 'react';
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from 'next/link';

const CTASection = () => {
  return (
    <section className="py-16 bg-blue-600 relative overflow-hidden">
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-blue-500 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-blue-400 rounded-full opacity-20 blur-3xl"></div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Optimize Your Specialty Paper Supply?</h2>
        <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto font-medium">
          Join 2,000+ global partners who trust Zhixinpaper for premium quality, competitive pricing, and reliable factory-direct delivery.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link 
            href="#contact" 
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "bg-white text-blue-600 hover:bg-gray-100 px-10 py-4 text-lg font-bold rounded-full shadow-xl transition-all hover:scale-105 h-auto"
            )}
          >
            Request Factory-Direct Quote
          </Link>
          <Link 
            href="https://api.whatsapp.com/send/?phone=8618092117618" 
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "relative z-10 border-2 border-white bg-white px-10 py-4 text-lg font-bold text-[#004cff] rounded-full h-auto hover:bg-white/95 hover:text-[#004cff]"
            )}
          >
            Chat with an Expert
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
