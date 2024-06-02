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

const AddProductModal = ({ isOpen, closeModal, fetchProducts }) => {
  const [formData, setFormData] = useState({
    productName: '',
    workmanCharge: '',
    mrp: '',
    category: '',
  });

  const [categories, setCategories] = useState([]);
  const [rawMaterialLoad, setRawMaterialLoad] = useState([]);
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
          setRawMaterialLoad(response.data);
        })
        .catch(error => {
          console.error('Error fetching raw materials:', error);
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

  const removeRawMaterial = (index) => {
    const updatedRawMaterials = rawMaterials.filter((_, i) => i !== index);
    setRawMaterials(updatedRawMaterials);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        ...formData,
        rawMaterials,
      };
      await axios.post('http://localhost:3001/api/product', productData);
      fetchProducts();
      closeModal();
      window.location.reload(); // Reload the page
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={closeModal} style={customStyles}>
      <h2 className='text-2xl text-center'>Add Product</h2>
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
            <h3 className="text-lg font-semibold">Raw Materials</h3>
            {rawMaterials.map((rawMaterial, index) => (
              <div key={index} className="flex space-x-3 mb-2">
                <Select
                  className="flex-1"
                  value={rawMaterial.material}
                  onChange={(e) => handleRawMaterialChange(index, 'material', e.target.value)}
                  required
                >
                  <option value="">Select material</option>
                  {rawMaterialLoad.map(material => (
                    <option key={material.RawMaterialID} value={material.RawMaterialID}>
                      {material.RawMaterial}
                    </option>
                  ))}
                </Select>
                <TextInput
                  className="w-20"
                  type="number"
                  min="0"
                  placeholder="Qty"
                  value={rawMaterial.quantity}
                  onChange={(e) => handleRawMaterialChange(index, 'quantity', e.target.value)}
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
        </div>
        <div className="w-full mt-5">
          <Button type="submit">Add Product</Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddProductModal;
