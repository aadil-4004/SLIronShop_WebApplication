import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { Button, Label, Select, TextInput, Tabs, Radio } from 'flowbite-react';
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
    jobID: '',
    createdDate: '',
    dueDate: '',
    status: '',
    customerName: '',
    note: '',
    assignedEmployee: '',
  });

  const [products, setProducts] = useState([{ product: '', quantity: '' }]);
  const [productLoad, setProductLoad] = useState([]);
  const [productType, setProductType] = useState('Normal');
  const [rawMaterials, setRawMaterials] = useState([{ material: '', quantity: '' }]);
  const [rawMaterialLoad, setRawMaterialLoad] = useState([]);
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (isOpen) {
      axios.get('http://localhost:3001/api/products')
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
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = products.map((product, i) => {
      if (i === index) {
        return { ...product, [field]: value };
      }
      return product;
    });
    setProducts(updatedProducts);
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
    setProducts([...products, { product: '', quantity: '' }]);
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
                <Label htmlFor="jobID" value="Job ID" className="mb-2 block" />
                <TextInput
                  id="jobID"
                  name="jobID"
                  value={formData.jobID || ''}
                  onChange={handleChange}
                  placeholder="Enter job ID"
                  required
                />
              </div>
              <div>
                <Label htmlFor="createdDate" value="Created Date" className="mb-2 block" />
                <TextInput
                  id="createdDate"
                  name="createdDate"
                  type="date"
                  value={formData.createdDate || ''}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="dueDate" value="Due Date" className="mb-2 block" />
                <TextInput
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  value={formData.dueDate || ''}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="status" value="Status" className="mb-2 block" />
                <Select
                  id="status"
                  name="status"
                  value={formData.status || ''}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select status</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="customerName" value="Customer Name" className="mb-2 block" />
                <TextInput
                  id="customerName"
                  name="customerName"
                  value={formData.customerName || ''}
                  onChange={handleChange}
                  placeholder="Enter customer name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="note" value="Note" className="mb-2 block" />
                <TextInput
                  id="note"
                  name="note"
                  value={formData.note || ''}
                  onChange={handleChange}
                  placeholder="Enter note"
                  required
                />
              </div>
            </div>
          </Tabs.Tab>
          <Tabs.Tab title="Product Details">
            <div className="space-y-3 mt-3">
              <div className="flex space-x-4 mb-4">
                <Label className="flex items-center">
                  <Radio
                    type="radio"
                    name="productType"
                    value="Normal"
                    checked={productType === 'Normal'}
                    onChange={() => setProductType('Normal')}
                  />
                  <span className="ml-2">Normal</span>
                </Label>
                <Label className="flex items-center">
                  <Radio
                    type="radio"
                    name="productType"
                    value="Customized"
                    checked={productType === 'Customized'}
                    onChange={() => setProductType('Customized')}
                  />
                  <span className="ml-2">Customized</span>
                </Label>
              </div>
              {productType === 'Normal' && (
                <div>
                  <h3 className="text-lg font-semibold">Products</h3>
                  {products.map((product, index) => (
                    <div key={index} className="flex space-x-3 mb-2">
                      <Select
                        className="flex-1"
                        value={product.product}
                        onChange={(e) => handleProductChange(index, 'product', e.target.value)}
                        required
                      >
                        <option value="">Select product</option>
                        {productLoad.map(product => (
                          <option key={product.ProductID} value={product.ProductID}>
                            {product.ProductName}
                          </option>
                        ))}
                      </Select>
                      <TextInput
                        className="w-20"
                        type="number"
                        min="0"
                        placeholder="Qty"
                        value={product.quantity}
                        onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        className="bg-red-500 hover:bg-red-700 w-20"
                        onClick={() => removeProduct(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button type="button" className="bg-green-500 hover:bg-green-700" onClick={addProduct}>
                    Add Another Product
                  </Button>
                </div>
              )}
              {productType === 'Customized' && (
                <div>
                  <Label htmlFor="imageUpload" value="Upload an Image" className="mb-2 block" />
                  <input type="file" accept="image/*" onChange={handleImageChange} required />
                  <h3 className="text-lg font-semibold mt-4">Raw Materials</h3>
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
              )}
            </div>
          </Tabs.Tab>
          <Tabs.Tab title="Office Details">
            <div className="space-y-3 mt-3">
              <div>
                <Label htmlFor="assignedEmployee" value="Assigned Employee" className="mb-2 block" />
                <TextInput
                  id="assignedEmployee"
                  name="assignedEmployee"
                  value={formData.assignedEmployee || ''}
                  onChange={handleChange}
                  placeholder="Enter employee name"
                  required
                />
              </div>
              {/* Add more fields as required */}
            </div>
          </Tabs.Tab>
        </Tabs>
        <div className="w-full mt-5">
          <Button type="submit">Add Job</Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddJobModal;
