import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { Radio, Tabs, Label, Select, TextInput, Button } from 'flowbite-react';
import AddNormalJobDetails from '../jobmodal/addnormaljobmodal';
import AddCustomizedJobDetails from '../jobmodal/addcustomizedjobmodal';
import axios from 'axios';
import AddCustomerModal from '../customermodal/addcustomermodal';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '90%',
    width: '550px',
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
    customerID: '',
    note: '',
    assignedEmployee: '',
  });

  const [products, setProducts] = useState([{ product: '', quantity: '', rawMaterials: [], cost: 0 }]);
  const [productLoad, setProductLoad] = useState([]);
  const [productType, setProductType] = useState('Normal');
  const [rawMaterials, setRawMaterials] = useState([]);
  const [rawMaterialLoad, setRawMaterialLoad] = useState([]);
  const [rawMaterialBatches, setRawMaterialBatches] = useState({});
  const [customers, setCustomers] = useState([]);
  const [image, setImage] = useState(null);
  const [customProductName, setCustomProductName] = useState('');
  const [addCustomerModalIsOpen, setAddCustomerModalIsOpen] = useState(false);
  const [customerPhoneNumber, setCustomerPhoneNumber] = useState('');
  const [customerDetails, setCustomerDetails] = useState(null);

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

      fetchCustomers();
    }
  }, [isOpen]);

  const fetchCustomers = () => {
    axios.get('http://localhost:3001/api/customers')
      .then(response => {
        setCustomers(response.data);
      })
      .catch(error => {
        console.error('Error fetching customers:', error);
      });
  };

  const fetchCustomerByPhoneNumber = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/customers/phone/${customerPhoneNumber}`);
      setCustomerDetails(response.data);
      setFormData({ ...formData, customerID: response.data.CustomerID });
    } catch (error) {
      console.error('Error fetching customer by phone number:', error);
      setCustomerDetails(null);
    }
  };

  const calculateNormalProductCosts = async (products) => {
    const updatedProducts = await Promise.all(products.map(async (product) => {
      const rawMaterials = await Promise.all(product.rawMaterials.map(async (rm) => {
        const batches = await fetchBatchesForRawMaterial(rm.material);
        const unitPrice = batches.reduce((acc, batch) => acc + batch.UnitPrice, 0) / batches.length;
        const cost = unitPrice * rm.quantity;
        return { ...rm, cost };
      }));
      const totalCost = rawMaterials.reduce((acc, rm) => acc + rm.cost, 0);
      return { ...product, rawMaterials, cost: totalCost };
    }));
    return updatedProducts;
  };

  const fetchBatchesForRawMaterial = async (materialId) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/rawmaterial/${materialId}/batches`);
      return response.data;
    } catch (error) {
      console.error('Error fetching batch data:', error);
      return [];
    }
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

        const batchesPromises = rawMaterials.map((rm) => axios.get(`http://localhost:3001/api/rawmaterial/${rm.material}/batches`));
        const batchesResponses = await Promise.all(batchesPromises);
        const batchesData = batchesResponses.reduce((acc, response, idx) => {
          acc[rawMaterials[idx].material] = response.data;
          return acc;
        }, {});
        setRawMaterialBatches((prevBatches) => ({
          ...prevBatches,
          ...batchesData,
        }));
      } catch (error) {
        console.error('Error fetching raw materials or batches:', error);
      }
    }
  };

  const handleRawMaterialChange = async (index, field, value) => {
    const updatedRawMaterials = rawMaterials.map((rm, i) => {
      if (i === index) {
        return { ...rm, [field]: value };
      }
      return rm;
    });
    setRawMaterials(updatedRawMaterials);

    if (field === 'material') {
      try {
        const response = await axios.get(`http://localhost:3001/api/rawmaterial/${value}/batches`);
        const batches = response.data;
        setRawMaterialBatches((prevBatches) => ({
          ...prevBatches,
          [value]: batches,
        }));
      } catch (error) {
        console.error('Error fetching batch data:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const jobData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        jobData.append(key, value);
      });

      if (productType === 'Normal') {
        const updatedProducts = await calculateNormalProductCosts(products);
        jobData.append('products', JSON.stringify(updatedProducts));
      } else if (productType === 'Customized') {
        const totalCost = rawMaterials.reduce((acc, rm) => acc + parseFloat(rm.cost), 0);
        const updatedRawMaterials = rawMaterials.map(rm => ({ ...rm, cost: rm.cost || 0 }));
        jobData.append('rawMaterials', JSON.stringify(updatedRawMaterials));
        jobData.append('image', image);
        jobData.append('customProductName', customProductName);
        jobData.append('totalCost', totalCost);
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

  const addProduct = () => {
    setProducts([...products, { product: '', quantity: '', rawMaterials: [], cost: 0 }]);
  };

  const removeProduct = (index) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
  };

  const addRawMaterial = () => {
    setRawMaterials([...rawMaterials, { material: '', quantity: '', cost: 0 }]);
  };

  const removeRawMaterial = (index) => {
    const updatedRawMaterials = rawMaterials.filter((_, i) => i !== index);
    setRawMaterials(updatedRawMaterials);
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={closeModal} style={customStyles}>
      <h2 className='text-2xl text-center'>Add Job</h2>
      <form onSubmit={handleSubmit}>
        <Tabs>
          <Tabs.Tab title="Job Details">
            <div className="space-y-3 mt-3">
              <div>
                <Label htmlFor="customerPhoneNumber" value="Customer Phone Number" className="mb-2 block" />
                <div className="flex items-center">
                  <TextInput
                    id="customerPhoneNumber"
                    name="customerPhoneNumber"
                    type="text"
                    placeholder="Enter customer phone number"
                    value={customerPhoneNumber}
                    onChange={(e) => setCustomerPhoneNumber(e.target.value)}
                  />
                  <Button onClick={fetchCustomerByPhoneNumber} className="ml-2">Search</Button>
                </div>
                {customerDetails && (
                  <div className="mt-2 py-2 flex justify-between">
                    <div> 
                      <p><strong>Customer Name:</strong> {customerDetails.CustomerName}</p>
                    </div>
                    <div className='text-right'>
                      <strong>Customer ID:</strong> {customerDetails.CustomerID}
                    </div>
                  </div>
                )}
                <Button onClick={() => setAddCustomerModalIsOpen(true)} color="light" className="mt-2">
                  Add New Customer
                </Button>
              </div>
              <div>
                <Label htmlFor="dueDate" value="Due Date" className="mb-2 block" />
                <TextInput
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="status" value="Status" className="mb-2 block" />
                <Select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, assignedEmployee: e.target.value })}
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
              {productType === 'Normal' ? (
                <AddNormalJobDetails
                  products={products}
                  setProducts={setProducts}
                  productLoad={productLoad}
                  handleProductChange={handleProductChange}
                  addProduct={addProduct}
                  removeProduct={removeProduct}
                  rawMaterialBatches={rawMaterialBatches}
                />
              ) : (
                <AddCustomizedJobDetails
                  rawMaterials={rawMaterials}
                  setRawMaterials={setRawMaterials}
                  rawMaterialLoad={rawMaterialLoad}
                  rawMaterialBatches={rawMaterialBatches}
                  setRawMaterialBatches={setRawMaterialBatches}
                  handleRawMaterialChange={handleRawMaterialChange}
                  addRawMaterial={addRawMaterial}
                  removeRawMaterial={removeRawMaterial}
                  handleImageChange={(e) => setImage(e.target.files[0])}
                  customProductName={customProductName}
                  setCustomProductName={setCustomProductName}
                />
              )}
            </div>
          </Tabs.Tab>
        </Tabs>
        <div className="flex justify-end mt-4">
          <Button onClick={closeModal} color="warning" className="mr-2">Cancel</Button>
          <Button type="submit" color="success">Add Job</Button>
        </div>
      </form>
      <AddCustomerModal
        isOpen={addCustomerModalIsOpen}
        closeModal={() => setAddCustomerModalIsOpen(false)}
        fetchCustomers={fetchCustomers}
      />
    </Modal>
  );
};

export default AddJobModal;
