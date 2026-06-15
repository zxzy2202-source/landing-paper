import React from 'react';
import { 
  Settings, 
  Palette, 
  ShieldCheck, 
  Truck, 
  Globe, 
  Headphones 
} from "lucide-react";

const services = [
  {
    title: "Custom OEM Solutions",
    icon: <Settings className="w-8 h-8 text-blue-600" />,
    description: "Tailored roll dimensions, core sizes, and paper weights (48gsm-80gsm) to match your specific hardware requirements."
  },
  {
    title: "Brand Customization",
    icon: <Palette className="w-8 h-8 text-blue-600" />,
    description: "High-precision back-printing for logos, terms of service, and promotional content in up to 8 colors."
  },
  {
    title: "Quality Assurance",
    icon: <ShieldCheck className="w-8 h-8 text-blue-600" />,
    description: "Strict ISO 9001 protocols and premium raw materials ensure jam-free performance and long-lasting print clarity."
  },
  {
    title: "Global Distribution",
    icon: <Truck className="w-8 h-8 text-blue-600" />,
    description: "Expert logistics management with moisture-proof export packaging, delivering reliably to 80+ countries."
  },
  {
    title: "Market Insight",
    icon: <Globe className="w-8 h-8 text-blue-600" />,
    description: "15+ years of cross-border experience to help you navigate local compliance and market trends effectively."
  },
  {
    title: "24/7 Priority Support",
    icon: <Headphones className="w-8 h-8 text-blue-600" />,
    description: "Dedicated account managers providing rapid technical support and order tracking throughout the lifecycle."
  }
];

const Services = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">Comprehensive Specialty Paper Services</h2>
          <p className="text-lg text-gray-600">Beyond manufacturing, we provide end-to-end support to ensure your supply chain remains seamless and competitive.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <div key={idx} className="p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 group">
              <div className="mb-6 bg-white w-16 h-16 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
