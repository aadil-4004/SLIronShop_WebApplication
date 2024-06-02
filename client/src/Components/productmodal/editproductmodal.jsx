import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { Button, Label, Select, TextInput } from 'flowbite-react';
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
    width: '350px',
    maxHeight: '80%',
    overflowY: 'auto',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
};

const EditProductModal = ({ isOpen, closeModal, fetchProducts, product }) => {
  const [formData, setFormData] = useState({
    productName: product.ProductName,
    workmanCharge: product.WorkmanCharge,
    mrp: product.MRP,
    category: product.Category,
  });

  const [rawMaterials, setRawMaterials] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (isOpen) {
      // Fetch categories
      axios.get('http://localhost:3001/api/product/categories')
        .then(response => {
          setCategories(response.data);
        })
        .catch(error => {
          console.error('Error fetching categories:', error);
        });

      // Fetch raw materials for the product
      axios.get(`http://localhost:3001/api/product/${product.ProductID}/rawmaterials`)
        .then(response => {
          setRawMaterials(response.data);
        })
        .catch(error => {
          console.error('Error fetching raw materials:', error);
        });
    }
  }, [isOpen, product.ProductID]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRawMaterialChange = (index, e) => {
    const { name, value } = e.target;
    const updatedRawMaterials = [...rawMaterials];
    updatedRawMaterials[index] = {
      ...updatedRawMaterials[index],
      [name]: value,
    };
    setRawMaterials(updatedRawMaterials);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        ...formData,
        rawMaterials,
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
            <Label htmlFor="productName" value="Product Name" className="mb-2 block" />
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
            <Label htmlFor="category" value="Category" className="mb-2 block" />
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
            <Label htmlFor="workmanCharge" value="Workman Charge" className="mb-2 block" />
            <TextInput
              id="workmanCharge"
              name="workmanCharge"
              value={formData.workmanCharge || ''}
              onChange={handleChange}
              placeholder="Enter workman charge"
              required
            />
          </div>
          <div>
            <Label htmlFor="mrp" value="MRP" className="mb-2 block" />
            <TextInput
              id="mrp"
              name="mrp"
              value={formData.mrp || ''}
              onChange={handleChange}
              placeholder="Enter markup profit percentage"
              required
            />
          </div>
          {rawMaterials.map((rawMaterial, index) => (
            <div key={index} className="flex space-x-3">
              <div>
                <Label htmlFor={`material-${index}`} value="Material" className="mb-2 block" />
                <TextInput
                  id={`material-${index}`}
                  name="material"
                  value={rawMaterial.material}
                  onChange={(e) => handleRawMaterialChange(index, e)}
                  placeholder="Enter material"
                  required
                />
              </div>
              <div>
                <Label htmlFor={`quantity-${index}`} value="Quantity" className="mb-2 block" />
                <TextInput
                  id={`quantity-${index}`}
                  name="quantity"
                  value={rawMaterial.quantity}
                  onChange={(e) => handleRawMaterialChange(index, e)}
                  placeholder="Enter quantity"
                  required
                />
              </div>
            </div>
          ))}
        </div>
        <div className="w-full mt-5">
          <Button type="submit">Update Product</Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditProductModal;
