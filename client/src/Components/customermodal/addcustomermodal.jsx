import React, { useState } from 'react';
import Modal from 'react-modal';
import { Button, Label, TextInput } from "flowbite-react";
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
    width: '400px',
    maxHeight: '80%',
    overflowY: 'auto', // Enable vertical scrolling
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
};

const AddCustomerModal = ({ isOpen, closeModal, fetchCustomers }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    contactNum: '',
    address: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3001/api/customers', formData) // Corrected endpoint
      .then(response => {
        console.log(response.data);
        fetchCustomers();
        closeModal();
        window.location.reload(); // Reload the page
      })
      .catch(error => {
        console.error('Error adding customer:', error);
      });
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      style={customStyles}
    >
      <h2 className='text-2xl text-center'>Add Customer</h2>
      <form onSubmit={handleSubmit}>        
        <div className="space-y-3 mt-3">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="customerName" value="Customer Name" />
            </div>
            <TextInput
              id="customerName"
              name="customerName"
              value={formData.customerName || ''}
              onChange={handleChange}
              placeholder="Enter customer name"
              required
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="email" value="Email" />
            </div>
            <TextInput
              id="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              type="email"
              placeholder="Enter email"
              required
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="contactNum" value="Contact Number" />
            </div>
            <TextInput
              id="contactNum"
              name="contactNum"
              placeholder="+94 XXXXXXXXX"
              value={formData.contactNum || ''}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="address" value="Address" />
            </div>
            <TextInput
              id="address"
              name="address"
              value={formData.address || ''}
              onChange={handleChange}
              placeholder="Enter address"
              required
            />
          </div>
        </div>
        <div className="w-full mt-5">
          <Button type="submit">Add Customer</Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddCustomerModal;
