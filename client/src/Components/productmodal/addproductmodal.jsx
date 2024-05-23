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
    imageFile: null,
    
  });

  const [categories, setCategories] = useState([]);
  const [rawMaterialload, setrawMaterialload] = useState([]);

  const [rawMaterials, setRawMaterials] = useState([{ material: '', quantity: '' }]);

  useEffect(() => {
    if (isOpen) {
      axios.get('http://localhost:3001/api/product/categories')
        .then(response => {
          setCategories(response.data);
        })
        .catch(error => {
          console.error('Error fetching categories:', error);
        });

        axios.get('http://localhost:3001/api/rawmaterial')
        .then(response => {
          setrawMaterialload(response.data);
          console.log(response.data);
        })
        .catch(error => {
          console.error('Error fetching rawmaterials:', error);
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

  const handleRawMaterialChange = (index, field, value) => {
    const updatedRawMaterials = rawMaterials.map((rm, i) => {
      if (i === index) {
        return { ...rm, [field]: value };
      }
      return rm;
    });
    setRawMaterials(updatedRawMaterials);
  };

  const addRawMaterial = () => {
    setRawMaterials([...rawMaterials, { material: '', quantity: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Upload image
      const imageFormData = new FormData();
      imageFormData.append('image', formData.imageFile);
      const imageResponse = await axios.post('http://localhost:3001/api/product/upload', imageFormData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      const imageUrl = imageResponse.data.imageUrl;

      // Add product with image URL
      const productData = {
        ...formData,
        rawMaterials,
        imageFile: null,
        Photose: imageUrl,
      };
      await axios.post('http://localhost:3001/api/product', productData);

      // Fetch updated product list
      fetchProducts();
      closeModal();
      window.location.reload(); // Reload the page
    } catch (error) {
      console.error('Error adding product:', error);
    }
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
          <div>
            <div className="mb-2 block">
              <Label htmlFor="image" value="Image" />
            </div>
            <input type="file" id="image" name="image" onChange={handleImageChange} required />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Raw Materials</h3>
            
                <Select
                  className="flex-1"
                  value={rawMaterials.material}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select material</option>
                  {rawMaterialload.map(material => (
                <option key={material.RawMaterialID} value={material.RawMaterialID}>
                  {material.RawMaterial}
                    </option>
                  ))}
                </Select>
                <TextInput
                  className="flex-1"
                  type="number"
                  min="0"
                  placeholder="Quantity"
                  value={rawMaterials.quantity}
                  onChange={handleChange}
                  required
                />
              </div>
            
            <Button type="button" onClick={addRawMaterial}>Add Another Material</Button>
          </div>
        
        <div className="w-full mt-5">
          <Button type="submit">Add Product</Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddProductModal;
