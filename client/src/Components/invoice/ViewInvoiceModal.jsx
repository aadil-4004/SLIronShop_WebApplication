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

  return (
    <Modal isOpen={isOpen} onRequestClose={closeModal} style={customStyles}>
      <h2 className='text-2xl text-center mb-4'>Invoice Details</h2>
      <div className="space-y-4">
        <div>
          <p><strong>Invoice ID:</strong> {invoiceDetails.InvoiceID}</p>
          <p><strong>Customer Name:</strong> {invoiceDetails.CustomerName}</p>
          <p><strong>Date:</strong> {new Date(invoiceDetails.Date).toLocaleDateString()}</p>
          <p><strong>Status:</strong> {invoiceDetails.Status}</p>
          <p><strong>Total Amount:</strong> {invoiceDetails.TotalAmount}</p>
        </div>
        {lineItems.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold">Line Items</h3>
            <Table hoverable>
              <TableHead>
                <TableRow>
                  <TableHeadCell>Description</TableHeadCell>
                  <TableHeadCell>Quantity</TableHeadCell>
                  <TableHeadCell>Price</TableHeadCell>
                  <TableHeadCell>Total</TableHeadCell>
                </TableRow>
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
      </div>
      <div className="flex justify-end mt-4">
        <Button onClick={closeModal} color="warning" className="mr-2">Close</Button>
      </div>
    </Modal>
  );
};

export default ViewInvoiceModal;
