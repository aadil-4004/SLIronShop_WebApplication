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

const EditRawMaterialModal = ({ isOpen, closeModal, fetchRawMaterials, rawMaterial }) => {
    const [formData, setFormData] = useState({
      rawMaterial: rawMaterial.RawMaterial,
      quantityToAdd: '', // New state to store the quantity to be added
      unitPrice: rawMaterial.UnitPrice, // New state to store the unit price

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
      const newQuantity = parseInt(rawMaterial.CurrentStock) + parseInt(formData.quantityToAdd); // Calculate new quantity
      const updatedData = {
        rawMaterial: formData.rawMaterial,
        lastUpdate: new Date().toISOString(), // Set lastUpdate to current date and time
        currentStock: newQuantity,
        unitPrice: formData.unitPrice, // Include unit price in the update

      };
      axios.put(`http://localhost:3001/api/rawmaterial/${rawMaterial.RawMaterialID}`, updatedData)
        .then(response => {
          console.log(response.data);
          fetchRawMaterials();
          closeModal();
        })
        .catch(error => {
          console.error('Error updating raw material:', error);
        });
    };
  
    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <h2 className='text-2xl text-center'>Edit Raw Material</h2>
        <form onSubmit={handleSubmit}>        
          <div className="space-y-3 mt-3">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="rawMaterial" value="Raw Material" />
              </div>
              <TextInput
                id="rawMaterial"
                name="rawMaterial"
                value={formData.rawMaterial}
                onChange={handleChange}
                placeholder="Enter raw material"
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="quantityToAdd" value="Quantity to Add" />
              </div>
              <TextInput
                id="quantityToAdd"
                name="quantityToAdd"
                value={formData.quantityToAdd}
                onChange={handleChange}
                placeholder="Enter quantity to add"
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
            <Button type="submit">Update Raw Material</Button>
          </div>
        </form>
      </Modal>
    );
  };
 

export default EditRawMaterialModal;
