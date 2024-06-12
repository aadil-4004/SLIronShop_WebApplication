import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { Button, Label, TextInput, Select } from 'flowbite-react';
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
    width: '300px',
    maxHeight: '80%',
    overflowY: 'auto',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
};

const EditInvoiceModal = ({ isOpen, closeModal, fetchInvoices, invoice }) => {
  const [formData, setFormData] = useState({
    status: 'Pending',
    payment: 0,
  });
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (invoice) {
      setFormData({
        status: invoice.Status,
        payment: 0,
      });
      setBalance(invoice.Balance);
    }
  }, [invoice]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newBalance = balance - parseFloat(formData.payment);
      await axios.put(`http://localhost:3001/api/invoices/${invoice.InvoiceID}`, {
        status: formData.status,
        balance: newBalance,
      });
      fetchInvoices();
      closeModal();
    } catch (error) {
      console.error('Error updating invoice:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={closeModal} style={customStyles}>
      <h2 className='text-2xl text-center mb-4'>Edit Invoice</h2>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <Label htmlFor="status" value="Status" />
            <Select id="status" name="status" value={formData.status} onChange={handleChange} required>
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="balance" value="Balance" />
            <TextInput id="balance" name="balance" type="number" value={balance} readOnly />
          </div>
          <div>
            <Label htmlFor="payment" value="Payment" />
            <TextInput id="payment" name="payment" type="number" value={formData.payment} onChange={handleChange} required />
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button type="submit" color="success">Update Invoice</Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditInvoiceModal;
