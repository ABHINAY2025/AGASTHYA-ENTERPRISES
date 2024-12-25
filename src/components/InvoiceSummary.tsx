import React from 'react';
import { numberToWords } from '../utils/numberToWords';

interface InvoiceSummaryProps {
  subtotal: string;
  cgst: string;
  sgst: string;
  pcgst:number;
  psgst:number;
  total: number;
  accountDetails: {
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    accountHolder: string;
  };
}

export default function InvoiceSummary({ 
  subtotal = '',
  cgst = '',
  sgst = '',
  total = 0,
  psgst=0,
  pcgst=0,
  accountDetails = {
    bankName: 'Default Bank',
    accountNumber: '0000000000',
    ifscCode: 'DEFAULT1234',
    accountHolder: 'Default Holder',
  },
}: InvoiceSummaryProps) {
  return (
    <div className="bg-white p-6 items-center grid grid-cols-2 gap-52">
      {/* Left - Amount in Words & Account Details */}
      <div className="space-y-6">
  
        <div>
          <h3 className="font-semibold mb-2">Account Details:</h3>
          <div className="space-y-1 text-gray-700">
            <p>Bank Name: {accountDetails.bankName}</p>
            <p>A/C No: {accountDetails.accountNumber}</p>
            <p>IFSC Code: {accountDetails.ifscCode}</p>
            <p>A/C Holder: {accountDetails.accountHolder}</p>
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold mb-2">Amount in Words:</h3>
          <p className="text-gray-700">{numberToWords(total)}</p>
        </div>
      </div>

      {/* Right - Amount Calculations */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>₹{Number(subtotal).toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>CGST  {'('+pcgst+'%)'}:</span>
          <span>₹{Number(cgst).toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>SGST  {'('+psgst+'%)'}:</span>
          <span>₹{Number(sgst).toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold border-t pt-2">
          <span>Grand Total:</span>
          <span>₹{Number(total).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}