import React from 'react';
import { Page, Document, StyleSheet, View as PdfView, Text as PdfText, Image as PdfImage,Font } from '@react-pdf/renderer';
import Logo from "../utils/logo.png"
import shlogo from '../utils/Agasthya Enterprises (1).png'


Font.register({
  family: 'Noto Sans', // This is the name you will use in styles
  src: '/fonts/NotoSans_ExtraCondensed-Regular.ttf', // Path relative to the public folder
});
Font.register({
  family: 'times', // This is the name you will use in styles
  src: '/fonts/Tinos-Regular.ttf', // Path relative to the public folder
});
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
    fontFamily:'times',
    borderBottom:1
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
    marginLeft:35
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',

  },
  companyBox: {
    padding: 10,
    width:280,
    alignItems: 'center',
    textAlign:'center',
    marginLeft:30,
  },
  rightAlign: {
    textAlign: 'right',
  },
  customerInfo: {
    marginBottom: 10,
    marginTop:-10,
    fontFamily:'times'
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  tableContainer: {
    flex: 1,
    marginBottom: 40,
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
    fontFamily:'times'
  },
  tableCell: {
    padding: 5,
    fontFamily:'Noto Sans'
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
    marginTop:10
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    fontFamily:'Noto Sans'
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
    fontFamily:'times'
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
    top: '17%',
    left: '15%',
    width: "70%",
    height: "70%",
    zIndex:-1,
    opacity:0.06,
    objectFit: 'contain',
  },
  vertical:{
    marginTop:10,
    marginLeft:30,
  }
});

// Hardcoded terms and conditions
const hardcodedTerms = [
  '1• Delivery charges will be always charged extra.',
  '2• Once material delivered will not be taken back or exchanged.',
  '3• No Claim will be admitted after delivery.',
  '4• Subject to Hyderabad Jurisdiction',
];

export const InvoicePDF: React.FC<InvoicePDFProps> = ({ data }) => {
  const subtotal = data.items.reduce((sum, item) => sum + item.amount, 0);
  const cgst = (data.cgst / 100) * subtotal;
  const sgst = (data.sgst / 100) * subtotal;
  const total = subtotal + cgst + sgst;

  const numberToWords = (num: number): string => {
    const belowTwenty = [
      'Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
      'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
      'Seventeen', 'Eighteen', 'Nineteen'
    ];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
    const convertBelowThousand = (n: number): string => {
      if (n < 20) return belowTwenty[n];
      if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + belowTwenty[n % 10] : '');
      return belowTwenty[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' and ' + convertBelowThousand(n % 100) : '');
    };
  
    if (num === 0) return 'Zero';
    if (num >= 1000) {
      const thousands = Math.floor(num / 1000);
      const remainder = num % 1000;
      return `${convertBelowThousand(thousands)} Thousand${remainder ? ' ' + convertBelowThousand(remainder) : ''}`;
    }
    return convertBelowThousand(num);
  };
  
  // Usage:
  const totalInWords = numberToWords(Math.floor(total)).toUpperCase();
  

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <PdfView style={styles.header}>
          <PdfView>
                <PdfText>GSTIN:36AINPJ0953A1ZJ</PdfText>
                <PdfImage src={Logo} style={styles.logo} /> 
          </PdfView>
          <PdfView style={styles.companyInfo}>
            <PdfText style={styles.title }>TAX INVOICE</PdfText>
            <PdfView style={styles.companyBox}>
              <PdfText style={styles.companyName}>AGASTHYA ENTERPRISES</PdfText>
              <PdfText style={{ fontSize: 11, color: 'gray' }}>Off: 1st Floor, 151, SBH Venture 2,</PdfText>
              <PdfText style={{ fontSize: 11, color: 'gray' }}>LB Nagar, Hyderabad,Ranga Reddy Dist,</PdfText>
              <PdfText style={{ fontSize: 11, color: 'gray' }}>Telangana-500074</PdfText>
            </PdfView>
          </PdfView>

          <PdfView style={styles.vertical}>
            <PdfText  style={{ marginBottom: 5 }}>Invoice #: {data.invoiceNumber}</PdfText>
            <PdfText  style={{ marginBottom: 5 }}>Date: {new Date(data.date).toLocaleDateString()}</PdfText>
            <PdfText  style={{ marginBottom: 5 }}>Phone: {data.phone}</PdfText>
          </PdfView>
        </PdfView>

        <PdfView style={styles.customerInfo}>
          <PdfText style={styles.sectionTitle}>Bill To:</PdfText>
          <PdfText style={{ marginTop: 10 }}>NAME: {data.customer.name}</PdfText>
          <PdfText style={{ marginTop: 10, width:250 }}>ADDRESS: {data.customer.address}</PdfText>
          <PdfText style={{ marginTop: 10 }}>GSTIN: {data.customer.gstin}</PdfText>
        </PdfView>

        <PdfView style={styles.tableContainer}>
          {/* Table Header */}
          <PdfView style={[styles.tableRow, styles.tableHeader]}>
  <PdfText style={{ ...styles.tableCell, borderTop: '1px solid black', borderLeft: '1px solid black', borderRight: '1px solid black', width: 40, textAlign: 'center' }}>
    S.No
  </PdfText>
  <PdfText style={{ ...styles.tableCell, borderTop: '1px solid black', borderRight: '1px solid black', width: 150, textAlign: 'center' }}>
    PARTICULARS
  </PdfText>
  <PdfText style={{ ...styles.tableCell,borderTop: '1px solid black', borderRight: '1px solid black', width: 100, textAlign: 'center' }}>
    HSN Code
  </PdfText>
  <PdfText style={{ ...styles.tableCell,borderTop: '1px solid black', borderRight: '1px solid black', width: 80, textAlign: 'center' }}>
    Quantity
  </PdfText>
  <PdfText style={{ ...styles.tableCell, borderTop: '1px solid black', borderRight: '1px solid black', width: 100, textAlign: 'center' }}>
    Unit Rate
  </PdfText>
  <PdfText style={{ ...styles.tableCell,borderTop: '1px solid black', borderRight: '1px solid black', width: 100, textAlign: 'center' }}>
    Amount
  </PdfText>
