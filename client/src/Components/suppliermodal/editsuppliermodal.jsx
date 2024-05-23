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

const EditSupplierModal = ({ isOpen, closeModal, fetchSuppliers, supplier }) => {
  const [formData, setFormData] = useState({
    supplierName: supplier.SupplierName,
    type: supplier.Type,
    email: supplier.Email,
    contactNum: supplier.ContactNum,
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
    axios.put(`http://localhost:3001/api/suppliers/${supplier.SupplierID}`, formData)
      .then(response => {
        console.log(response.data);
        fetchSuppliers();
        closeModal();
      })
      .catch(error => {
        console.error('Error updating supplier:', error);
      });
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      style={customStyles}
    >
      <h2 className='text-2xl text-center'>Edit Supplier</h2>
      <form onSubmit={handleSubmit}>        
        <div className="space-y-3 mt-3">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="supplierName" value="Supplier Name" />
            </div>
            <TextInput
              id="supplierName"
              name="supplierName"
              value={formData.supplierName}
              onChange={handleChange}
              placeholder="Enter supplier name"
              required
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="type" value="Type" />
            </div>
            <TextInput
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              placeholder="Enter type"
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
              value={formData.email}
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
              placeholder="+XX XXXXXXXXX"
              value={formData.contactNum}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="w-full mt-5">
          <Button type="submit">Update Supplier</Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditSupplierModal;
