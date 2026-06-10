import React from "react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  images: string[];
};

const baseProducts = [
  {
    title: "CORELESS PAPER ROLL",
    description:
      "Maximize efficiency and reduce environmental impact with our premium Coreless Thermal Paper Rolls. Featuring zero core waste and longer paper length per roll, they deliver exceptional value and lower shipping costs.",
    specs: "80mm x 80mm, 80mm x 50mm, 57mm x 50mm, and 57mm x 40mm.",
    disclaimer: "*Custom dimensions and coreless options available for bulk manufacturing.",
  },
  {
    title: "Portable/Mobile Printer Rolls",
    description:
      "Precision-cut portable and mobile printer rolls designed for jam-free performance in on-the-go applications like food delivery, logistics, and mobile POS systems.",
    specsList: [
      "57mm x 30mm (2 1/4\" x 30')",
      "57mm x 40mm (2 1/4\" x 50')",
      "80mm x 30mm (3 1/8\" x 30')",
      "80mm x 40mm (3 1/8\" x 50')",
    ],
    disclaimer: "*Custom dimensions and coreless options available for bulk manufacturing.",
  },
  {
    title: "Custom Printed Rolls",
    description:
      "Enhance your brand visibility with pre-printed logos, promotions, and return policies on the back of your receipt rolls.",
    specsList: [
      "80mm x 80mm - Standard POS Systems",
      "80mm x 70mm - High-Volume Retail",
      "57mm x 50mm - Credit Card Terminals",
      "57mm x 40mm - Mobile & Handheld Printers",
    ],
    disclaimer:
      "*Custom core sizes and up to 8-color precision printing available for bulk wholesale orders.",
  },
  {
    title: "BPA-Free Thermal Rolls",
    description:
      "Prioritize safety and compliance with our premium BPA-Free thermal receipt rolls. Designed to deliver sharp, dark, and long-lasting prints without harmful chemicals, ideal for retail and food service environments.",
    specs: "80mm x 80mm, 80mm x 70mm, 57mm x 50mm, and 57mm x 40mm.",
    disclaimer: "*Phenol-free (BPS-Free) options also available for strict regulatory markets.",
  },
  {
    title: "Colored Thermal Paper Rolls",
    description:
      "Organize your operations and highlight special promotions with our vibrant colored thermal rolls. Perfect for differentiating receipts, return tickets, or kitchen orders with excellent print contrast.",
    specs: "Colors: Yellow, Pink, Blue, Green. Sizes: 80mm x 80mm, 57mm x 50mm.",
    disclaimer: "*Custom color tinting available for large-scale wholesale manufacturing.",
  },
  {
    title: "High-Sensitivity Thermal Rolls",
    description:
      "Engineered for high-speed POS printers, these high-sensitivity thermal rolls ensure rapid, jam-free printing with deep black images. Ideal for high-volume checkout counters and busy supermarkets.",
    specsList: [
      "80mm x 80mm - Supermarket POS",
      "80mm x 60mm - Standard Retail",
      "57mm x 50mm - Compact Terminals",
    ],
    disclaimer: "*Available in 48gsm, 55gsm, and 65gsm to suit different printer requirements.",
  },
];

const ProductShowcase = ({ images }: Props) => {
  const products = baseProducts.map((product, index) => ({
    ...product,
    image: images[index] || "",
  }));

  return (
    <section id="x" className="bg-gray-50 py-20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 lg:text-4xl">
            Premium Thermal Paper Solutions
          </h2>
          <p className="text-lg text-gray-600">
            Engineered for clarity, durability, and seamless printer compatibility across all industries.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product, idx) => (
            <div
              key={idx}
              className="group flex h-full flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              <figure className="overflow-hidden px-6 pt-6">
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-48 w-full rounded-xl object-contain transition-transform duration-500 group-hover:scale-105"
                />
              </figure>
              <div className="flex flex-grow flex-col p-6">
                <h3 className="mb-3 text-center text-xl font-bold uppercase text-gray-900">
                  {product.title}
                </h3>
                <div className="flex flex-grow flex-col">
                  <p
                    className="mb-4 text-center text-sm leading-relaxed text-gray-600"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />

                  <div className="mb-4 w-full rounded-lg border border-gray-100 bg-gray-50 p-4 text-left">
                    <h4 className="mb-2 text-sm font-semibold text-gray-800">
                      Common Specifications:
                    </h4>
                    {product.specs ? (
                      <p className="text-sm text-gray-600">{product.specs}</p>
                    ) : (
                      <ul className="list-inside list-disc space-y-1.5 text-sm text-gray-600">
                        {product.specsList?.map((item, itemIndex) => (
                          <li key={itemIndex}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <p className="mt-auto text-center text-xs italic text-gray-400">
                    {product.disclaimer}
                  </p>
                </div>
                <div className="mt-6">
                  <Link
                    href="#contact"
                    className={cn(
                      buttonVariants({ variant: "default", size: "lg" }),
                      "flex w-full items-center justify-center rounded-xl bg-blue-600 text-white hover:bg-blue-700",
                    )}
                  >
                    Inquire Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
