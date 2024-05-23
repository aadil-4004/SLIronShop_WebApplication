import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { Button, Label, Select, TextInput } from "flowbite-react";
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
    width: '400px',
    maxHeight: '80%',
    overflowY: 'auto', // Enable vertical scrolling
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
};

const ViewProductModal = ({ isOpen, closeModal }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (isOpen) {
      // Fetch all products
      axios.get('http://localhost:3001/api/product')
        .then(response => {
          setProducts(response.data);
        })
        .catch(error => {
          console.error('Error fetching products:', error);
        });
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      style={customStyles}
    >
      <h2 className='text-2xl text-center'>View Products</h2>
      <div>
        {products.map(product => (
          <div key={product.ProductID} className="mb-3">
            <h3 className="text-lg font-semibold">{product.ProductName}</h3>
            <p>In Stock: {product.InStock}</p>
            <p>Price: {product.Price}</p>
            <p>Category: {product.Category}</p>
            <img src={product.Photose} alt={product.ProductName} style={{ maxWidth: '100%', maxHeight: '200px' }} />
          </div>
        ))}
      </div>
      <div className="w-full mt-5">
        <Button onClick={closeModal}>Close</Button>
      </div>
    </Modal>
  );
};

export default ViewProductModal;
