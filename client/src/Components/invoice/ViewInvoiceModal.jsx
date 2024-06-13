import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Button } from 'flowbite-react';
import axios from 'axios';
import jsPDF from 'jspdf';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '90%',
    width: '500px',
    maxHeight: '80%',
    overflowY: 'auto',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
};

const ViewInvoiceModal = ({ isOpen, closeModal, invoice }) => {
  const [invoiceDetails, setInvoiceDetails] = useState(null);
  const [lineItems, setLineItems] = useState([]);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (invoice) {
      const fetchInvoiceDetails = async () => {
        try {
          const lineItemsResponse = await axios.get(`http://localhost:3001/api/invoices/${invoice.InvoiceID}/lineitems`);
          setLineItems(lineItemsResponse.data);
          setInvoiceDetails(invoice);
        } catch (error) {
          console.error('Error fetching invoice details:', error);
        }
      };

      fetchInvoiceDetails();
    }
  }, [invoice]);

  if (!invoiceDetails) {
    return null;
  }

  const totalCost = lineItems.reduce((sum, item) => sum + item.TotalCost, 0);
  const grossProfit = lineItems.reduce((sum, item) => sum + item.GrossProfit, 0);

  const generatePDFInvoice = () => {
    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.getWidth();

    // Shop Info
    const shopInfo = {
      name: 'SL Iron Shop',
      address: 'Galle Rd, Unawatuna',
      tel: '091-2233328',
    };

    

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    const shopNameWidth = doc.getTextDimensions(shopInfo.name).w;
    doc.text(shopInfo.name, (pageWidth - shopNameWidth) / 2, 50);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(16);
    const addressWidth = doc.getTextDimensions(shopInfo.address).w;
    doc.text(shopInfo.address, (pageWidth - addressWidth) / 2, 58);

    doc.setFontSize(14);
    const telWidth = doc.getTextDimensions(`Tel: ${shopInfo.tel}`).w;
    doc.text(`Tel: ${shopInfo.tel}`, (pageWidth - telWidth) / 2, 65);

    // Invoice Info
    let y = 75;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(`Invoice ID: ${invoiceDetails.InvoiceID}`, 10, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.text(`Date: ${new Date(invoiceDetails.Date).toLocaleDateString()}`, 10, y + 10);
    doc.text(`Customer Name: ${invoiceDetails.CustomerName}`, 10, y + 20);
    doc.text(`Status: ${invoiceDetails.Status}`, 10, y + 30);

    // Table Header
    y += 40;
    doc.text('Description', 10, y);
    doc.text('Quantity', 70, y, { align: 'right' });
    doc.text('Price', 110, y, { align: 'right' });
    doc.text('Total', 200, y, { align: 'right' });

    y += 5;
    doc.setLineDashPattern([1, 1], 0);
    doc.line(10, y, pageWidth - 10, y);
    doc.setLineDashPattern([], 0);

    // Table Body
    y += 10;
    lineItems.forEach((item) => {
      doc.text(item.Description, 10, y);
      doc.text(item.Quantity.toString(), 70, y, { align: 'right' });
      doc.text(item.Price.toFixed(2), 110, y, { align: 'right' });
      doc.text((item.Quantity * item.Price).toFixed(2), 200, y, { align: 'right' });
      y += 10;
    });

    // Totals
    y += 10;
    doc.setFont('helvetica', 'bold');
    doc.text('Total Amount:', 10, y);
    doc.text(invoiceDetails.TotalAmount.toFixed(2), 200, y, { align: 'right' });

    y += 10;
    doc.text('Discount Amount:', 10, y);
    doc.text(invoiceDetails.DiscountAmount.toFixed(2), 200, y, { align: 'right' });

    y += 10;
    doc.text('Balance:', 10, y);
    doc.text(invoiceDetails.Balance.toFixed(2), 200, y, { align: 'right' });

    // Save the PDF
    doc.save(`invoice_${invoiceDetails.InvoiceID}.pdf`);
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={closeModal} style={customStyles}>
      <div id="invoice-content">
        <h2 className='text-2xl text-center mb-4'>Invoice Details</h2>
        <div className="space-y-4 px-5">
          <div className="flex justify-between">
            <p><strong>Customer Name:</strong> {invoiceDetails.CustomerName}</p>
            <div className="text-right">
              <p><strong>Invoice ID:</strong> {invoiceDetails.InvoiceID}</p>
              <p><strong>Date:</strong> {new Date(invoiceDetails.Date).toLocaleDateString()}</p>
            </div>
          </div>
          <div>
            <p><strong>Status:</strong> {invoiceDetails.Status}</p>
          </div>
          {lineItems.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold">Items</h3>
              <div className='mt-3'>
                <Table hoverable>
                  <TableHead>
                      <TableHeadCell>Description</TableHeadCell>
                      <TableHeadCell>Quantity</TableHeadCell>
                      <TableHeadCell>Price</TableHeadCell>
                      <TableHeadCell>Total</TableHeadCell>
                  </TableHead>
                  <TableBody>
                    {lineItems.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.Description}</TableCell>
                        <TableCell>{item.Quantity}</TableCell>
                        <TableCell>{item.Price}</TableCell>
                        <TableCell>{item.Quantity * item.Price}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
          <div className="flex flex-col items-start space-y-1">
            <div className="flex justify-between w-full">
              <p><strong>Total Amount:</strong></p>
              <p>{invoiceDetails.TotalAmount.toFixed(2)}</p>
            </div>
            <div className="flex justify-between w-full">
              <p><strong>Discount Amount:</strong></p>
              <p>{invoiceDetails.DiscountAmount.toFixed(2)}</p>
            </div>
            <div className="flex justify-between w-full">
              <p><strong>Balance:</strong></p>
              <p>{invoiceDetails.Balance.toFixed(2)}</p>
            </div>
          </div>
          <div className="flex justify-start mt-4">
            <Button onClick={() => setShowDetails(!showDetails)}>{showDetails ? '-' : '+'} Details</Button>
          </div>
          {showDetails && (
            <div className="mt-2">
              <div className="flex justify-between w-full">
                <p><strong>Total Cost:</strong></p>
                <p>{totalCost.toFixed(2)}</p>
              </div>
              <div className="flex justify-between w-full">
                <p><strong>Gross Profit:</strong></p>
                <p>{grossProfit.toFixed(2)}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <Button onClick={generatePDFInvoice} color="success" className="mr-2">Download as PDF</Button>
        <Button onClick={closeModal} color="warning" className="mr-2">Close</Button>
      </div>
    </Modal>
  );
};

export default ViewInvoiceModal;
