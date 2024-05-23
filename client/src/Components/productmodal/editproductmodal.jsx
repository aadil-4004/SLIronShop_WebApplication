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

const EditProductModal = ({ isOpen, closeModal, fetchProducts, product }) => {
  const [formData, setFormData] = useState({
    productName: product.ProductName,
    instock: product.InStock,
    price: product.Price,
    category: product.Category,
    imageFile: null, // New state for image file
  });

  const [categories, setCategories] = useState([]);
  const [imageUrl, setImageUrl] = useState('');

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, imageFile: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageFile) {
        // Upload image if a new image is selected
        const imageFormData = new FormData();
        imageFormData.append('image', formData.imageFile);
        const imageResponse = await axios.post('http://localhost:3001/api/product/upload', imageFormData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        const imageUrl = imageResponse.data.imageUrl;
        setImageUrl(imageUrl);
      }

      // Update product with image URL if applicable
      const productData = {
        ...formData,
        imageFile: null, // Remove image file from formData
        Photose: imageUrl || product.Photose, // Use the new image URL if uploaded, otherwise keep the existing one
      };
      await axios.put(`http://localhost:3001/api/product/${product.ProductID}`, productData);

      // Fetch updated product list
      fetchProducts();
      closeModal();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      style={customStyles}
    >
      <h2 className='text-2xl text-center'>Edit Product</h2>
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
          <div>
            <div className="mb-2 block">
              <Label htmlFor="image" value="Image" />
            </div>
            <input type="file" id="image" name="image" onChange={handleImageChange} />
          </div>
        </div>
        <div className="w-full mt-5">
          <Button type="submit">Update Product</Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditProductModal;
