import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { Button, Label, Select, TextInput, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from 'flowbite-react';
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
    width: '600px',
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
    status: 'Pending',
    customMRP: '',
  });
  const [jobs, setJobs] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [jobDetails, setJobDetails] = useState(null);

  useEffect(() => {
    if (isOpen) {
      axios.get('http://localhost:3001/api/customers')
        .then(response => setCustomers(response.data))
        .catch(error => console.error('Error fetching customers:', error));
    }
  }, [isOpen]);

  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Fetch jobs for the selected customer
    axios.get(`http://localhost:3001/api/invoices/jobs/customer/${value}`)
      .then(response => {
        setJobs(response.data);
      })
      .catch(error => console.error('Error fetching jobs:', error));
  };

  const handleJobChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Fetch job details for the selected job
    axios.get(`http://localhost:3001/api/invoices/jobdetails/${value}`)
      .then(response => {
        setJobDetails(response.data);
      })
      .catch(error => console.error('Error fetching job details:', error));
  };

  const handleProductMRPChange = (index, value) => {
    const updatedProducts = jobDetails.products.map((product, i) => {
      if (i === index) {
        return { ...product, MRP: value };
      }
      return product;
    });

    setJobDetails({
      ...jobDetails,
      products: updatedProducts,
    });
  };

  const handleCustomMRPChange = (value) => {
    setJobDetails({
      ...jobDetails,
      customProduct: {
        ...jobDetails.customProduct,
        MRP: value,
      },
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const invoiceData = {
        ...formData,
        date: new Date().toISOString().split('T')[0],  // Add current timestamp
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
            <Select id="customerID" name="customerID" value={formData.customerID} onChange={handleCustomerChange} required>
              <option value="">Select customer</option>
              {customers.map(customer => (
                <option key={customer.CustomerID} value={customer.CustomerID}>{customer.CustomerName}</option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="jobID" value="Job" />
            <Select id="jobID" name="jobID" value={formData.jobID} onChange={handleJobChange} required>
              <option value="">Select job</option>
              {jobs.map(job => (
                <option key={job.JobID} value={job.JobID}>
                  {job.JobID} - Due Date: {new Date(job.DueDate).toLocaleDateString()}
                </option>
              ))}
            </Select>
          </div>
          <div>
            {jobDetails && (
              <>
                {jobDetails.products && jobDetails.products.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold">Products</h3>
                    {jobDetails.products.map((product, index) => (
                      <div key={index} className="mb-3">
                        <Label value="Product Name" />
                        <p>{product.ProductName}</p>
                        {/* <Label value="Raw Materials" />
                        <Table hoverable>
                          <TableHead>
                            <TableRow>
                              <TableHeadCell>Raw Material</TableHeadCell>
                              <TableHeadCell>Quantity</TableHeadCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {product.rawMaterials.map((rawMaterial, rmIndex) => (
                              <TableRow key={rmIndex}>
                                <TableCell>{rawMaterial.RawMaterialName}</TableCell>
                                <TableCell>{rawMaterial.Quantity}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                        <Label value="Batches Used" />
                        <Table hoverable>
                          <TableHead>
                            <TableRow>
                              <TableHeadCell>Batch ID</TableHeadCell>
                              <TableHeadCell>Quantity Used</TableHeadCell>
                              <TableHeadCell>Unit Price</TableHeadCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {product.batches.map((batch, batchIndex) => (
                              <TableRow key={batchIndex}>
                                <TableCell>{batch.BatchID}</TableCell>
                                <TableCell>{batch.BatchQuantity}</TableCell>
                                <TableCell>{batch.UnitPrice}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table> */}
                        <Label value="Total Cost" />
                        <TextInput
                          type="number"
                          value={product.batches.reduce((total, batch) => total + (batch.BatchQuantity * batch.UnitPrice), 0)}
                          readOnly
                        />
                        <Label htmlFor={`productMRP-${index}`} value="MRP" />
                        <TextInput
                          id={`productMRP-${index}`}
                          type="number"
                          value={product.MRP}
                          onChange={(e) => handleProductMRPChange(index, e.target.value)}
                          required
                        />
                      </div>
                    ))}
                  </div>
                )}
                {jobDetails.customProduct && (
                  <div>
                    <h3 className="text-lg font-semibold">Custom Product</h3>
                    <Label value="Custom Product Name" />
                    <p>{jobDetails.customProduct.CustomProductName}</p>
                    {/* <Label value="Raw Materials" />
                    <Table hoverable>
                      <TableHead>
                        <TableRow>
                          <TableHeadCell>Raw Material</TableHeadCell>
                          <TableHeadCell>Quantity</TableHeadCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {jobDetails.customProduct.rawMaterials.map((rawMaterial, rmIndex) => (
                          <TableRow key={rmIndex}>
                            <TableCell>{rawMaterial.RawMaterialName}</TableCell>
                            <TableCell>{rawMaterial.Quantity}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table> */}
                    <Label value="Batches Used" />
                    {/* <Table hoverable>
                      <TableHead>
                        <TableRow>
                          <TableHeadCell>Batch ID</TableHeadCell>
                          <TableHeadCell>Quantity Used</TableHeadCell>
                          <TableHeadCell>Unit Price</TableHeadCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {jobDetails.customProduct.batches.map((batch, batchIndex) => (
                          <TableRow key={batchIndex}>
                            <TableCell>{batch.BatchID}</TableCell>
                            <TableCell>{batch.BatchQuantity}</TableCell>
                            <TableCell>{batch.UnitPrice}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table> */}
                    <Label value="Total Cost" />
                    <TextInput
                      type="number"
                      value={jobDetails.customProduct.batches.reduce((total, batch) => total + (batch.BatchQuantity * batch.UnitPrice), 0)}
                      readOnly
                    />
                    <Label htmlFor="customMRP" value="MRP" />
                    <TextInput
                      id="customMRP"
                      type="number"
                      value={jobDetails.customProduct.MRP}
                      onChange={(e) => handleCustomMRPChange(e.target.value)}
                      required
                    />
                  </div>
                )}
                {jobDetails.batches && jobDetails.batches.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold">Batches Used</h3>
                    <Table hoverable>
                      <TableHead>
                        
                          <TableHeadCell>Batch ID</TableHeadCell>
                          <TableHeadCell>Raw Material</TableHeadCell>
                          <TableHeadCell>Quantity Used</TableHeadCell>
                          <TableHeadCell>Unit Price</TableHeadCell>
                       
                      </TableHead>
                      <TableBody>
                        {jobDetails.batches.map((batch, index) => (
                          <TableRow key={index}>
                            <TableCell>{batch.BatchID}</TableCell>
                            <TableCell>{batch.RawMaterialName}</TableCell>
                            <TableCell>{batch.BatchQuantity}</TableCell>
                            <TableCell>{batch.UnitPrice}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </>
            )}
          </div>
          <div>
            <Label htmlFor="status" value="Status" />
            <Select id="status" name="status" value={formData.status} onChange={handleChange} required>
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
            </Select>
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
