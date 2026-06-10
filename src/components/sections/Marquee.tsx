import React from "react";

type Props = {
  backgroundImage: string;
};

const Marquee = ({ backgroundImage }: Props) => {
  return (
    <section className="relative flex h-[20vh] min-h-[100px] max-h-[200px] w-full items-center justify-center overflow-hidden bg-gray-50">
      <img
        src={backgroundImage}
        alt="Zhixinpaper Thermal Paper Roll"
        className="absolute inset-0 h-full w-full object-cover select-none"
      />
      <div className="absolute inset-0 bg-slate-950/20" />
      <div className="relative z-10 max-w-5xl px-4 text-center md:px-8">
        <h2
          className="mb-2 text-3xl font-bold text-white drop-shadow-lg md:mb-4 md:text-4xl lg:text-5xl"
          style={{ textShadow: "0 2px 4px rgba(0,0,0,0.6)" }}
        >
          Certified Excellence in Manufacturing
        </h2>
      </div>
    </section>
  );
};

export default Marquee;
