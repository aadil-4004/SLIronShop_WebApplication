import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Button } from 'flowbite-react';
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
      console.log(`Fetching raw materials for product ID: ${productId}`);
      const response = await axios.get(`http://localhost:3001/api/product/${productId}/rawmaterials`);
      setRawMaterials(response.data);
    } catch (error) {
      console.error('Error fetching raw materials data:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={closeModal} style={customStyles}>
      <h2 className="text-2xl text-center mb-4">View Product</h2>
      {product ? (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">{product.ProductName}</h3>
            <p><strong>Workman Charge:</strong> {product.WorkmanCharge}</p>
            <p><strong>MRP:</strong> {product.MRP}</p>
            <p><strong>Category:</strong> {product.Category}</p>
            {product.Image && (
              <img
                src={`http://localhost:3001/${product.Image}`}
                alt={product.ProductName}
                style={{ maxWidth: '100%', maxHeight: '200px' }}
                className="mt-2"
              />
            )}
          </div>
          <div>
            <h4 className="text-lg font-semibold">Raw Materials</h4>
            {rawMaterials.length > 0 ? (
              <Table hoverable>
                <TableHead>
                  
                    <TableHeadCell>Material Name</TableHeadCell>
                    <TableHeadCell>Quantity</TableHeadCell>
                  
                </TableHead>
                <TableBody>
                  {rawMaterials.map((rm, index) => (
                    <TableRow key={index}>
                      <TableCell>{rm.materialName}</TableCell>
                      <TableCell>{rm.quantity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p>No raw materials data available.</p>
            )}
          </div>
        </div>
      ) : (
        <p>No product details available.</p>
      )}
      <div className="flex justify-end mt-4">
        <Button onClick={closeModal} color="warning">Close</Button>
      </div>
    </Modal>
  );
};

export default ViewProductModal;
