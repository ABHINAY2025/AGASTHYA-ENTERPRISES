import React from 'react';

interface BillingSectionProps {
  customerName: string;
  customerAddress: string;
  customerGstin: string;
  invoiceNumber: string;
  date: string;
}

export default function BillingSection({ 
  customerName, 
  customerAddress, 
  customerGstin, 
  invoiceNumber, 
  date 
}: BillingSectionProps) {
  return (
    <div className="bg-white p-6 shadow-md grid grid-cols-2 gap-8">
      {/* Left - Customer Details */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Bill To:</h3>
        <div className="space-y-2">
          <p className="font-medium">{customerName}</p>
          <p className="text-gray-600 whitespace-pre-line">{customerAddress}</p>
          <p className="text-gray-600">GSTIN: {customerGstin}</p>
        </div>
      </div>

      {/* Right - Invoice Details */}
      <div className="text-right">
        <div className="space-y-2">
          <p><span className="font-medium">Invoice No:</span> {invoiceNumber}</p>
          <p><span className="font-medium">Date:</span> {date}</p>
        </div>
      </div>
    </div>
  );
}