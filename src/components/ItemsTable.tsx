import React from 'react';
import type { Item } from '../types/invoice';

interface ItemsTableProps {
  items: Item[];
}

export default function ItemsTable({ items }: ItemsTableProps) {
  return (
    <div className="bg-white shadow-md">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left">S.No</th>
            <th className="px-4 py-3 text-left">PARTICULARS</th>
            <th className="px-4 py-3 text-left">HSN Code</th>
            <th className="px-4 py-3 text-right">Quantity</th>
            <th className="px-4 py-3 text-right">Unit Rate</th>
            <th className="px-4 py-3 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index} className="border-b">
              <td className="px-4 py-3">{index + 1}</td>
              <td className="px-4 py-3">{item.description}</td>
              <td className="px-4 py-3">{item.hsnCode}</td>
              <td className="px-4 py-3 text-right">{item.quantity}</td>
              <td className="px-4 py-3 text-right">₹{item.rate.toFixed(2)}</td>
              <td className="px-4 py-3 text-right">₹{item.amount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}