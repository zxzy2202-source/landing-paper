import React from "react";

type Props = {
  images: string[];
};

const basePainPoints = [
  {
    title: "Color appears dull, fades easily",
    description:
      "Using low-quality thermal coatings results in blurry barcodes that cannot be scanned, receipt text fading quickly, and causing serious customer complaints and after-sales disputes.",
  },
  {
    title: "Excessive paper debris Frequent paper jams",
    description:
      "Rough cutting techniques produce excessive paper debris. Prolonged use not only leads to frequent paper jams, reducing work efficiency, but also causes severe wear on expensive print heads, increasing maintenance costs.",
  },
  {
    title: "Shortage of length, uneven sizes",
    description:
      "Some suppliers cut corners, providing actual lengths far below the claimed measurements; or use oversized, heavy cores to inflate the paper weight, secretly driving up your actual procurement costs.",
  },
  {
    title: "Delivery delays, inconsistent quality",
    description:
      "Factories lacking large-scale production capabilities cannot ensure the timely delivery of bulk orders or consistency in quality across batches, severely disrupting your supply chain and inventory planning.",
  },
];

const PainPoints = ({ images }: Props) => {
  const painPoints = basePainPoints.map((point, index) => ({
    ...point,
    image: images[index] || "",
  }));

  return (
    <section id="why-us" className="w-full scroll-mt-24 bg-gray-50 py-16">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            Are you often faced with these challenges when purchasing thermal paper and labels?
          </h2>
          <p className="text-lg text-gray-600">
            Poor-quality consumables not only increase hidden costs but also severely impact your business operational efficiency, equipment lifespan, and the end customer experience.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
          {painPoints.map((point, idx) => (
            <div
              key={idx}
              className="flex h-full flex-col overflow-hidden rounded-2xl border-t-4 border-red-500 bg-white shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <figure className="px-4 pt-4">
                <img
                  src={point.image}
                  alt={point.title}
                  className="h-48 w-full rounded-xl object-cover"
                />
              </figure>
              <div className="flex flex-grow flex-col p-6">
                <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                  {point.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600">{point.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PainPoints;
