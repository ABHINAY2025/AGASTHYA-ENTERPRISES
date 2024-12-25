export interface Customer {
  name: string;
  address: string;
  gstin: string;
}

export interface Item {
  description: string;
  hsnCode: string;
  quantity: number;
  rate: number;
  amount: number;
  cgst: number,
  sgst: number,
}

export interface InvoiceData {
  invoiceNumber: string;
  phone:string;
  // off:string;
  date: string;
  customer: Customer;
  items: Item[];
  logo?: string;
  // companyName: string;
  // companyAddress: string;
  // companyGstin: string;
  cgst: number;
  sgst: number;
  desp:string;
  // email:string;
}