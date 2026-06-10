import Footer from "@/components/layout/Footer";
import FloatingActions from "@/components/layout/FloatingActions";
import Navbar from "@/components/layout/Navbar";
import ContactSection from "@/components/sections/ContactSection";
import CTASection from "@/components/sections/CTASection";
import Hero from "@/components/sections/Hero";
import Logistics from "@/components/sections/Logistics";
import Marquee from "@/components/sections/Marquee";
import PainPoints from "@/components/sections/PainPoints";
import ProductMatrix from "@/components/sections/ProductMatrix";
import ProductShowcase from "@/components/sections/ProductShowcase";
import Services from "@/components/sections/Services";
import TrustSection from "@/components/sections/TrustSection";
import type { PublicMediaSlotMap } from "@/lib/services/site-settings";
import type { ContactConfig, HeroContent } from "@/lib/siteSettingsTypes";

type Props = {
  categories: string[];
  contact: ContactConfig;
  hero: HeroContent;
  mediaSlots: PublicMediaSlotMap;
};

export function MarketingLandingPage({
  hero,
  contact,
  categories,
  mediaSlots,
}: Props) {
  return (
    <main className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900">
      <Navbar />

      <div className="pt-[72px]">
        <Hero hero={hero} />
        <Marquee backgroundImage={mediaSlots["marquee.default.background"]} />
        <ProductMatrix
          factoryPreviewVideo={mediaSlots["about.factory.preview.video"]}
          factoryPreviewPoster={mediaSlots["about.factory.preview.poster"]}
          factoryGalleryImages={[
            mediaSlots["about.factory.gallery.1"],
            mediaSlots["about.factory.gallery.2"],
            mediaSlots["about.factory.gallery.3"],
            mediaSlots["about.factory.gallery.4"],
            mediaSlots["about.factory.gallery.5"],
            mediaSlots["about.factory.gallery.6"],
            mediaSlots["about.factory.gallery.7"],
            mediaSlots["about.factory.gallery.8"],
          ]}
        />
        <TrustSection backgroundMedia={mediaSlots["trust.default.background"]} />
        <ProductShowcase
          images={[
            mediaSlots["products.showcase.1"],
            mediaSlots["products.showcase.2"],
            mediaSlots["products.showcase.3"],
            mediaSlots["products.showcase.4"],
            mediaSlots["products.showcase.5"],
            mediaSlots["products.showcase.6"],
          ]}
        />
        <PainPoints
          images={[
            mediaSlots["pain-points.card.1"],
            mediaSlots["pain-points.card.2"],
            mediaSlots["pain-points.card.3"],
            mediaSlots["pain-points.card.4"],
          ]}
        />
        <Services />
        <Logistics
          images={[
            mediaSlots["logistics.card.1"],
            mediaSlots["logistics.card.2"],
            mediaSlots["logistics.card.3"],
            mediaSlots["logistics.card.4"],
          ]}
        />
        <CTASection />
        <ContactSection categories={categories} contact={contact} />
      </div>

      <Footer />
      <FloatingActions />
    </main>
  );
}
