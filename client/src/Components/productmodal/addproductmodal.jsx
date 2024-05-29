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
    instock: '',
    serviceCharge: '',
    category: '',
  });

  const [categories, setCategories] = useState([]);
  const [rawMaterialLoad, setRawMaterialLoad] = useState([]);
  const [rawMaterials, setRawMaterials] = useState([{ material: '', quantity: '', unitPrice: 0 }]);
  const [rawMaterialCost, setRawMaterialCost] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);

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

  useEffect(() => {
    calculateRawMaterialCost();
  }, [rawMaterials]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === 'serviceCharge') {
      setFinalPrice(rawMaterialCost + parseFloat(value || 0));
    }
  };

  const handleRawMaterialChange = (index, field, value) => {
    const updatedRawMaterials = rawMaterials.map((rm, i) => {
      if (i === index) {
        const updatedMaterial = { ...rm, [field]: value };
        if (field === 'material') {
          const materialData = rawMaterialLoad.find(m => m.RawMaterialID === parseInt(value));
          updatedMaterial.unitPrice = materialData ? materialData.UnitPrice : 0;
        }
        return updatedMaterial;
      }
      return rm;
    });

    setRawMaterials(updatedRawMaterials);
  };

  const calculateRawMaterialCost = () => {
    let totalCost = 0;
    rawMaterials.forEach((rm) => {
      totalCost += rm.unitPrice * parseFloat(rm.quantity || 0);
    });
    setRawMaterialCost(totalCost);
    setFinalPrice(totalCost + parseFloat(formData.serviceCharge || 0));
  };

  const addRawMaterial = () => {
    setRawMaterials([...rawMaterials, { material: '', quantity: '', unitPrice: 0 }]);
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
        price: finalPrice,
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
            <Label htmlFor="instock" value="In-Stock" className="mb-2 block" />
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
            <Label htmlFor="rawMaterialCost" value="Raw Material Cost" className="mb-2 block" />
            <TextInput
              id="rawMaterialCost"
              name="rawMaterialCost"
              value={rawMaterialCost}
              readOnly
            />
          </div>
          <div>
            <Label htmlFor="serviceCharge" value="Service Charge" className="mb-2 block" />
            <TextInput
              id="serviceCharge"
              name="serviceCharge"
              value={formData.serviceCharge || ''}
              onChange={handleChange}
              placeholder="Enter service charge"
              required
            />
          </div>
          <div>
            <Label htmlFor="finalPrice" value="Final Price" className="mb-2 block" />
            <TextInput
              id="finalPrice"
              name="finalPrice"
              value={finalPrice}
              readOnly
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
