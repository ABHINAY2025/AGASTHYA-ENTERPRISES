import React from 'react';
import { Building2 } from 'lucide-react';

interface InvoiceHeaderProps {
  logo?: string;
  companyName: string;
  companyAddress: string;
  contactNumber: string;
}

export default function InvoiceHeader({ logo, companyName, companyAddress, contactNumber }: InvoiceHeaderProps) {
  return (
    <div className="bg-white p-6 rounded-t-lg shadow-md">
      <div className="flex justify-between gap-4">
        {/* Left - Logo */}
        <div className="flex items-center ">
          {logo ? (
            <img src={logo} alt="Company Logo" className="h-16 w-auto object-contain" />
          ) : (
            <Building2 className="h-16 w-16 text-gray-400" />
          )}
        </div>

        {/* Center - Company Details */}
        <div className="">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{companyName}</h1>
          <p className="text-gray-600 whitespace-pre-line">{companyAddress}</p>
        </div>

        {/* Right - Contact & Invoice Title */}
        <div className="text-right">
          <h2 className="text-xl font-bold text-gray-900 mb-4">TAX INVOICE</h2>
          <p className="text-gray-600">Contact: {contactNumber}</p>
        </div>
      </div>
    </div>
  );
}