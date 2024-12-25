import React from 'react';
import { Trash2 } from 'lucide-react';
import type { Item } from '../types/invoice';

interface ItemRowProps {
  item: Item;
  index: number;
  onUpdate: (index: number, field: keyof Item, value: string | number) => void;
  onRemove: (index: number) => void;
}

export default function ItemRow({ item, index, onUpdate, onRemove }: ItemRowProps) {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Item
  ) => {
    const value = e.target.value; // Always treat the input value as a string
    onUpdate(index, field, value);
  };

  const parseToNumber = (value: string): number => {
    const number = parseFloat(value);
    return isNaN(number) ? 0 : number;
  };

  // This function will only convert to a number for calculations if needed
  const handleAmountChange = () => {
    const quantity = parseToNumber(item.quantity);
    const rate = parseToNumber(item.rate);
    const amount = quantity * rate;
    onUpdate(index, 'amount', amount);
  };

  // Safely handle amount value and apply toFixed() for formatting
  const formattedAmount = typeof item.amount === 'number' ? item.amount.toFixed(2) : '0.00';

  return (
    <div className="grid grid-cols-12 gap-4 items-start">
      <div className="col-span-4">
        <label className="block text-sm font-medium text-gray-700">PARTICULARS</label>
        <input
          required
          type="text"
          className="mt-1 block w-full rounded-md outline outline-zinc-600 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={item.description}
          onChange={(e) => handleInputChange(e, 'description')}
        />
      </div>

      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700">HSN Code</label>
        <input
          required
          type="text"
          className="mt-1 block w-full rounded-md outline outline-zinc-600 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={item.hsnCode}
          onChange={(e) => handleInputChange(e, 'hsnCode')}
        />
      </div>

      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700">Quantity</label>
        <input
          required
          type="text" // Keep type="text" to allow leading zeros
          className="mt-1 block w-full rounded-md outline outline-zinc-600 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={item.quantity} // Keep the value as a string
          onChange={(e) => handleInputChange(e, 'quantity')}
          onBlur={handleAmountChange} // Trigger calculation when input loses focus
        />
      </div>

      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700">Unit price</label>
        <input
          required
          type="text" // Keep type="text" to allow leading zeros
          className="mt-1 block w-full rounded-md outline outline-zinc-600 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={item.rate} // Keep the value as a string
          onChange={(e) => handleInputChange(e, 'rate')}
          onBlur={handleAmountChange} // Trigger calculation when input loses focus
        />
      </div>

      <div className="col-span-1">
        <label className="block text-sm font-medium text-gray-700">Amount</label>
        <input
          type="text" // Display as string to preserve formatting
          className="mt-1 block w-full rounded-md outline outline-zinc-600 border-gray-300 bg-gray-50 shadow-sm"
          value={formattedAmount} // Display formatted amount
          readOnly
        />
      </div>

      <div className="col-span-1 pt-6">
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="text-red-600 hover:text-red-800"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
