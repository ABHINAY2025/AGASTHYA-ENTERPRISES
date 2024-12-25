import React, { useState } from 'react';
import { Building2, Plus } from 'lucide-react';
import type { InvoiceData, Item } from '../types/invoice';
import ItemRow from './ItemRow';

interface InvoiceFormProps {
  onSubmit: (data: InvoiceData) => void;
}

export default function InvoiceForm({ onSubmit }: InvoiceFormProps) {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    invoiceNumber: '',
    phone: '3434',
    off: '4234355',
    date: new Date().toISOString().split('T')[0],
    customer: {
      name: '',
      address: '',
      gstin: ''
    },
    items: [],
    companyName: '',
    companyAddress: '',
    companyGstin: '',
    logo: '',
    sgst: 0,
    cgst: 0,
  });

  const addItem = () => {
    setInvoiceData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          description: '',
          hsnCode: '',
          quantity: 0,
          rate: 0,
          amount: 0,
          sgst: 0,
          cgst: 0,
        },
      ],
    }));
  };

  const removeItem = (index: number) => {
    setInvoiceData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const updateItem = (
    index: number,
    field: keyof Item,
    value: string | number
  ) => {
    setInvoiceData(prev => {
      const newItems = [...prev.items];
      newItems[index] = {
        ...newItems[index],
        [field]: value === '' || value === 0 ? '' : value, // Treat empty string or zero as empty
      };

      if (field === 'quantity' || field === 'rate') {
        const quantity = Number(newItems[index].quantity) || 1;
        const rate = Number(newItems[index].rate) || 0;
        newItems[index].amount = quantity * rate;
      }

      if (field === 'sgst' || field === 'cgst') {
        const updatedSgstCgst = (Number(newItems[index].sgst) || 0) + (Number(newItems[index].cgst) || 0);
        newItems[index].amount += updatedSgstCgst;
      }

      return { ...prev, items: newItems };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(invoiceData);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof InvoiceData
  ) => {
    const { value } = e.target;
    setInvoiceData(prev => ({
      ...prev,
      [field]: value === '' || value === 0 ? '' : value, // If empty or zero, treat as empty
    }));
  };

  const handleItemInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    field: keyof Item
  ) => {
    const { value } = e.target;
    updateItem(index, field, value === '' || value === '0' ? '' : value);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto p-6">
      {/* Company Details Section */}
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Building2 className="w-5 h-5" />
          Company Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Company Logo URL</label>
            <input
              type="url"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              value={invoiceData.logo}
              onChange={e => setInvoiceData(prev => ({ ...prev, logo: e.target.value }))}
              placeholder="https://example.com/logo.png"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Company Name</label>
            <input
              required
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              value={invoiceData.companyName}
              onChange={e => setInvoiceData(prev => ({ ...prev, companyName: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Company Address</label>
            <textarea
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              value={invoiceData.companyAddress}
              onChange={e => setInvoiceData(prev => ({ ...prev, companyAddress: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Company GSTIN</label>
            <input
              required
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              value={invoiceData.companyGstin}
              onChange={e => setInvoiceData(prev => ({ ...prev, companyGstin: e.target.value }))}
            />
          </div>
        </div>
      </div>

      {/* Invoice Details Section */}
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <h2 className="text-xl font-semibold">Invoice Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Invoice Number</label>
            <input
              required
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              value={invoiceData.invoiceNumber}
              onChange={e => setInvoiceData(prev => ({ ...prev, invoiceNumber: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              required
              type="date"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              value={invoiceData.date}
              onChange={e => setInvoiceData(prev => ({ ...prev, date: e.target.value }))}
            />
          </div>
        </div>
      </div>

      {/* Customer Details Section */}
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <h2 className="text-xl font-semibold">Customer Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Customer Name</label>
            <input
              required
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              value={invoiceData.customer.name}
              onChange={e => setInvoiceData(prev => ({
                ...prev,
                customer: { ...prev.customer, name: e.target.value }
              }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Customer GSTIN</label>
            <input
              required
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              value={invoiceData.customer.gstin}
              onChange={e => setInvoiceData(prev => ({
                ...prev,
                customer: { ...prev.customer, gstin: e.target.value }
              }))}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Customer Address</label>
            <textarea
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              value={invoiceData.customer.address}
              onChange={e => setInvoiceData(prev => ({
                ...prev,
                customer: { ...prev.customer, address: e.target.value }
              }))}
            />
          </div>
        </div>
      </div>

      {/* Items Section */}
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Items</h2>
          <button
            type="button"
            onClick={addItem}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </button>
        </div>

        <div className="space-y-4">
          {invoiceData.items.map((item, index) => (
            <ItemRow
              key={index}
              item={item}
              index={index}
              onUpdate={updateItem}
              onRemove={removeItem}
              handleInputChange={(e, field) => handleItemInputChange(e, index, field)}
            />
          ))}
        </div>
      </div>

      {/* SGST and CGST Section */}
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <h2 className="text-xl font-semibold">Taxes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">SGST</label>
            <input
              type="number"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              value={invoiceData.sgst === '' || invoiceData.sgst === 0 ? '' : invoiceData.sgst} // Display empty when 0
              onChange={e => handleInputChange(e, 'sgst')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">CGST</label>
            <input
              type="number"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              value={invoiceData.cgst === '' || invoiceData.cgst === 0 ? '' : invoiceData.cgst} // Display empty when 0
              onChange={e => handleInputChange(e, 'cgst')}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
