import React from "react";

type Props = {
  images: string[];
};

const baseLogisticsSteps = [
  {
    title: "Secure Storage & Shipping Solutions",
    description:
      "Secure warehousing optimized for thermal paper rolls & Labels. We offer palletized, bulk, consolidated, and full-container loading to ensure seamless global distribution.",
  },
  {
    title: "Marine-Grade Export Packaging",
    description:
      "We utilize 5-layer moisture-proof wrapping, heavy-duty shrink film, and reinforced wooden pallets engineered to protect your rolls from humidity and transit stress.",
  },
  {
    title: "Precision Container Loading",
    description:
      "Our specialized logistics team enforces strict space-optimization and securing protocols at our Xi'an factory, eliminating cargo shifting and preventing crush damage.",
  },
  {
    title: "End-to-End Global Freight",
    description:
      "Partnering with top-tier carriers, we ensure seamless customs clearance and reliable freight tracking directly from our factory floor to destinations in 80+ countries.",
  },
];

const Logistics = ({ images }: Props) => {
  const logisticsSteps = baseLogisticsSteps.map((step, index) => ({
    ...step,
    image: images[index] || "",
  }));

  return (
    <section className="border-b border-gray-100 bg-white py-16">
      <div className="container mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            Zhixinpaper Global Logistics: Delivering Trust Worldwide
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Ensuring your bulk thermal paper orders arrive safely, on time, and in pristine condition. Backed by 15+ years of factory-direct export excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {logisticsSteps.map((step, idx) => (
            <div
              key={idx}
              className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50 transition-shadow duration-300 hover:shadow-lg"
            >
              <div className="relative h-64 overflow-hidden md:h-56">
                <img
                  src={step.image}
                  alt={step.title}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute left-4 top-4 flex h-8 w-8 items-center justify-center rounded-sm bg-blue-700 font-bold text-white shadow-md">
                  {idx + 1}
                </div>
              </div>
              <div className="p-6">
                <h3 className="mb-2 text-xl font-bold text-gray-900">{step.title}</h3>
                <p className="text-sm leading-relaxed text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Logistics;
