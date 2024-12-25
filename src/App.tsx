import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import InvoiceForm from './components/InvoiceForm';
import InvoicePreview from './components/InvoicePreview';
import AllInvoices from './components/AllInvoices'; // Create this component
import type { InvoiceData } from './types/invoice';

function App() {
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [invoices, setInvoices] = useState<InvoiceData[]>([]); // Store all invoices

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto flex items-center justify-between ju py-6 px-4">
            <Link to="/" className="text-3xl font-bold text-gray-900">Tax Invoice Maker</Link>
            <div className="mt-6">
            <Link to="/all-invoices">
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200">
                View All Invoices
              </button>
            </Link>
          </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route
              path="/"
              element={
                invoice ? (
                  <div className="space-y-6">
                    <button
                      onClick={() => setInvoice(null)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                    >
                      Create New Invoice
                    </button>
                    <InvoicePreview data={invoice} />
                  </div>
                ) : (
                  <InvoiceForm
                    onSubmit={(newInvoice) => {
                      setInvoice(newInvoice);
                      setInvoices([...invoices, newInvoice]); // Add to list of all invoices
                    }}
                  />
                )
              }
            />
            <Route
              path="/all-invoices"
              element={<AllInvoices invoices={invoices} />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
