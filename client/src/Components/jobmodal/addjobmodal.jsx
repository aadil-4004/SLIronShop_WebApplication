import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { Button, Label, Select, TextInput, Radio, Tabs } from 'flowbite-react';
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

const AddJobModal = ({ isOpen, closeModal, fetchJobs }) => {
  const [formData, setFormData] = useState({
    dueDate: '',
    status: '',
    customerName: '',
    note: '',
    assignedEmployee: '',
  });

  const [products, setProducts] = useState([{ product: '', quantity: '', rawMaterials: [] }]);
  const [productLoad, setProductLoad] = useState([]);
  const [productType, setProductType] = useState('Normal');
  const [rawMaterialLoad, setRawMaterialLoad] = useState([]);
  const [rawMaterials, setRawMaterials] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (isOpen) {
      axios.get('http://localhost:3001/api/product')
        .then(response => {
          setProductLoad(response.data);
        })
        .catch(error => {
          console.error('Error fetching products:', error);
        });

      axios.get('http://localhost:3001/api/rawmaterial')
        .then(response => {
          setRawMaterialLoad(response.data);
        })
        .catch(error => {
          console.error('Error fetching raw materials:', error);
        });

      axios.get('http://localhost:3001/api/customers')
        .then(response => {
          setCustomers(response.data);
        })
        .catch(error => {
          console.error('Error fetching customers:', error);
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

  const handleProductChange = async (index, field, value) => {
    const updatedProducts = products.map((product, i) => {
      if (i === index) {
        return { ...product, [field]: value };
      }
      return product;
    });
    setProducts(updatedProducts);

    if (field === 'product') {
      try {
        const response = await axios.get(`http://localhost:3001/api/product/${value}/rawmaterials`);
        const rawMaterials = response.data;
        const updatedProductsWithRawMaterials = updatedProducts.map((product, i) => {
          if (i === index) {
            return { ...product, rawMaterials };
          }
          return product;
        });
        setProducts(updatedProductsWithRawMaterials);
      } catch (error) {
        console.error('Error fetching raw materials data:', error);
      }
    }
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

  const addProduct = () => {
    setProducts([...products, { product: '', quantity: '', rawMaterials: [] }]);
  };

  const removeProduct = (index) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
  };

  const addRawMaterial = () => {
    setRawMaterials([...rawMaterials, { material: '', quantity: '' }]);
  };

  const removeRawMaterial = (index) => {
    const updatedRawMaterials = rawMaterials.filter((_, i) => i !== index);
    setRawMaterials(updatedRawMaterials);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const jobData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        jobData.append(key, value);
      });
      if (productType === 'Normal') {
        products.forEach((product, index) => {
          jobData.append(`products[${index}][product]`, product.product);
          jobData.append(`products[${index}][quantity]`, product.quantity);
        });
      } else if (productType === 'Customized') {
        rawMaterials.forEach((rm, index) => {
          jobData.append(`rawMaterials[${index}][material]`, rm.material);
          jobData.append(`rawMaterials[${index}][quantity]`, rm.quantity);
        });
        jobData.append('image', image);
      }

      await axios.post('http://localhost:3001/api/jobs', jobData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      fetchJobs();
      closeModal();
      window.location.reload();
    } catch (error) {
      console.error('Error adding job:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={closeModal} style={customStyles}>
      <h2 className='text-2xl text-center'>Add Job</h2>
      <form onSubmit={handleSubmit}>
        <Tabs>
          <Tabs.Tab title="Job Details">
            <div className="space-y-3 mt-3">
              <div>
                <Label htmlFor="customerName" value="Customer Name" className="mb-2 block" />
                <Select
                  id="customerName"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select customer</option>
                  {customers.map(customer => (
                    <option key={customer.CustomerID} value={customer.CustomerID}>
                      {customer.CustomerName}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="dueDate" value="Due Date" className="mb-2 block" />
                <TextInput
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="status" value="Status" className="mb-2 block" />
                <Select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select status</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="note" value="Note" className="mb-2 block" />
                <TextInput
                  id="note"
                  name="note"
                  type="text"
                  placeholder='Enter Special Notes about the Job'
                  value={formData.note}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="assignedEmployee" value="Assigned Employee" className="mb-2 block" />
                <TextInput
                  id="assignedEmployee"
                  name="assignedEmployee"
                  type="text"
                  placeholder='Employee Name'
                  value={formData.assignedEmployee}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </Tabs.Tab>
          <Tabs.Tab title="Product Details">
            <div className="space-y-3 mt-3">
              <div className="flex space-x-3 mb-3">
                <Radio
                  id="normalProduct"
                  name="productType"
                  value="Normal"
                  checked={productType === 'Normal'}
                  onChange={() => setProductType('Normal')}
                />
                <Label htmlFor="normalProduct">Normal Product</Label>
                <Radio
                  id="customizedProduct"
                  name="productType"
                  value="Customized"
                  checked={productType === 'Customized'}
                  onChange={() => setProductType('Customized')}
                />
                <Label htmlFor="customizedProduct">Customized Product</Label>
              </div>
              {productType === 'Normal' && (
                <div>
                  {products.map((product, index) => (
                    <div key={index} className="flex space-x-3 mb-2">
                      <Select
                        className="flex-1"
                        value={product.product}
                        onChange={(e) => handleProductChange(index, 'product', e.target.value)}
                        required
                      >
                        <option value="">Select product</option>
                        {productLoad.map(prod => (
                          <option key={prod.ProductID} value={prod.ProductID}>
                            {prod.ProductName}
                          </option>
                        ))}
                      </Select>
                      <TextInput
                        className="flex-1"
                        type="number"
                        min="1"
                        value={product.quantity}
                        onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                        placeholder="Quantity"
                        required
                      />
                      <Button onClick={() => removeProduct(index)} color="failure">
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button onClick={addProduct}>Add Product</Button>
                </div>
              )}
              {productType === 'Customized' && (
                <div>
                  <h3 className="text-lg font-semibold">Raw Materials</h3>
                  {rawMaterials.map((rm, index) => (
                    <div key={index} className="flex space-x-3 mb-2">
                      <Select
                        className="flex-1"
                        value={rm.material}
                        onChange={(e) => handleRawMaterialChange(index, 'material', e.target.value)}
                        required
                      >
                        <option value="">Select raw material</option>
                        {rawMaterialLoad.map(material => (
                          <option key={material.RawMaterialID} value={material.RawMaterialID}>
                            {material.RawMaterial}
                          </option>
                        ))}
                      </Select>
                      <TextInput
                        className="flex-1"
                        type="number"
                        min="1"
                        value={rm.quantity}
                        onChange={(e) => handleRawMaterialChange(index, 'quantity', e.target.value)}
                        placeholder="Quantity"
                        required
                      />
                      <Button onClick={() => removeRawMaterial(index)} color="failure">
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button onClick={addRawMaterial}>Add Raw Material</Button>
                  <div className="mt-4">
                    <Label htmlFor="image" value="Upload Image" className="mb-2 block" />
                    <TextInput
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>
                </div>
              )}
            </div>
          </Tabs.Tab>
        </Tabs>
        <div className="flex justify-end mt-4">
          <Button onClick={closeModal} color="warning" className="mr-2">Cancel</Button>
          <Button type="submit" color="success">Add Job</Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddJobModal;
