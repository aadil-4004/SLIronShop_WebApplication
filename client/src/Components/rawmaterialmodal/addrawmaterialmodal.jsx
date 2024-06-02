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

const AddRawMaterialModal = ({ isOpen, closeModal, fetchRawMaterials }) => {
    const [formData, setFormData] = useState({
        rawMaterial: '',
        rawType: ''
    });
    const [rawTypes, setRawTypes] = useState([]);

    useEffect(() => {
        if (isOpen) {
            fetchRawTypes();
        }
    }, [isOpen]);

    const fetchRawTypes = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/rawmaterial/types');
            setRawTypes(response.data);
        } catch (error) {
            console.error('Error fetching raw types:', error);
        }
    };

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
            await axios.post('http://localhost:3001/api/rawmaterial', formData);
            fetchRawMaterials();
            closeModal();
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
                            {rawTypes.map(rawType => (
                                <option key={rawType.RawTypeID} value={rawType.RawTypeID}>
                                    {rawType.RawTypeName}
                                </option>
                            ))}
                        </Select>
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
