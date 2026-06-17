'use client';

import React, { startTransition, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin } from "lucide-react";

type Props = {
  categories: string[];
  contact: {
    address: string;
    email: string;
    phone: string;
    whatsapp: string;
  };
};

const ContactSection = ({ categories, contact }: Props) => {
  const [feedback, setFeedback] = useState("");
  const [pending, setPending] = useState(false);
  const [productInterest, setProductInterest] = useState(categories[0] ?? "");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    setFeedback("");

    const formData = new FormData(e.currentTarget);

    const response = await fetch("/api/inquiries/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        companyName: formData.get("company_name"),
        contactEmail: formData.get("contact_email"),
        contactName: formData.get("contact_name"),
        message: formData.get("inquiry_message"),
        productInterest,
        sourcePath: window.location.pathname,
        whatsappNumber: formData.get("whatsapp_number"),
      }),
    });

    const result = (await response.json()) as { error?: string; message?: string };
    setPending(false);

    if (!response.ok) {
      setFeedback(result.error ?? "Submission failed. Please try again.");
      return;
    }

    e.currentTarget.reset();
    startTransition(() => {
      setProductInterest(categories[0] ?? "");
      setFeedback(result.message ?? "Inquiry submitted! We will contact you soon.");
    });
  };

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col lg:flex-row border border-gray-200">
          
          {/* Left: Form */}
          <div className="order-1 lg:order-1 lg:w-7/12 p-10 lg:p-14">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Request Your Quote & Sample</h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Full Name *</label>
                  <Input name="contact_name" placeholder="John Doe" required className="bg-gray-50 focus:bg-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Business Email *</label>
                  <Input type="email" name="contact_email" placeholder="john@company.com" required className="bg-gray-50 focus:bg-white" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label htmlFor="company_name" className="text-sm font-medium text-gray-700">Company Name</label>
                  <Input id="company_name" name="company_name" placeholder="Your Company Ltd." className="bg-gray-50 focus:bg-white" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="whatsapp_number" className="text-sm font-medium text-gray-700">WhatsApp Number</label>
                  <Input id="whatsapp_number" type="tel" name="whatsapp_number" placeholder="+86 135 7282 1237" className="bg-gray-50 focus:bg-white" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Product of Interest</label>
                <select
                  name="product_interest"
                  value={productInterest}
                  onChange={(event) => setProductInterest(event.target.value)}
                  className="h-11 w-full rounded-lg border border-input bg-gray-50 px-3 text-sm outline-none transition focus:border-ring focus:bg-white focus:ring-3 focus:ring-ring/50"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Specific Requirements (Dimensions, Quantity, etc.)</label>
                <Textarea 
                  name="inquiry_message" 
                  className="h-32 bg-gray-50 focus:bg-white" 
                  placeholder="Please describe your roll dimensions (e.g., 80x80mm), core size, and estimated monthly volume..." 
                />
              </div>

              {feedback ? (
                <p className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
                  {feedback}
                </p>
              ) : null}

              <Button type="submit" disabled={pending} className="w-full text-lg mt-4 shadow-md hover:shadow-lg bg-blue-600 hover:bg-blue-700 h-12">
                {pending ? "Submitting..." : "Submit Request"}
              </Button>
            </form>
          </div>

          {/* Right: Contact Info */}
          <div id="hg" className="order-2 lg:order-2 lg:w-5/12 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white p-10 lg:p-14 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-blue-500 rounded-full opacity-30 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-56 h-56 bg-cyan-500 rounded-full opacity-20 blur-3xl"></div>
            <div className="relative z-10">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Get a Free Sample</h2>
              <p className="text-blue-100 mb-10 text-lg">
                Experience our premium quality firsthand. Contact our global sales team to discuss your customized requirements and request a sample pack.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-white/10 p-3 rounded-lg text-white backdrop-blur-sm border border-white/20">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-200 font-medium">Email Us</p>
                    <a href={`mailto:${contact.email}`} className="text-lg font-semibold hover:text-white transition-colors">{contact.email}</a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-white/10 p-3 rounded-lg text-white backdrop-blur-sm border border-white/20">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-200 font-medium">WhatsApp</p>
                    <a href={`tel:${contact.phone}`} className="text-lg font-semibold hover:text-white transition-colors">{contact.phone}</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-white/10 p-3 rounded-lg text-white backdrop-blur-sm border border-white/20">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-200 font-medium">Headquarters</p>
                    <p className="text-base text-white leading-relaxed">{contact.address}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
