import { ArrowRight, Check, MessageCircle } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  factoryGalleryImages: string[];
  factoryPreviewPoster: string;
  factoryPreviewVideo: string;
};

const ProductMatrix = ({
  factoryGalleryImages,
  factoryPreviewPoster,
  factoryPreviewVideo,
}: Props) => {
  const hasVideo = Boolean(factoryPreviewVideo);

  return (
    <section className="overflow-hidden bg-white py-20">
      <div className="container mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex w-full flex-col gap-4 lg:gap-6">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="relative order-2 w-full lg:order-1">
              <div className="absolute -left-6 -top-6 h-32 w-32 rounded-full bg-blue-600/10 blur-2xl" />
              <div className="absolute -bottom-6 -right-6 h-40 w-40 rounded-full bg-blue-600/10 blur-2xl" />

              <div className="group relative z-10 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl">
                <figure className="relative aspect-[4/3] w-full bg-neutral-900 lg:aspect-video">
                  {hasVideo ? (
                    <video
                      src={factoryPreviewVideo}
                      poster={factoryPreviewPoster}
                      className="absolute inset-0 h-full w-full object-cover"
                      muted
                      preload="none"
                      playsInline
                      controls
                    />
                  ) : (
                    <img
                      src={factoryPreviewPoster}
                      alt="Zhixinpaper factory preview"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  )}
                </figure>
              </div>
            </div>

            <div className="order-1 flex flex-col justify-center space-y-6 lg:order-2">
              <div className="inline-flex items-center space-x-3">
                <span className="h-[2px] w-10 bg-blue-600" />
                <span className="text-sm font-bold uppercase tracking-widest text-blue-600">
                  About Zhixinpaper
                </span>
              </div>

              <h2 className="text-3xl font-extrabold leading-[1.2] text-gray-900 md:text-4xl lg:text-5xl">
                15+ Years of Excellence in{" "}
                <span className="relative inline-block text-blue-600">
                  Thermal Paper
                  <svg
                    className="absolute -bottom-1 left-0 h-3 w-full text-blue-600/20"
                    viewBox="0 0 100 10"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0 5 Q 50 10 100 5"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="transparent"
                    />
                  </svg>
                </span>{" "}
                Manufacturing
              </h2>

              <p className="text-lg font-light leading-relaxed text-gray-600">
                As an industry-leading manufacturer, we specialize in delivering
                premium thermal paper rolls engineered for clarity, durability, and
                seamless performance. Our state-of-the-art facility combines advanced
                technology with rigorous quality control to meet the high-volume
                demands of global enterprises.
              </p>

              <div className="my-2 grid grid-cols-2 gap-6 border-y border-gray-100 py-5">
                <div className="flex flex-col">
                  <span className="mb-1 text-4xl font-black text-gray-900">
                    2,000<span className="text-blue-600">+</span>
                  </span>
                  <span className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                    Global Partners
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="mb-1 text-4xl font-black text-gray-900">
                    80<span className="text-blue-600">+</span>
                  </span>
                  <span className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                    Countries Served
                  </span>
                </div>
              </div>

              <ul className="mb-4 space-y-4 text-gray-700">
                <li className="flex items-start">
                  <div className="mr-4 mt-0.5 rounded-full bg-green-100 p-1">
                    <Check className="h-5 w-5 flex-shrink-0 text-green-600" />
                  </div>
                  <span className="text-base leading-tight">
                    <strong className="font-bold text-gray-900">
                      Certified Quality:
                    </strong>{" "}
                    ISO 9001 & FSC certified factory ensuring sustainable and
                    reliable production standards.
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="mr-4 mt-0.5 rounded-full bg-green-100 p-1">
                    <Check className="h-5 w-5 flex-shrink-0 text-green-600" />
                  </div>
                  <span className="text-base leading-tight">
                    <strong className="font-bold text-gray-900">
                      Factory-Direct Advantage:
                    </strong>{" "}
                    Competitive wholesale pricing without compromising on material
                    integrity.
                  </span>
                </li>
              </ul>

              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link
                  href="#hg"
                  className={cn(
                    buttonVariants({ variant: "default", size: "lg" }),
                    "flex items-center rounded-full bg-blue-600 px-8 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700",
                  )}
                >
                  Request a Quote
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="https://api.whatsapp.com/send/?phone=8618092117618"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "flex items-center gap-2 rounded-full border-[#0055ff] bg-[#0055ff] px-8 text-white hover:border-[#0047d6] hover:bg-[#0047d6] hover:text-white",
                  )}
                >
                  <MessageCircle className="h-5 w-5 text-white" />
                  WhatsApp
                </Link>
              </div>
            </div>
          </div>

          <div className="w-full">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
              {factoryGalleryImages.map((src, index) => (
                <div
                  key={index}
                  className="aspect-[4/3] overflow-hidden rounded-xl border border-gray-100 bg-gray-100 shadow-sm"
                >
                  <img
                    src={src}
                    alt={`Factory gallery ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductMatrix;
