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
        overflowY: 'auto',
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
};

const EditRawMaterialModal = ({ isOpen, closeModal, fetchRawMaterials, rawMaterial }) => {
    const [formData, setFormData] = useState({
        rawMaterial: rawMaterial.RawMaterial,
    });
    const [batchData, setBatchData] = useState({
        Quantity: '',
        UnitPrice: '',
        DateReceived: '',
        SupplierID: ''
    });
    const [suppliers, setSuppliers] = useState([]);

    useEffect(() => {
        fetchSuppliersByRawType(rawMaterial.RawType);
    }, [rawMaterial.RawType]);

    const fetchSuppliersByRawType = async (rawType) => {
        try {
            const response = await axios.get(`http://localhost:3001/api/batchrawmaterial/suppliers?rawType=${rawType}`);
            setSuppliers(response.data);
        } catch (error) {
            console.error('Error fetching suppliers:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleBatchChange = (e) => {
        const { name, value } = e.target;
        setBatchData({
            ...batchData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          // Only handle batch data, no need to update raw material
          const newBatch = { 
              ...batchData, 
              RawMaterialID: rawMaterial.RawMaterialID 
          };
          await axios.post('http://localhost:3001/api/batchrawmaterial', newBatch);
          
          fetchRawMaterials();
          closeModal();
      } catch (error) {
          console.error('Error updating raw material:', error);
      }
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
                            value={formData.rawMaterial || ''}
                            onChange={handleChange}
                            placeholder="Enter raw material name"
                            required
                            readOnly
                        />
                    </div>
                    <hr className="my-4" />
                    <h3 className="text-xl">Add Batch</h3>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="Quantity" value="Quantity" />
                        </div>
                        <TextInput
                            id="Quantity"
                            name="Quantity"
                            type='number'
                            min="0"
                            value={batchData.Quantity || ''}
                            onChange={handleBatchChange}
                            placeholder="Enter quantity"
                            required
                        />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="batchUnitPrice" value="Unit Price" />
                        </div>
                        <TextInput
                            id="batchUnitPrice"
                            name="UnitPrice"
                            value={batchData.UnitPrice || ''}
                            onChange={handleBatchChange}
                            placeholder="Enter unit price"
                            required
                        />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="DateReceived" value="Date Received" />
                        </div>
                        <TextInput
                            id="DateReceived"
                            name="DateReceived"
                            type="date"
                            value={batchData.DateReceived || ''}
                            onChange={handleBatchChange}
                            required
                        />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="SupplierID" value="Supplier" />
                        </div>
                        <Select
                            id="SupplierID"
                            name="SupplierID"
                            value={batchData.SupplierID}
                            onChange={handleBatchChange}
                            required
                        >
                            <option value="">Select supplier</option>
                            {suppliers.map(supplier => (
                                <option key={supplier.SupplierID} value={supplier.SupplierID}>
                                    {supplier.SupplierName}
                                </option>
                            ))}
                        </Select>
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
