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
    width: '450px',
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
  const [imageFile, setImageFile] = useState(null); // New state for image file
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

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const addRawMaterial = () => {
    setRawMaterials([...rawMaterials, { material: '', quantity: '' }]);
  };

  const removeRawMaterial = (index) => {
    const updatedRawMaterials = rawMaterials.filter((_, i) => i !== index);
    setRawMaterials(updatedRawMaterials);
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
    const formDataToSend = new FormData();
    formDataToSend.append('productName', formData.productName);
    formDataToSend.append('workmanCharge', formData.workmanCharge);
    formDataToSend.append('mrp', formData.mrp);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('rawMaterials', JSON.stringify(rawMaterials));
    if (imageFile) {
      formDataToSend.append('image', imageFile);
    }

    try {
      await axios.put(`http://localhost:3001/api/product/${product.ProductID}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

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
          <div>
            <Label htmlFor="image" value="Product Image" className="mb-2 block" />
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <div>
            <h4 className="text-lg font-semibold">Raw Materials</h4>
            {rawMaterials.map((rawMaterial, index) => (
              <div key={index} className="flex space-x-3 mb-2">
                <Label htmlFor={`material-${index}`} />
                <TextInput
                  className="flex-1"
                  id={`material-${index}`}
                  name="material"
                  value={rawMaterial.materialName}
                  onChange={(e) => handleRawMaterialChange(index, e)}
                  placeholder="Enter material"
                  required
                  readonly
                />
                <Label htmlFor={`quantity-${index}`} />
                <TextInput
                  className="w-20"
                  id={`quantity-${index}`}
                  name="quantity"
                  value={rawMaterial.quantity}
                  onChange={(e) => handleRawMaterialChange(index, e)}
                  placeholder="Enter quantity"
                  required
                />
                <Button
                  type="button"
                  className="bg-red-500 hover:bg-red-700 w-20"
                  onClick={() => removeRawMaterial(index)}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button type="button" className="bg-green-500 hover:bg-green-700" onClick={addRawMaterial}>
              Add Another Material
            </Button>
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
