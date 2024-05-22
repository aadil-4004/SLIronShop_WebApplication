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
    overflowY: 'auto',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
};

const AddRawMaterialModal = ({ isOpen, closeModal, fetchRawMaterials }) => {
  const [formData, setFormData] = useState({
    rawMaterial: '',
    currentStock: '',
    unitPrice: '', // Add unitPrice field
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataWithTimestamp = {
      ...formData,
      lastUpdate: new Date().toISOString(), // Set the current date and time
    };
    try {
      await axios.post('http://localhost:3001/api/rawmaterial', formDataWithTimestamp);
      fetchRawMaterials(); // Refresh raw materials list
      closeModal(); // Close the modal
      window.location.reload(); // Reload the page

    } catch (error) {
      console.error('Error adding raw material:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      style={customStyles}
    >
      <h2 className='text-2xl text-center'>Add Raw Material</h2>
      <form onSubmit={handleSubmit}>
        <div className="space-y-3 mt-3">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="rawMaterial" value="Raw Material" />
            </div>
            <TextInput
              id="rawMaterial"
              name="rawMaterial"
              value={formData.rawMaterial || ''}
              onChange={handleChange}
              placeholder="Enter raw material name"
              required
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="currentStock" value="Current Stock" />
            </div>
            <TextInput
              id="currentStock"
              name="currentStock"
              value={formData.currentStock || ''}
              onChange={handleChange}
              placeholder="Enter current stock"
              required
            />
          </div>
          <div> {/* Add UnitPrice field */}
            <div className="mb-2 block">
              <Label htmlFor="unitPrice" value="Unit Price" />
            </div>
            <TextInput
              id="unitPrice"
              name="unitPrice"
              value={formData.unitPrice || ''}
              onChange={handleChange}
              placeholder="Enter unit price"
              required
            />
          </div>
        </div>
        <div className="w-full mt-5">
          <Button type="submit">Add Raw Material</Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddRawMaterialModal;
