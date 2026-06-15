import React from 'react';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';

const FloatingActions = () => {
  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-3">
      <Link 
        href="https://api.whatsapp.com/send/?phone=8618092117618" 
        target="_blank"
        className="bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 group relative"
      >
        <MessageCircle className="w-7 h-7" />
        <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white text-gray-900 px-3 py-1 rounded-lg text-sm font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-gray-100">
          WhatsApp Us
        </span>
      </Link>
    </div>
  );
};

export default FloatingActions;
