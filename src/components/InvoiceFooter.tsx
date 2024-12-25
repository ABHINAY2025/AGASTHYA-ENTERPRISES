import React from 'react';

interface InvoiceFooterProps {
  terms: string[];
  companyName: string;
}

export default function InvoiceFooter({ terms, companyName }: InvoiceFooterProps) {
  return (
    <div className="bg-white border-t-2 border-gray-300 p-6 rounded-b-lg  grid grid-cols-2 gap-8">
      {/* Left - Terms and Conditions */}
      <div>
        <h3 className="font-semibold  mb-3">Terms and Conditions:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
          {terms.map((term, index) => (
            <li key={index}>{term}</li>
          ))}
        </ul>
          <p className="text-sm mt-14 text-gray-600">Receiver's Signature</p>
      </div>

      {/* Right - Signatures */}
      <div className="text-right ">
        <div>
          <p className="text-sm text-gray-600">For {companyName}</p>
          <p className="text-sm mt-36 text-gray-600">Authorised Signatory</p>
        </div>
      </div>
    </div>
  );
}