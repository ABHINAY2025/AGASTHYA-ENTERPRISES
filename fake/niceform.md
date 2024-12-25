import React, { useState } from 'react';
import { Building2, Plus } from 'lucide-react';
import type { InvoiceData, Item, BankDetails } from '../types/invoice';
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
    bankDetails: {
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      accountHolder: '',
    }
  });

  const [openSections, setOpenSections] = useState<Set<string>>(new Set());

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
        [field]: value === '' || value === 0 ? '' : value,
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
      [field]: value === '' || value === 0 ? '' : value,
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

  const handleBankDetailsChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof BankDetails
  ) => {
    const { value } = e.target;
    setInvoiceData(prev => ({
      ...prev,
      bankDetails: {
        ...prev.bankDetails,
        [field]: value === '' ? '' : value,
      },
    }));
  };

  const toggleSection = (section: string) => {
    setOpenSections(prev => {
      const newSections = new Set(prev);
      if (newSections.has(section)) {
        newSections.delete(section);
      } else {
        newSections.add(section);
      }
      return newSections;
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto p-6">
      {/* Company Details Section */}
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Company Details
          </h2>
          <button
            type="button"
            onClick={() => toggleSection('company')}
            className="text-blue-600"
          >
            {openSections.has('company') ? 'Collapse' : 'Expand'}
          </button>
        </div>
        {openSections.has('company') && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Company Name</label>
              <input
                type="text"
                value={invoiceData.companyName}
                onChange={(e) => handleInputChange(e, 'companyName')}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Company Address</label>
              <input
                type="text"
                value={invoiceData.companyAddress}
                onChange={(e) => handleInputChange(e, 'companyAddress')}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Company GSTIN</label>
              <input
                type="text"
                value={invoiceData.companyGstin}
                onChange={(e) => handleInputChange(e, 'companyGstin')}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          </div>
        )}
      </div>

      {/* Invoice Details Section */}
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Invoice Details</h2>
          <button
            type="button"
            onClick={() => toggleSection('invoice')}
            className="text-blue-600"
          >
            {openSections.has('invoice') ? 'Collapse' : 'Expand'}
          </button>
        </div>
        {openSections.has('invoice') && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Invoice Number</label>
              <input
                type="text"
                value={invoiceData.invoiceNumber}
                onChange={(e) => handleInputChange(e, 'invoiceNumber')}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="text"
                value={invoiceData.phone}
                onChange={(e) => handleInputChange(e, 'phone')}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Office</label>
              <input
                type="text"
                value={invoiceData.off}
                onChange={(e) => handleInputChange(e, 'off')}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                value={invoiceData.date}
                onChange={(e) => handleInputChange(e, 'date')}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          </div>
        )}
      </div>

      {/* Customer Details Section */}
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Customer Details</h2>
          <button
            type="button"
            onClick={() => toggleSection('customer')}
            className="text-blue-600"
          >
            {openSections.has('customer') ? 'Collapse' : 'Expand'}
          </button>
        </div>
        {openSections.has('customer') && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Customer Name</label>
              <input
                type="text"
                value={invoiceData.customer.name}
                onChange={(e) => handleInputChange(e, 'customer.name')}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Customer Address</label>
              <input
                type="text"
                value={invoiceData.customer.address}
                onChange={(e) => handleInputChange(e, 'customer.address')}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Customer GSTIN</label>
              <input
                type="text"
                value={invoiceData.customer.gstin}
                onChange={(e) => handleInputChange(e, 'customer.gstin')}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          </div>
        )}
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
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Taxes</h2>
          <button
            type="button"
            onClick={() => toggleSection('taxes')}
            className="text-blue-600"
          >
            {openSections.has('taxes') ? 'Collapse' : 'Expand'}
          </button>
        </div>
        {openSections.has('taxes') && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">CGST</label>
              <input
                type="number"
                value={invoiceData.cgst}
                onChange={(e) => handleInputChange(e, 'cgst')}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">SGST</label>
              <input
                type="number"
                value={invoiceData.sgst}
                onChange={(e) => handleInputChange(e, 'sgst')}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          </div>
        )}
      </div>

      {/* Bank Details Section */}
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Bank Details</h2>
          <button
            type="button"
            onClick={() => toggleSection('bank')}
            className="text-blue-600"
          >
            {openSections.has('bank') ? 'Collapse' : 'Expand'}
          </button>
        </div>
        {openSections.has('bank') && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Bank Name</label>
              <input
                type="text"
                value={invoiceData.bankDetails.bankName}
                onChange={(e) => handleBankDetailsChange(e, 'bankName')}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Account Number</label>
              <input
                type="text"
                value={invoiceData.bankDetails.accountNumber}
                onChange={(e) => handleBankDetailsChange(e, 'accountNumber')}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">IFSC Code</label>
              <input
                type="text"
                value={invoiceData.bankDetails.ifscCode}
                onChange={(e) => handleBankDetailsChange(e, 'ifscCode')}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Account Holder</label>
              <input
                type="text"
                value={invoiceData.bankDetails.accountHolder}
                onChange={(e) => handleBankDetailsChange(e, 'accountHolder')}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
