import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import type { InvoiceData, Item } from '../types/invoice';
import ItemRow from './ItemRow';
import { db } from './firebase'; // Ensure this path is correct based on where your firebase setup is
import {  doc, setDoc ,getDoc} from 'firebase/firestore';
import { PDFViewer } from '@react-pdf/renderer';
import InvoicePDF from './InvoicePreview';

interface InvoiceFormProps {
  onSubmit: (data: InvoiceData) => void;
}
const formatDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: '2-digit' };
  return new Date(date).toLocaleDateString('en-GB', options).replace(',', '').replace(/\//g, '-');
};

const convertToInputFormat = (date: string): string => {
  const [day, month, year] = date.split('-');
  const monthMap: { [key: string]: string } = {
    Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
    Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12'
  };
  const monthNumber = monthMap[month];
  return `${year}"-"${monthNumber}"-"${day}`;
};
export default function InvoiceForm({ onSubmit }: InvoiceFormProps) {
  
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    invoiceNumber: '',
    phone: '9949993656',
    desp: '',
    date: formatDate(new Date()),
    customer: {
      name: '',
      address: '',
      gstin: ''
    },
    items: [],
    logo: '',
    sgst: 0, 
    cgst: 0, 
  });
  
  // Event handler to handle the date change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value; // e.target.value will be in yyyy-MM-dd format
    const formattedDate = new Date(newDate).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: '2-digit' }).replace(',', '').replace(/\//g, '-');
    setInvoiceData(prev => ({
      ...prev,
      date: formattedDate,  // Store the date in dd-MMM-yyyy format
    }));
  };

  // console.log(invoiceData.date)

