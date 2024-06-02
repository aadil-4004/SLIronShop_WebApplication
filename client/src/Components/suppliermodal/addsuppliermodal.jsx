import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { Button, Label, TextInput, Select } from "flowbite-react";
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

const AddSupplierModal = ({ isOpen, closeModal, fetchSuppliers }) => {
  const [formData, setFormData] = useState({
    supplierName: '',
    rawType: '',
    email: '',
    contactNum: '',
  });
  const [rawTypes, setRawTypes] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/api/rawtypes')
      .then(response => {
        setRawTypes(response.data);
      })
      .catch(error => {
        console.error('Error fetching raw types:', error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3001/api/suppliers', formData)
      .then(response => {
        console.log(response.data);
        fetchSuppliers();
        closeModal();
      })
      .catch(error => {
        console.error('Error adding supplier:', error);
      });
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      style={customStyles}
    >
      <h2 className='text-2xl text-center'>Add Supplier</h2>
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
              <Label htmlFor="rawType" value="Raw Type" />
            </div>
            <Select
              id="rawType"
              name="rawType"
              value={formData.rawType}
              onChange={handleChange}
              required
            >
              <option value="">Select raw type</option>
              {rawTypes.map((rawType) => (
                <option key={rawType.RawTypeID} value={rawType.RawTypeID}>
                  {rawType.RawTypeName}
                </option>
              ))}
            </Select>
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
          <Button type="submit">Add Supplier</Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddSupplierModal;
