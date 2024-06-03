import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { Button } from 'flowbite-react';
import axios from 'axios';

Modal.setAppElement('#root');

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
    overflowY: 'auto',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
};

const ViewProductModal = ({ isOpen, closeModal, product }) => {
  const [rawMaterials, setRawMaterials] = useState([]);

  useEffect(() => {
    if (isOpen && product) {
      fetchRawMaterials(product.ProductID);
    }
  }, [isOpen, product]);

  const fetchRawMaterials = async (productId) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/product/${productId}/rawmaterials`);
      setRawMaterials(response.data);
    } catch (error) {
      console.error('Error fetching raw materials data:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={closeModal} style={customStyles}>
      <h2 className="text-2xl text-center">View Product</h2>
      {product ? (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">{product.ProductName}</h3>
          <p>Workman Charge: {product.WorkmanCharge}</p>
          <p>MRP: {product.MRP}</p>
          <p>Category: {product.Category}</p>
          {product.Image && (
            <img
              src={`http://localhost:3001/${product.Image}`}
              alt={product.ProductName}
              style={{ maxWidth: '100%', maxHeight: '200px' }}
            />
          )}
          <h4 className="text-lg font-semibold mt-4">Raw Materials</h4>
          {rawMaterials.length > 0 ? (
            rawMaterials.map((rm) => (
              <div key={rm.material} className="mb-2">
                <p>{rm.materialName}: {rm.quantity}</p>
              </div>
            ))
          ) : (
            <p>No raw materials data available.</p>
          )}
        </div>
      ) : (
        <p>No product details available.</p>
      )}
      <div className="w-full mt-5">
        <Button onClick={closeModal}>Close</Button>
      </div>
    </Modal>
  );
};

export default ViewProductModal;
