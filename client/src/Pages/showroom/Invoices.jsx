import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Button } from 'flowbite-react';
import { HiPencil, HiEye, HiPlus } from "react-icons/hi";
import ShowroomNavbar from '../../Components/showroom/showroom_navbar';
import SearchBar from '../../Components/showroom/SearchBar';
import axios from 'axios';
import AddInvoiceModal from '../../Components/invoice/AddInvoiceModal';
import EditInvoiceModal from '../../Components/invoice/EditInvoiceModal';
import ViewInvoiceModal from '../../Components/invoice/ViewInvoiceModal';

const Invoices = () => {
  const [AddInvoiceModalIsOpen, setAddInvoiceModalIsOpen] = useState(false);
  const [EditInvoiceModalIsOpen, setEditInvoiceModalIsOpen] = useState(false);
  const [ViewInvoiceModalIsOpen, setViewInvoiceModalIsOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const openAddInvoiceModal = () => setAddInvoiceModalIsOpen(true);
  const closeAddInvoiceModal = () => setAddInvoiceModalIsOpen(false);

  const openEditInvoiceModal = (invoice) => {
    setSelectedInvoice(invoice);
    setEditInvoiceModalIsOpen(true);
  };
  const closeEditInvoiceModal = () => setEditInvoiceModalIsOpen(false);

  const openViewInvoiceModal = (invoice) => {
    setSelectedInvoice(invoice);
    setViewInvoiceModalIsOpen(true);
  };
  const closeViewInvoiceModal = () => setViewInvoiceModalIsOpen(false);

  const fetchInvoices = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/invoices');
      setInvoices(response.data);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const filteredInvoices = invoices.filter(invoice =>
    invoice.CustomerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.Status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.InvoiceID.toString().includes(searchTerm)
  );

  return (
    <div className="flex bg-[#F7F7F7] h-screen">
      <div className='w-20 h-screen'>
        <ShowroomNavbar activeItem={"invoices"} />
      </div>
      <div className="py-10 w-full">
        <div className="px-10 pb-5">
          <h2 className="text-4xl font-semibold mb-3">Invoices</h2>
          <SearchBar value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <div className="flex justify-between items-center mt-5">
            <Button onClick={openAddInvoiceModal} color="green">
              <HiPlus className="mr-2 h-5 w-5" />
              Add Invoice
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto px-10">
          <Table hoverable className="w-full">
            <TableHead>
              
                <TableHeadCell>Invoice ID</TableHeadCell>
                <TableHeadCell>Customer Name</TableHeadCell>
                <TableHeadCell>Date</TableHeadCell>
                <TableHeadCell>Status</TableHeadCell>
                <TableHeadCell>Total Amount</TableHeadCell>
                <TableHeadCell>
                  <span className="sr-only">Actions</span>
                </TableHeadCell>
              
            </TableHead>
            <TableBody className="divide-y">
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.InvoiceID} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {invoice.InvoiceID}
                  </TableCell>
                  <TableCell>{invoice.CustomerName}</TableCell>
                  <TableCell>{new Date(invoice.Date).toLocaleDateString()}</TableCell>
                  <TableCell>{invoice.Status}</TableCell>
                  <TableCell>{invoice.TotalAmount}</TableCell>
                  <TableCell className="flex space-x-2">
                    <Button onClick={() => openViewInvoiceModal(invoice)} color="green">
                      <HiEye className="h-5 w-5" />
                    </Button>
                    <Button onClick={() => openEditInvoiceModal(invoice)} color="blue">
                      <HiPencil className="h-5 w-5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <AddInvoiceModal isOpen={AddInvoiceModalIsOpen} closeModal={closeAddInvoiceModal} fetchInvoices={fetchInvoices} />
        <EditInvoiceModal isOpen={EditInvoiceModalIsOpen} closeModal={closeEditInvoiceModal} fetchInvoices={fetchInvoices} invoice={selectedInvoice} />
        <ViewInvoiceModal isOpen={ViewInvoiceModalIsOpen} closeModal={closeViewInvoiceModal} invoice={selectedInvoice} />
      </div>
    </div>
  );
};

export default Invoices;
