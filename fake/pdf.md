import React from 'react';
import { Page, Document, StyleSheet, View as PdfView, Text as PdfText, Image as PdfImage } from '@react-pdf/renderer';
import Logo from "../utils/logo.png"

// Define TypeScript interfaces (same as before)
interface InvoiceItem {
  description: string;
  hsnCode: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface Customer {
  name: string;
  address: string;
  gstin: string;
}

interface InvoiceData {
  logo?: string;
  companyGstin: string;
  companyName: string;
  companyAddress: string;
  invoiceNumber: string;
  date: string | Date;
  phone: string;
  off: string;
  customer: Customer;
  items: InvoiceItem[];
  cgst: number;
  sgst: number;
  terms?: string[]; // Optional, but won't be used if hardcoded
}

interface InvoicePDFProps {
  data: InvoiceData;
}

// Define styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    position: "relative",
    width: "100%",
    height: "100%",
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap:10,
    marginBottom: 20,
  },
  companyInfo: {
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginTop:-20,
    marginBottom:-40,
    marginLeft:-10,
    objectFit: 'contain',

  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    textDecoration: 'underline',
    marginBottom: 2,
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',

  },
  companyBox: {
    padding: 10,
    width:250,
    alignItems: 'center',
    textAlign:'center',
    marginLeft:30,
  },
  rightAlign: {
    textAlign: 'right',
  },
  customerInfo: {
    marginBottom: 30,
    marginTop:-10
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  tableContainer: {
    flex: 1,
    marginBottom: 30,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
    alignItems: 'center',
    minHeight: 24,
  },
  tableHeader: {
    backgroundColor: '#f3f4f6',
    fontWeight: 'bold',
  },
  tableCell: {
    padding: 5,
  },
  tableCellSerial: { width: '8%' },
  tableCellDesc: { width: '32%' },
  tableCellHsn: { width: '15%' },
  tableCellQty: { width: '15%', textAlign: 'right' },
  tableCellRate: { width: '15%', textAlign: 'right' },
  tableCellAmount: { width: '15%', textAlign: 'right' },
  summary: {
    alignSelf: 'flex-end',
    width: 200,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  summaryTotal: {
    borderTopWidth: 1,
    borderTopColor: '#000',
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#000',
  },
  terms: {
    fontSize: 10,
    marginBottom: 0,
    flexDirection:'row',
    justifyContent: 'space-between',
  },
  signatureSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    width: '100%', // Ensure the section spans the full width
  },
  leftSignature: {
    width: '48%', // Occupies 50% of the width
    textAlign: 'left',
    marginTop: 30,
  },
  rightSignature: {
    width: '48%', // Occupies 50% of the width
    textAlign: 'right',
    flexDirection:'column',
    marginTop: 30,
  },
  companyNameFooter: {
    fontSize: 12,
    textAlign: 'left', // Align company name to the left
  },
  fullPageImage: {
    position: "absolute",
    top: 22,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex:-1,
    opacity:0.1,
    objectFit: 'contain',
  },
  vertical:{
    marginTop:10,
    marginLeft:30,
  }
});

// Hardcoded terms and conditions
const hardcodedTerms = [
  'Payment is due within 30 days from the date of invoice.',
  'Goods once sold will not be accepted for return or exchange.',
  'Please verify the order details before confirming the invoice.',
];

