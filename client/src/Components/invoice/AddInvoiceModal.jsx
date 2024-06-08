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
    width: '500px',
    maxHeight: '80%',
    overflowY: 'auto',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
};

const AddInvoiceModal = ({ isOpen, closeModal, fetchInvoices }) => {
  const [formData, setFormData] = useState({
    customerID: '',
    jobID: '',
    date: '',
    status: 'Pending',
  });
  const [jobs, setJobs] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [lineItems, setLineItems] = useState([]);

  useEffect(() => {
    if (isOpen) {
      axios.get('http://localhost:3001/api/customers')
        .then(response => setCustomers(response.data))
        .catch(error => console.error('Error fetching customers:', error));

      axios.get('http://localhost:3001/api/jobs')
        .then(response => setJobs(response.data))
        .catch(error => console.error('Error fetching jobs:', error));
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLineItemChange = (index, field, value) => {
    const updatedLineItems = lineItems.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setLineItems(updatedLineItems);
  };

  const addLineItem = () => {
    setLineItems([...lineItems, { description: '', quantity: '', price: '' }]);
  };

  const removeLineItem = (index) => {
    const updatedLineItems = lineItems.filter((_, i) => i !== index);
    setLineItems(updatedLineItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const invoiceData = {
        ...formData,
        lineItems,
      };
      await axios.post('http://localhost:3001/api/invoices', invoiceData);
      fetchInvoices();
      closeModal();
    } catch (error) {
      console.error('Error adding invoice:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={closeModal} style={customStyles}>
      <h2 className='text-2xl text-center'>Add Invoice</h2>
      <form onSubmit={handleSubmit}>
        <div className="space-y-3 mt-3">
          <div>
            <Label htmlFor="customerID" value="Customer" />
            <Select id="customerID" name="customerID" value={formData.customerID} onChange={handleChange} required>
              <option value="">Select customer</option>
              {customers.map(customer => (
                <option key={customer.CustomerID} value={customer.CustomerID}>{customer.CustomerName}</option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="jobID" value="Job" />
            <Select id="jobID" name="jobID" value={formData.jobID} onChange={handleChange} required>
              <option value="">Select job</option>
              {jobs.map(job => (
                <option key={job.JobID} value={job.JobID}>{job.JobID}</option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="date" value="Date" />
            <TextInput id="date" name="date" type="date" value={formData.date} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="status" value="Status" />
            <Select id="status" name="status" value={formData.status} onChange={handleChange} required>
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
            </Select>
          </div>
          <div>
            <h4 className="text-lg font-semibold">Line Items</h4>
            {lineItems.map((item, index) => (
              <div key={index} className="flex space-x-3 mb-2">
                <TextInput
                  className="flex-1"
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => handleLineItemChange(index, 'description', e.target.value)}
                  required
                />
                <TextInput
                  className="w-20"
                  type="number"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) => handleLineItemChange(index, 'quantity', e.target.value)}
                  required
                />
                <TextInput
                  className="w-20"
                  type="number"
                  placeholder="Price"
                  value={item.price}
                  onChange={(e) => handleLineItemChange(index, 'price', e.target.value)}
                  required
                />
                <Button type="button" className="bg-red-500 hover:bg-red-700 w-20" onClick={() => removeLineItem(index)}>
                  Remove
                </Button>
              </div>
            ))}
            <Button type="button" className="bg-green-500 hover:bg-green-700" onClick={addLineItem}>
              Add Line Item
            </Button>
          </div>
        </div>
        <div className="w-full mt-5">
          <Button type="submit">Add Invoice</Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddInvoiceModal;
