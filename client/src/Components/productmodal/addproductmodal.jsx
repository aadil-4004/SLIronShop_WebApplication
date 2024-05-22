import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { Button, Label, Select, TextInput } from "flowbite-react";
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

const AddProductModal = ({ isOpen, closeModal, fetchProducts }) => {
  const [formData, setFormData] = useState({
    productName: '',
    instock: '',
    price: '',
    category: '',
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (isOpen) {
      axios.get('http://localhost:3001/api/product/categories')
        .then(response => {
          setCategories(response.data);
        })
        .catch(error => {
          console.error('Error fetching categories:', error);
        });
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3001/api/product', formData)
      .then(response => {
        console.log(response.data);
        fetchProducts();
        closeModal();
        window.location.reload(); // Reload the page
      })
      .catch(error => {
        console.error('Error adding product:', error);
      });
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      style={customStyles}
    >
      <h2 className='text-2xl text-center'>Add Product</h2>
      <form onSubmit={handleSubmit}>        
        <div className="space-y-3 mt-3">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="productName" value="Product Name" />
            </div>
            <TextInput
              id="productName"
              name="productName"
              value={formData.productName || ''}
              onChange={handleChange}
              placeholder="Enter product name"
              required
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="instock" value="In-Stock" />
            </div>
            <TextInput
              id="instock"
              name="instock"
              value={formData.instock || ''}
              onChange={handleChange}
              placeholder="Enter quantity"
              required
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="price" value="Price" />
            </div>
            <TextInput
              id="price"
              name="price"
              value={formData.price || ''}
              onChange={handleChange}
              placeholder="Enter price"
              required
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="category" value="Category" />
            </div>
            <Select
              id="category"
              name="category"
              value={formData.category || ''}
              onChange={handleChange}
              required
            >
              <option value="">Select category</option>
              {categories.map(category => (
                <option key={category.CategoryID} value={category.CategoryID}>
                  {category.CategoryName}
                </option>
              ))}
            </Select>
          </div>
        </div>
        <div className="w-full mt-5">
          <Button type="submit">Add Product</Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddProductModal;
