import React from "react";

const highlights = [
  "Authentic factory workshop and automated production lines",
  "State-of-the-art manufacturing facility built for large B2B volume",
  "15+ years of thermal paper manufacturing excellence",
  "ISO 9001 and FSC certified production standards",
];

const metrics = [
  { label: "Partners", value: "2,000+" },
  { label: "Years Experience", value: "15+" },
  { label: "Square Meters", value: "4,600+" },
  { label: "Total Employees", value: "70+" },
];

type Props = {
  backgroundMedia: string;
};

function isVideoLikeUrl(url: string) {
  return /\.(mp4|webm|mov|m4v|ogg)(\?.*)?$/i.test(url);
}

const TrustSection = ({ backgroundMedia }: Props) => {
  const isVideo = isVideoLikeUrl(backgroundMedia);

  return (
    <section id="trust" className="relative overflow-hidden bg-slate-950">
      {isVideo ? (
        <video
          src={backgroundMedia}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        />
      ) : (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${backgroundMedia}')`,
          }}
        />
      )}
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(2,6,23,0.82),rgba(15,23,42,0.72))]" />

      <div className="relative z-10 container mx-auto flex min-h-screen flex-col justify-center px-4 pb-20 pt-32 lg:px-8">
        <div className="mb-12 max-w-3xl rounded-2xl border border-white/10 bg-black/35 p-6 backdrop-blur-sm">
          <span className="mb-3 block text-xs font-bold uppercase tracking-widest text-cyan-400">
            Expert Insight
          </span>
          <p className="text-lg leading-relaxed text-white/85">
            15+ years of manufacturing excellence, global reach to 80+ countries,
            and a stable OEM workflow built for long-term distributor partnerships.
          </p>
        </div>

        <div className="mx-auto flex max-w-3xl flex-col items-center justify-start pb-20 pt-12 text-center">
          <h2 className="mb-10 text-5xl font-bold text-white">About ZXPapers</h2>

          <ul className="mx-auto max-w-xl space-y-5 text-left text-lg text-white/90 lg:text-xl">
            {highlights.map((item) => (
              <li key={item} className="flex items-start">
                <svg
                  className="mr-4 mt-0.5 h-7 w-7 flex-shrink-0 text-cyan-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="relative z-10 w-full border-t border-white/10 bg-black/35 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8 lg:px-8 lg:py-10">
          <div className="grid grid-cols-2 gap-8 text-center text-white md:grid-cols-4">
            {metrics.map((metric) => (
              <div key={metric.label}>
                <div className="mb-2 text-4xl font-bold text-white lg:text-5xl">
                  {metric.value}
                </div>
                <div className="text-sm font-medium tracking-wider text-white/80 lg:text-base">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