// export default function InvoiceForm({ onSubmit }: InvoiceFormProps) {
//   const [invoiceData, setInvoiceData] = useState<InvoiceData>({
//     invoiceNumber: '',
//     phone: '9949993656',
//     off: '9949993656',
//     desp: '',
//     email: 'AGASTHYAVINAYENTERPRISES@GMAIL.COM',
//     date: new Date().toISOString().split('T')[0],
//     customer: {
//       name: '',
//       address: '',
//       gstin: ''
//     },
//     items: [],
//     companyName: '',
//     companyAddress: '',
//     companyGstin: '',
//     logo: '',
//     sgst: 0, 
//     cgst: 0, 
//   });

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

  interface DownloadButtonProps {
    invoiceData: InvoiceData;
    onSubmit?: (data: InvoiceData) => void;
    setInvoiceData: (data: InvoiceData) => void;
  }

  const removeItem = (index: number) => {
    setInvoiceData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };
  
  const DownloadButton: React.FC<DownloadButtonProps> = ({ invoiceData, onSubmit, setInvoiceData }) => {
  const handleClick = async () => {
    try {
      const invoiceRef = doc(db, 'invoices', invoiceData.invoiceNumber);

      // Check if the invoice already exists
      const invoiceSnap = await getDoc(invoiceRef);
      if (invoiceSnap.exists()) {
        alert('Invoice with this number already exists!');
      } else {
        // Save the invoice to Firestore
        await setDoc(invoiceRef, invoiceData);

        // Trigger the onSubmit callback if provided
        if (onSubmit) {
          onSubmit(invoiceData);
        }

        // Notify the user of success
        alert('Invoice submitted successfully!');

        // Reset the form data
        setInvoiceData({
          invoiceNumber: '',
          phone: '',
          desp: '',
          date: invoiceData.date,
          customer: {
            name: '',
            address: '',
            gstin: '',
          },
          items: [],
          logo: '',
          sgst: 0,
          cgst: 0,
        });
      }
    } catch (error) {
      console.error(error);

    }
  };
  
    return (
      <div>
        <PDFDownloadLink
          document={<InvoicePDF data={invoiceData} />}
          fileName="invoice.pdf"
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            textDecoration: 'none',
            cursor: 'pointer',
          }}
          onClick={handleClick}
        >
          {({ loading }) => (loading ? 'Generating PDF...' : 'Download Invoice')}
        </PDFDownloadLink>
      </div>
    );
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Assuming the invoice number is unique, you can use it as the document ID
      const invoiceRef = doc(db, 'invoices', invoiceData.invoiceNumber);

      // Save the invoice data to Firestore
      await setDoc(invoiceRef, invoiceData);

      // Call the onSubmit function passed as a prop (optional)
      onSubmit(invoiceData);

      // Optionally, alert the user or clear the form after submitting
      alert('Invoice submitted successfully!');
      setInvoiceData({
        invoiceNumber: '',
        phone: '9949993656',
        // off: '9949993656',
        desp: '',
        // email: 'AGASTHYAVINAYENTERPRISES@GMAIL.COM',
        date: new Date().toISOString().split('T')[0],
        customer: {
          name: '',
          address: '',
          gstin: ''
        },
        items: [],
        // companyName: '',
        // companyAddress: '',
        // companyGstin: '',
        logo: '',
        sgst: 0, 
        cgst: 0, 
      });
    } catch (error) {
      console.error('Error submitting invoice:', error);
      alert('There was an error submitting the invoice. Please try again.');
    }
  };

  // const handleInputChange = (
  //   e: React.ChangeEvent<HTMLInputElement>,
  //   field: keyof InvoiceData
  // ) => {
  //   const { value } = e.target;
  //   setInvoiceData(prev => ({
  //     ...prev,
  //     [field]: value === '' ? '' : value,
  //   }));
  // };

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
      {/* Invoice Details Section */}
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <h2 className="text-xl font-semibold">Invoice Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Invoice Number</label>
            <input
              required
              type="text"
              className="mt-1 block w-full rounded-sm outline outline-zinc-600 border-gray-300 shadow-sm"
              value={invoiceData.invoiceNumber}
              onChange={e => setInvoiceData(prev => ({ ...prev, invoiceNumber: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              required
              type="date"
              className="mt-1 block w-full outline outline-zinc-600 rounded-md border-gray-300 shadow-sm"
              value={convertToInputFormat(invoiceData.date)}
              onChange={handleDateChange} 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Desp through</label>
            <input
              required
              type="text"
              className="mt-1 block outline outline-zinc-600 w-full rounded-md border-gray-300 shadow-sm"
              value={invoiceData.desp}
              onChange={e => setInvoiceData(prev => ({ ...prev, desp: e.target.value }))}
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
              className="mt-1 block outline outline-zinc-600 w-full rounded-md border-gray-300 shadow-sm"
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
              className="mt-1 block w-full outline outline-zinc-600 rounded-md border-gray-300 shadow-sm"
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
              className="mt-1 block w-full outline outline-zinc-600 rounded-md border-gray-300 shadow-sm"
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
              required
              type="number"
              className="mt-1 block w-full outline outline-zinc-600 rounded-md border-gray-300 shadow-sm"
              value={invoiceData.sgst === 0 ? '' : invoiceData.sgst} // Handle empty value
              onChange={e => setInvoiceData(prev => ({
                ...prev,
                sgst: e.target.value === '' ? 0 : Number(e.target.value), // Set to 0 if empty, otherwise convert to number
              }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">CGST</label>
            <input
              required
              type="number"
              className="mt-1 block w-full outline outline-zinc-600 rounded-md border-gray-300 shadow-sm"
              value={invoiceData.cgst === 0 ? '' : invoiceData.cgst} // Handle empty value
              onChange={e => setInvoiceData(prev => ({
                ...prev,
                cgst: e.target.value === '' ? 0 : Number(e.target.value), // Set to 0 if empty, otherwise convert to number
              }))}
            />
          </div>
        </div>
      </div>

      {/* Final Actions */}
      <div className="flex justify-between items-center">
        <DownloadButton invoiceData={invoiceData} onSubmit={undefined} setInvoiceData={undefined} />
        {/* <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
        >
          Save Invoice
        </button> */}
      </div>
    </form>
  );
}
