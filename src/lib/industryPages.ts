export type IndustryPageContent = {
  capabilities: string[];
  challengeTitle: string;
  challenges: string[];
  ctaHref: string;
  ctaLabel: string;
  faqs: Array<{
    answer: string;
    question: string;
  }>;
  heroDescription: string;
  heroEyebrow: string;
  heroImageUrl?: string;
  heroTitle: string;
  metrics: Array<{
    label: string;
    value: string;
  }>;
  solutionTitle: string;
  solutions: string[];
};

export type IndustryPageSeed = {
  content: IndustryPageContent;
  seoDescription: string;
  seoTitle: string;
  slug: string;
  summary: string;
  title: string;
};

export const defaultIndustryPages: IndustryPageSeed[] = [
  {
    slug: "retail-pos",
    title: "Thermal Paper for Retail POS Networks",
    summary:
      "Factory-direct receipt roll supply for retailers, franchise groups, and POS distributors that need consistent quality and private-label flexibility.",
    seoTitle: "Retail POS Thermal Paper Manufacturer | Zhixinpaper",
    seoDescription:
      "OEM receipt rolls for retail POS distributors with stable quality, custom printing, and wholesale fulfillment support.",
    content: {
      heroEyebrow: "Industry Landing Page",
      heroImageUrl: "",
      heroTitle: "Built for fast-moving retail checkout environments",
      heroDescription:
        "Support multi-store retail programs with thermal rolls that print cleanly, load reliably, and reinforce your brand through custom back printing and packaging.",
      challengeTitle: "What retail teams usually struggle with",
      challenges: [
        "Inconsistent image density across printer fleets and store formats.",
        "Peak-season stockouts that break distributor trust and reorder cadence.",
        "Brand teams needing promotional pre-printing without sacrificing paper quality.",
      ],
      solutionTitle: "How our factory program helps",
      solutions: [
        "OEM and private-label roll specs matched to mainstream Epson, Star, and Bixolon POS printers.",
        "Flexible carton, pallet, and brand packaging support for chain rollout programs.",
        "BPA-free, coreless, and high-sensitivity options for different retail environments.",
      ],
      capabilities: [
        "80x80mm, 80x70mm, 57x50mm retail roll formats",
        "Promotional back printing and logo customization",
        "Wholesale export packaging and mixed container support",
      ],
      metrics: [
        { label: "Countries served", value: "80+" },
        { label: "Global partners", value: "2,000+" },
        { label: "OEM factory experience", value: "15+ years" },
      ],
      ctaLabel: "Request Retail Pricing",
      ctaHref: "#contact",
      faqs: [
        {
          question: "Can you match our current roll specifications?",
          answer:
            "Yes. We can produce against your width, diameter, core size, grammage, printing, and packaging requirements.",
        },
        {
          question: "Do you support private-label retail programs?",
          answer:
            "Yes. We support branded cartons, shrink wrap, inner labels, and pre-printed promotional backs.",
        },
      ],
    },
  },
  {
    slug: "logistics-labeling",
    title: "Thermal Rolls for Logistics and Waybill Workflows",
    summary:
      "Supply chain-ready thermal paper for courier networks, warehouse printers, mobile delivery devices, and logistics service providers.",
    seoTitle: "Logistics Thermal Paper & Waybill Rolls | Zhixinpaper",
    seoDescription:
      "Thermal roll manufacturing for courier, warehouse, and delivery systems with dependable print density and mobile printer compatibility.",
    content: {
      heroEyebrow: "Industry Landing Page",
      heroImageUrl: "",
      heroTitle: "Reliable thermal media for shipping, scanning, and last-mile delivery",
      heroDescription:
        "We help logistics operators reduce jams, preserve barcode clarity, and keep mobile print workflows stable across warehouses and field devices.",
      challengeTitle: "Common logistics print pain points",
      challenges: [
        "Mobile and handheld printers require tighter tolerance than standard POS use cases.",
        "Barcodes fade or scan poorly when thermal coating is inconsistent.",
        "Cross-border fulfillment teams need dependable replenishment with short response times.",
      ],
      solutionTitle: "How we support logistics programs",
      solutions: [
        "Mobile-printer-ready roll formats for dispatch, delivery, and handheld field devices.",
        "Stable thermal coating for dark image density and barcode readability.",
        "Fast sample turnaround and production planning for recurring shipping demand.",
      ],
      capabilities: [
        "Portable printer and handheld terminal roll formats",
        "High-sensitivity thermal coatings for fast print heads",
        "OEM packaging for courier and logistics distributors",
      ],
      metrics: [
        { label: "Lead response", value: "<24h" },
        { label: "Export markets", value: "80+" },
        { label: "Custom formats", value: "Flexible" },
      ],
      ctaLabel: "Discuss Logistics Specs",
      ctaHref: "#contact",
      faqs: [
        {
          question: "Can you support mobile printer rolls?",
          answer:
            "Yes. We support common portable printer dimensions and can sample custom sizes for validation.",
        },
        {
          question: "Do you offer barcode-friendly paper grades?",
          answer:
            "Yes. High-sensitivity and application-matched grades are available for stronger scanner performance.",
        },
      ],
    },
  },
  {
    slug: "banking-atm",
    title: "ATM and Banking Thermal Roll Manufacturing",
    summary:
      "Precision ATM and banking paper supply for financial device distributors that need consistent dimensions, winding quality, and security-minded fulfillment.",
    seoTitle: "ATM Thermal Paper Rolls Manufacturer | Zhixinpaper",
    seoDescription:
      "OEM ATM and banking thermal rolls with stable quality control, exact dimensions, and export-ready production support.",
    content: {
      heroEyebrow: "Industry Landing Page",
      heroImageUrl: "",
      heroTitle: "Exacting roll quality for banking and ATM printer systems",
      heroDescription:
        "For financial terminals and ATM service providers, we deliver clean winding, reliable feed performance, and manufacturing discipline built for sensitive applications.",
      challengeTitle: "Where banking buyers need more control",
      challenges: [
        "ATM devices are less tolerant of winding defects, edge damage, and diameter drift.",
        "Financial customers expect dependable print durability and clean paper conversion.",
        "Procurement teams need long-term consistency, not one-off samples that look good only once.",
      ],
      solutionTitle: "What our manufacturing program focuses on",
      solutions: [
        "Tighter conversion controls for roll diameter, core, and winding consistency.",
        "Application-specific grades for ATM and banking receipt environments.",
        "Stable OEM fulfillment for recurring procurement schedules and distributor programs.",
      ],
      capabilities: [
        "ATM and banking roll formats",
        "Strict QC around winding, cut edge, and image density",
        "Long-term OEM supply cooperation for distributors",
      ],
      metrics: [
        { label: "Factory certifications", value: "ISO 9001 / FSC" },
        { label: "Manufacturing focus", value: "OEM / ODM" },
        { label: "Program support", value: "Recurring supply" },
      ],
      ctaLabel: "Request ATM Samples",
      ctaHref: "#contact",
      faqs: [
        {
          question: "Can you manufacture to exact ATM dimensions?",
          answer:
            "Yes. We can follow your diameter, core, paper weight, and winding requirements for ATM programs.",
        },
        {
          question: "Do you support long-term wholesale supply?",
          answer:
            "Yes. Our process is designed for recurring distributor and private-label cooperation rather than one-off batches.",
        },
      ],
    },
  },
];

export function getDefaultIndustryBySlug(slug: string) {
  return defaultIndustryPages.find((item) => item.slug === slug) ?? null;
}