</PdfView>


          {/* Table Body */}
          {data.items.map((item, index) => (
  <PdfView key={index} style={styles.tableRow}>
    <PdfText style={{ ...styles.tableCell, borderLeft: '1px solid black', borderRight: '1px solid black', width: 40, textAlign: 'center' }}>
      {index + 1}
    </PdfText>
    <PdfText style={{ ...styles.tableCell, borderRight: '1px solid black', width: 150, textAlign: 'center' }}>
      {item.description}
    </PdfText>
    <PdfText style={{ ...styles.tableCell, borderRight: '1px solid black', width: 100, textAlign: 'center' }}>
      {item.hsnCode}
    </PdfText>
    <PdfText style={{ ...styles.tableCell,  borderRight: '1px solid black', width: 80, textAlign: 'center' }}>
      {item.quantity}
    </PdfText>
    <PdfText style={{ ...styles.tableCell,  borderRight: '1px solid black', width: 100, textAlign: 'center' }}>
      ₹{Number.isFinite(Number(item.rate)) ? Number(item.rate).toFixed(2) : 'N/A'}
    </PdfText>
    <PdfText style={{ ...styles.tableCell,  borderRight: '1px solid black', width: 100, textAlign: 'center' }}>
      ₹{item.amount.toFixed(2)}
    </PdfText>
  </PdfView>
))}
        </PdfView>
        <PdfView style={styles.fullPageImage}>
          <PdfImage src={shlogo} style={styles.fullPageImage} />
        </PdfView>
        <PdfView style={{flexDirection:'row', fontFamily:'Noto Sans', fontSize:12, justifyContent:'space-between' }}>
          <PdfView style={{flexDirection:'column', marginTop:8,}}>
            <PdfText>Amount In Words:</PdfText>
            <PdfText style={{textDecoration:'underline', width:250}}>{totalInWords}</PdfText> 
            <PdfView style={{marginTop:8}}>
            <PdfView>ACCOUNT DETAILS:
            <PdfText>Bank: FEDERAL BANK</PdfText>
            <PdfText>A/C No: 16720200005119</PdfText>
            <PdfText>IFSC Code:FDRL0001672</PdfText>
            <PdfText>Branch:LB NAGAR</PdfText>
            </PdfView>
            </PdfView>
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
            <PdfText style={{fontFamily:'Noto Sans'}}>₹{total.toFixed(2)}</PdfText>
          </PdfView>
        </PdfView>
      </PdfView>

        <PdfView style={styles.footer}>
          <PdfView style={styles.terms}>
            <PdfView>
            <PdfText style={styles.sectionTitle}>Terms and Conditions:</PdfText>
            {hardcodedTerms.map((term, index) => (
              <PdfText key={index}>{term}</PdfText>
            ))}
            <PdfText style={{marginTop:10}}>Received the above mentioned materiale in good condition and</PdfText>
            <PdfText>as per our order</PdfText>
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
          <PdfView style={{ width: '123%', height: 10, flexDirection: 'row', position: 'absolute',marginLeft:-50, bottom: -43 }}>
    <PdfView style={{ width: '50%', height: '100%', backgroundColor: 'red' }}></PdfView>
    <PdfView style={{ width: '50%', height: '100%', backgroundColor: 'blue' }}></PdfView>
  </PdfView>
        </PdfView>
      </Page>
    </Document>
  );
};

export default InvoicePDF;