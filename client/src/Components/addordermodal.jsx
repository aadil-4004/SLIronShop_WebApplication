import React, { useState } from 'react';
import Modal from 'react-modal';
import { Button, Label, TextInput, Dropdown, Datepicker } from "flowbite-react";

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

const AddOrderModal = ({ isOpen, closeModal }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    orderID: '',
    status: '',
    dueDate: '',
    contactNum: '',
    product: '',
    quantity: '',
    total: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  const handleDropdownChange = (selectedItem) => {
    setFormData({
      ...formData,
      status: selectedItem,
    });
  };

  const handleDateChange = (selectedDate) => {
    setFormData({
      ...formData,
      dueDate: selectedDate,
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your form submission logic here
    // You can send the form data to your backend or perform any other action
    console.log(formData);
    closeModal();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      style={customStyles}
    >
      <h2 className='text-2xl text-center'>Add Order</h2>
      <form onSubmit={handleSubmit}>        
        <div className="space-y-3 mt-3">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="customerName" value="Customer Name" />
            </div>
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
            <div className="mb-2 block">
              <Label htmlFor="orderID" value="Order ID" />
            </div>
            <TextInput
              id="orderID"
              name="orderID"
              value={formData.orderID || ''}
              onChange={handleChange}
              placeholder="Enter OrderID"
              required
            />
          </div>
          <div>
          <div className="mb-2 block">
            <Label htmlFor="status" value="Status" />
          </div>
          <Dropdown label="Select Status" inline >
            <Dropdown.Item>Completed</Dropdown.Item>
            <Dropdown.Item>Pending</Dropdown.Item>
            <Dropdown.Item>Not Started</Dropdown.Item>
            </Dropdown>
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="dueDate" value="Due Date" />
          </div>
          <Datepicker />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="contactNum" value="Contact Number" />
            </div>
            <TextInput
              id="contactNum"
              name="contactNum"
              placeholder="+94 XXXXXXXXX"
              value={formData.contactNum || ''}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="product" value="Product Name" />
            </div>
            <TextInput
              id="product"
              name="product"
              value={formData.product || ''}
              onChange={handleChange}
              placeholder="Enter product name"
              required
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="quantity" value="Quantity" />
            </div>
            <TextInput
              id="quantity"
              name="quantity"
              value={formData.quantity || ''}
              onChange={handleChange}
              placeholder="Enter quantity"
              required
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="total" value="Total Mmount" />
            </div>
            <TextInput
              id="total"
              name="total"
              value={formData.total || ''}
              onChange={handleChange}
              placeholder="LKR"
              required
            />
          </div>
        </div>
        <div className="w-full mt-5">
          <Button onClick={handleSubmit}>Add Order</Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddOrderModal;
