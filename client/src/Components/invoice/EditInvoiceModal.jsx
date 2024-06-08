import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { Button, Label, TextInput, Select } from 'flowbite-react';
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

const EditInvoiceModal = ({ isOpen, closeModal, fetchInvoices, invoice }) => {
  const [formData, setFormData] = useState({
    customerID: '',
    jobID: '',
    date: '',
    status: 'Pending',
    lineItems: [{ description: '', quantity: '', price: '' }],
  });

  useEffect(() => {
    if (invoice) {
      setFormData({
        customerID: invoice.CustomerID,
        jobID: invoice.JobID,
        date: new Date(invoice.Date).toISOString().split('T')[0],
        status: invoice.Status,
        lineItems: invoice.lineItems || [{ description: '', quantity: '', price: '' }],
      });
    }
  }, [invoice]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLineItemChange = (index, field, value) => {
    const updatedLineItems = formData.lineItems.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setFormData({
      ...formData,
      lineItems: updatedLineItems,
    });
  };

  const addLineItem = () => {
    setFormData({
      ...formData,
      lineItems: [...formData.lineItems, { description: '', quantity: '', price: '' }],
    });
  };

  const removeLineItem = (index) => {
    const updatedLineItems = formData.lineItems.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      lineItems: updatedLineItems,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3001/api/invoices/${invoice.InvoiceID}`, formData);
      fetchInvoices();
      closeModal();
    } catch (error) {
      console.error('Error updating invoice:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={closeModal} style={customStyles}>
      <h2 className='text-2xl text-center mb-4'>Edit Invoice</h2>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <Label htmlFor="customerID" value="Customer" />
            <TextInput id="customerID" name="customerID" value={formData.customerID} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="jobID" value="Job ID" />
            <TextInput id="jobID" name="jobID" value={formData.jobID} onChange={handleChange} required />
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
            {formData.lineItems.map((item, index) => (
              <div key={index} className="flex space-x-3 mb-2">
                <TextInput
                  className="flex-1"
                  name="description"
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => handleLineItemChange(index, 'description', e.target.value)}
                  required
                />
                <TextInput
                  className="w-20"
                  name="quantity"
                  type="number"
                  min="0"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) => handleLineItemChange(index, 'quantity', e.target.value)}
                  required
                />
                <TextInput
                  className="w-20"
                  name="price"
                  type="number"
                  min="0"
                  placeholder="Price"
                  value={item.price}
                  onChange={(e) => handleLineItemChange(index, 'price', e.target.value)}
                  required
                />
                <Button type="button" color="red" onClick={() => removeLineItem(index)}>Remove</Button>
              </div>
            ))}
            <Button type="button" color="green" onClick={addLineItem}>Add Line Item</Button>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button type="submit" color="success">Update Invoice</Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditInvoiceModal;
