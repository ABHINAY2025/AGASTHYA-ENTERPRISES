import React from 'react';
import { Trash2 } from 'lucide-react';
import type { Item } from '../types/invoice';

interface ItemRowProps {
  item: Item;
  index: number;
  onUpdate: (index: number, field: keyof Item, value: string | number) => void;
  onRemove: (index: number) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>, field: keyof Item) => void; // Add handleInputChange here
}


export default function ItemRow({ item, index, onUpdate, onRemove }: ItemRowProps) {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>, 
    field: keyof Item // Explicitly typing 'field' as keyof Item
  ) => {
    const value = field === 'quantity' || field === 'rate' ? Number(e.target.value) : e.target.value;
    onUpdate(index, field, value);
  };

  return (
    <div className="grid grid-cols-12 gap-4 items-start">
      <div className="col-span-4">
        <label className="block text-sm font-medium text-gray-700">PARTICULARS</label>
        <input
          required
          type="text"
          className="mt-1 block w-full rounded-md outline outline-zinc-600  border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={item.description}
          onChange={e => handleInputChange(e, 'description')}
        />
      </div>
      
      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700">HSN Code</label>
        <input
          required
          type="text"
          className="mt-1 block w-full rounded-md outline outline-zinc-600  border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={item.hsnCode}
          onChange={e => handleInputChange(e, 'hsnCode')}
        />
      </div>

      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700">Quantity</label>
        <input
          required
          type="number"
          min="0"
          className="mt-1 block w-full rounded-md outline outline-zinc-600  border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={item.quantity}
          onChange={e => handleInputChange(e, 'quantity')}
        />
      </div>
      
      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700">Unit price</label>
        <input
          required
          type="number"
          min="0"
          className="mt-1 block w-full rounded-md outline outline-zinc-600  border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={item.rate}
          onChange={e => handleInputChange(e, 'rate')}
        />
      </div>
      
      <div className="col-span-1">
        <label className="block text-sm font-medium text-gray-700">Amount</label>
        <input
          type="number"
          className="mt-1 block w-full rounded-md outline outline-zinc-600  border-gray-300 bg-gray-50 shadow-sm"
          value={item.amount}
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
