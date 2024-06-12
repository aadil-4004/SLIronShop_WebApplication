import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Button } from 'flowbite-react';
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

const ViewJobModal = ({ isOpen, closeModal, job }) => {
  const [jobDetails, setJobDetails] = useState(null);
  const [products, setProducts] = useState([]);
  const [rawMaterials, setRawMaterials] = useState([]);
  const [productBatchUsage, setProductBatchUsage] = useState([]);

  useEffect(() => {
    if (job) {
      const fetchJobDetails = async () => {
        try {
          const productResponse = await axios.get(`http://localhost:3001/api/jobs/${job.JobID}/products`);
          setProducts(productResponse.data);

          const rawMaterialsResponse = await axios.get(`http://localhost:3001/api/jobs/${job.JobID}/rawmaterials`);
          setRawMaterials(rawMaterialsResponse.data);

          const productBatchUsageResponse = await axios.get(`http://localhost:3001/api/jobs/${job.JobID}/productbatchusage`);
          setProductBatchUsage(productBatchUsageResponse.data);

          setJobDetails(job);
        } catch (error) {
          console.error('Error fetching job details:', error);
        }
      };

      fetchJobDetails();
    }
  }, [job]);

  if (!jobDetails) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onRequestClose={closeModal} style={customStyles}>
      <h2 className='text-2xl text-center mb-4'>Job Details</h2>
      <div className="space-y-4">
        <div>
          <p><strong>Job ID:</strong> {jobDetails.JobID}</p>
          <p><strong>Customer Name:</strong> {jobDetails.CustomerName}</p>
          <p><strong>Status:</strong> {jobDetails.Status}</p>
          <p><strong>Due Date:</strong> {new Date(jobDetails.DueDate).toLocaleDateString()}</p>
          <p><strong>Note:</strong> {jobDetails.Note}</p>
          <p><strong>Assigned Employee:</strong> {jobDetails.EmployeeName}</p>
        </div>
        {products.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold">Products</h3>
            <Table hoverable>
              <TableHead>
                
                  <TableHeadCell>Product ID</TableHeadCell>
                  <TableHeadCell>Product Name</TableHeadCell>
                  <TableHeadCell>Quantity</TableHeadCell>
                
              </TableHead>
              <TableBody>
                {products.map((product, index) => (
                  <TableRow key={index}>
                    <TableCell>{product.ProductID}</TableCell>
                    <TableCell>{product.ProductName}</TableCell>
                    <TableCell>{product.Quantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        {rawMaterials.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold">Raw Materials</h3>
            <Table hoverable>
              <TableHead>
                
                  <TableHeadCell>Raw Material</TableHeadCell>
                  <TableHeadCell>Quantity</TableHeadCell>
                  <TableHeadCell>Batch ID</TableHeadCell>
                
              </TableHead>
              <TableBody>
                {rawMaterials.map((rawMaterial, index) => (
                  <TableRow key={index}>
                    <TableCell>{rawMaterial.RawMaterial}</TableCell>
                    <TableCell>{rawMaterial.Quantity}</TableCell>
                    <TableCell>{rawMaterial.BatchID}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {rawMaterials[0].CustomProductName && (
              <div className="mt-4">
                <p><strong>Custom Product Name:</strong> {rawMaterials[0].CustomProductName}</p>
                {rawMaterials[0].ImagePath && (
                  <img src={`http://localhost:3001/${rawMaterials[0].ImagePath}`} alt="Custom Product" className="mt-2"/>
                )}
              </div>
            )}
          </div>
        )}
        {productBatchUsage.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold">Batch Usage</h3>
            <Table hoverable>
              <TableHead>
                
                  <TableHeadCell>Batch ID</TableHeadCell>
                  <TableHeadCell>Raw Material ID</TableHeadCell>
                  <TableHeadCell>Quantity Used</TableHeadCell>
                
              </TableHead>
              <TableBody>
                {productBatchUsage.map((usage, index) => (
                  <TableRow key={index}>
                    <TableCell>{usage.BatchID}</TableCell>
                    <TableCell>{usage.RawMaterialID}</TableCell>
                    <TableCell>{usage.Quantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
      <div className="flex justify-end mt-4">
        <Button onClick={closeModal} color="warning" className="mr-2">Close</Button>
      </div>
    </Modal>
  );
};

export default ViewJobModal;
