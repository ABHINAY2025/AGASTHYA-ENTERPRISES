import React from 'react';
import html2pdf from 'html2pdf.js';
import type { InvoiceData } from '../types/invoice';
import InvoiceFooter from './InvoiceFooter';
import InvoiceSummary from './InvoiceSummary';

interface InvoicePreviewProps {
  data: InvoiceData;
}

export default function InvoicePreview({ data }: InvoicePreviewProps) {
  const subtotal = data.items.reduce((sum, item) => sum + item.amount, 0);
  const cgst = (data.cgst / 100) * 100;
  const sgst = (data.sgst / 100) * 100;
  const total = subtotal + cgst + sgst;

  const handleDownload = () => {
    const element = document.getElementById('invoice') as HTMLElement;
    html2pdf().from(element).save('invoice.pdf');
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg flex flex-col min-h-screen" id="invoice">
      <div className="mb-8 flex-grow">
        <div className="flex justify-between mb-8">
          {data.logo && (
            <div>
              <p className="text-gray-600">GSTIN: {data.companyGstin}</p>
              <img src={data.logo} alt="Company Logo" className="w-16 h-16 object-contain" />
            </div>
          )}
          <div>
            <h2 className="text-md underline underline-offset-2 font-semibold">TAX INVOICE</h2>
            <div className="content-center border-2 flex flex-col items-center border-black">
              <h1 className="text-2xl font-bold">{data.companyName}</h1>
              <p className="text-gray-600 whitespace-pre-line">{data.companyAddress}</p>
            </div>
          </div>
          <div className="text-right">
            <p>Invoice #: {data.invoiceNumber}</p>
            <p>Date: {new Date(data.date).toLocaleDateString()}</p>
            <p>Phone: {data.phone}</p>
            <p>Off: {data.off}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 mb-8">
          <h3 className="text-lg font-semibold mb-2">Bill To:</h3>
          <p className="font-medium">{data.customer.name}</p>
          <p className="text-gray-600 whitespace-pre-line">{data.customer.address}</p>
          <p className="text-gray-600">GSTIN: {data.customer.gstin}</p>
        </div>

        <table className="w-full mb-8">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left">S.No</th>
              <th className="px-4 py-2 text-left">PARTICULARS</th>
              <th className="px-4 py-2 text-left">HSN Code</th>
              <th className="px-4 py-2 text-right">Quantity</th>
              <th className="px-4 py-2 text-right">Unit Rate</th>
              <th className="px-4 py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="px-4 py-2 text-left">{index + 1}</td>
                <td className="px-4 py-2">{item.description}</td>
                <td className="px-4 py-2">{item.hsnCode}</td>
                <td className="px-4 py-2 text-right">{item.quantity}</td>
                <td className="px-4 py-2 text-right">₹{item.rate.toFixed(2)}</td>
                <td className="px-4 py-2 text-right">₹{item.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <InvoiceSummary
        subtotal={subtotal.toFixed(2)}
        cgst={cgst.toFixed(2)}
        sgst={sgst.toFixed(2)}
        pcgst={data.cgst}
        psgst={data.sgst}
        total={total}
        accountDetails={{
          bankName: 'Default Bank',
          accountNumber: '0000000000',
          ifscCode: 'DEFAULT1234',
          accountHolder: 'Default Holder',
        }}
      />
      <InvoiceFooter
        terms={[
          'Goods once sold cannot be returned.',
          'Payment due within 30 days.',
          'Contact support@example.com for inquiries.',
        ]}
        companyName={data.companyName}
      />
      
      {/* Download Button */}
      <div className="mt-8 text-center">
        <button
          onClick={handleDownload}
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
}