export const InvoicePDF: React.FC<InvoicePDFProps> = ({ data }) => {
  const subtotal = data.items.reduce((sum, item) => sum + item.amount, 0);
  const cgst = (data.cgst / 100) * subtotal;
  const sgst = (data.sgst / 100) * subtotal;
  const total = subtotal + cgst + sgst;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <PdfView style={styles.header}>
          <PdfView>
                <PdfText>GSTIN: {data.companyGstin}</PdfText>
                <PdfImage src={Logo} style={styles.logo} /> 
          </PdfView>
          <PdfView style={styles.companyInfo}>
            <PdfText style={styles.title}>TAX INVOICE</PdfText>
            <PdfView style={styles.companyBox}>
              <PdfText style={styles.companyName}>AGASTHYA ENTERPRISES</PdfText>
              <PdfText style={{ fontSize: 11, color: 'gray' }}>Off: 1st Floor, 151, SBH Venture 2,</PdfText>
              <PdfText style={{ fontSize: 11, color: 'gray' }}>LB Nagar, Hyderabad, Ranga Reddy Dist., Telangana-500 074</PdfText>
            </PdfView>
          </PdfView>

          <PdfView style={styles.vertical}>
            <PdfText  style={{ marginBottom: 5 }}>Invoice #: {data.invoiceNumber}</PdfText>
            <PdfText  style={{ marginBottom: 5 }}>Date: {new Date(data.date).toLocaleDateString()}</PdfText>
            <PdfText  style={{ marginBottom: 5 }}>Phone: {data.phone}</PdfText>
            <PdfText>Off: {data.off}</PdfText>
          </PdfView>
        </PdfView>

        <PdfView style={styles.customerInfo}>
          <PdfText style={styles.sectionTitle}>Bill To:</PdfText>
          <PdfText style={{ marginTop: 10 }}>NAME:{data.customer.name}</PdfText>
          <PdfText style={{ marginTop: 10, width:250 }}>ADDRESS:{data.customer.address}</PdfText>
          <PdfText style={{ marginTop: 10 }}>GSTIN: {data.customer.gstin}</PdfText>
        </PdfView>

        <PdfView style={styles.tableContainer}>
          {/* Table Header */}
          <PdfView style={[styles.tableRow, styles.tableHeader]}>
            <PdfText style={[styles.tableCell, styles.tableCellSerial]}>S.No</PdfText>
            <PdfText style={[styles.tableCell, styles.tableCellDesc]}>PARTICULARS</PdfText>
            <PdfText style={[styles.tableCell, styles.tableCellHsn]}>HSN Code</PdfText>
            <PdfText style={[styles.tableCell, styles.tableCellQty]}>Quantity</PdfText>
            <PdfText style={[styles.tableCell, styles.tableCellRate]}>Unit Rate</PdfText>
            <PdfText style={[styles.tableCell, styles.tableCellAmount]}>Amount</PdfText>
          </PdfView>

          {/* Table Body */}
          {data.items.map((item, index) => (
            <PdfView key={index} style={styles.tableRow}>
              <PdfText style={[styles.tableCell, styles.tableCellSerial]}>{index + 1}</PdfText>
              <PdfText style={[styles.tableCell, styles.tableCellDesc]}>{item.description}</PdfText>
              <PdfText style={[styles.tableCell, styles.tableCellHsn]}>{item.hsnCode}</PdfText>
              <PdfText style={[styles.tableCell, styles.tableCellQty]}>{item.quantity}</PdfText>
              <PdfText style={[styles.tableCell, styles.tableCellRate]}>₹{item.rate.toFixed(2)}</PdfText>
              <PdfText style={[styles.tableCell, styles.tableCellAmount]}>₹{item.amount.toFixed(2)}</PdfText>
            </PdfView>
          ))}
        </PdfView>
        <PdfView style={styles.fullPageImage}>
          <PdfImage src={Logo} style={styles.fullPageImage} />
        </PdfView>
        <PdfView style={styles.summary}>
          <PdfView style={styles.summaryRow}>
            <PdfText>Subtotal:</PdfText>
            <PdfText>₹{subtotal.toFixed(2)}</PdfText>
          </PdfView>
          <PdfView style={styles.summaryRow}>
            <PdfText>CGST ({data.cgst}%):</PdfText>
            <PdfText>₹{cgst.toFixed(2)}</PdfText>
          </PdfView>
          <PdfView style={styles.summaryRow}>
            <PdfText>SGST ({data.sgst}%):</PdfText>
            <PdfText>₹{sgst.toFixed(2)}</PdfText>
          </PdfView>
          <PdfView style={[styles.summaryRow, styles.summaryTotal]}>
            <PdfText>Total:</PdfText>
            <PdfText>₹{total.toFixed(2)}</PdfText>
          </PdfView>
        </PdfView>

        <PdfView style={styles.footer}>
          <PdfView style={styles.terms}>
            <PdfView>
            <PdfText style={styles.sectionTitle}>Terms and Conditions:</PdfText>
            {hardcodedTerms.map((term, index) => (
              <PdfText key={index}>• {term}</PdfText>
            ))}
            </PdfView>
            <PdfText style={styles.companyNameFooter}>For <PdfText style={{ fontWeight: 'bold', fontSize:14 }}>AGASTHYA ENTERPRISES</PdfText></PdfText>
          </PdfView>

          {/* Company Name and Authorized Signature side by side */}
          <PdfView style={styles.signatureSection}>
            <PdfView style={styles.leftSignature}>
            <PdfText>Reciver signature</PdfText>
            </PdfView>
            <PdfView style={styles.rightSignature}>
              <PdfText>Authorized Signature</PdfText>
            </PdfView>
          </PdfView>

          {/* Gap for stamp and signature */}
          {/* <PdfView style={styles.gapForStamp}></PdfView> */}
        </PdfView>
      </Page>
    </Document>
  );
};

export default InvoicePDF;