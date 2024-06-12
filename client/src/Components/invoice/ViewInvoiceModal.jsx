import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Button } from 'flowbite-react';
import axios from 'axios';

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

  return (
    <Modal isOpen={isOpen} onRequestClose={closeModal} style={customStyles}>
      <h2 className='text-2xl text-center mb-4'>Invoice Details</h2>
      <div className="space-y-4">
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
        )}
         <div className="flex flex-col items-start space-y-1">
          <div className="flex justify-between w-full">
            <p><strong>Total Amount:</strong></p>
            <p>{invoiceDetails.TotalAmount}</p>
          </div>
          <div className="flex justify-between w-full">
            <p><strong>Discount Amount:</strong></p>
            <p>{invoiceDetails.DiscountAmount}</p>
          </div>
          <div className="flex justify-between w-full">
            <p><strong>Balance:</strong></p>
            <p>{invoiceDetails.Balance}</p>
          </div>
        </div>
        <div className="flex justify-start mt-4">
          <Button onClick={() => setShowDetails(!showDetails)}>{showDetails ? '-' : '+'} Details</Button>
        </div>
        {showDetails && (
          <div className="mt-2">
            <div className="flex justify-between w-full">
              <p><strong>Total Cost:</strong></p>
              <p>{totalCost}</p>
            </div>
            <div className="flex justify-between w-full">
              <p><strong>Gross Profit:</strong></p>
              <p>{grossProfit}</p>
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-end mt-4">
        <Button onClick={closeModal} color="warning" className="mr-2">Close</Button>
      </div>
    </Modal>
  );
};

export default ViewInvoiceModal;