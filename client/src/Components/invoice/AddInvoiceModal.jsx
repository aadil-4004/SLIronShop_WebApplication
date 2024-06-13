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
    width: '800px',
    maxHeight: '80%',
    overflowY: 'auto',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
};

const AddInvoiceModal = ({ isOpen, closeModal, fetchInvoices }) => {
  const [formData, setFormData] = useState({
    jobID: '',
    status: 'Pending',
    discount: 0,
    advancePayment: 0,
  });
  const [jobs, setJobs] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [jobDetails, setJobDetails] = useState(null);
  const [totalMRP, setTotalMRP] = useState(0);
  const [totalBillAmount, setTotalBillAmount] = useState(0);
  const [jobSearch, setJobSearch] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchJobs();
    }
  }, [isOpen]);

  const fetchJobs = () => {
    axios.get('http://localhost:3001/api/jobs')
      .then(response => setJobs(response.data))
      .catch(error => console.error('Error fetching jobs:', error));
  };

  const handleSearchJob = () => {
    const job = jobs.find(job => job.JobID === parseInt(jobSearch));
    if (job) {
      setSelectedJob(job);
      setFormData({ ...formData, jobID: job.JobID });
      fetchJobDetails(job.JobID);
    } else {
      setSelectedJob(null);
      setJobDetails(null);
    }
  };

  const fetchJobDetails = (jobID) => {
    axios.get(`http://localhost:3001/api/invoices/jobdetails/${jobID}`)
      .then(response => {
        const { products, customProduct, batches } = response.data;
        const uniqueProducts = Array.from(new Set(products.map(p => p.ProductName)))
          .map(name => products.find(p => p.ProductName === name));

        setJobDetails({
          products: uniqueProducts,
          customProduct: customProduct || null,
          batches: batches,
        });

        calculateTotalMRP(uniqueProducts, customProduct);
      })
      .catch(error => console.error('Error fetching job details:', error));
  };

  const calculateTotalMRP = (products, customProduct) => {
    let total = products.reduce((sum, product) => sum + (product.Quantity * product.MRP), 0);
    if (customProduct) {
      total += customProduct.MRP;
    }
    setTotalMRP(total);
    setTotalBillAmount(total - (total * formData.discount) / 100);
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

    calculateTotalMRP(updatedProducts, jobDetails.customProduct);
  };

  const handleWorkmanChargeChange = (index, value) => {
    const updatedProducts = jobDetails.products.map((product, i) => {
      if (i === index) {
        return { ...product, WorkmanCharge: value };
      }
      return product;
    });

    setJobDetails({
      ...jobDetails,
      products: updatedProducts,
    });
  };

  const handleCustomMRPChange = (value) => {
    const updatedCustomProduct = {
      ...jobDetails.customProduct,
      MRP: value,
    };

    setJobDetails({
      ...jobDetails,
      customProduct: updatedCustomProduct,
    });

    calculateTotalMRP(jobDetails.products, updatedCustomProduct);
  };

  const handleCustomWorkmanChargeChange = (value) => {
    const updatedCustomProduct = {
      ...jobDetails.customProduct,
      WorkmanCharge: value,
    };

    setJobDetails({
      ...jobDetails,
      customProduct: updatedCustomProduct,
    });
  };

  const handleDiscountChange = (e) => {
    const discount = parseFloat(e.target.value);
    setFormData({
      ...formData,
      discount: discount,
    });
    setTotalBillAmount(totalMRP - (totalMRP * discount) / 100);
  };

  const handleAdvancePaymentChange = (e) => {
    const advancePayment = parseFloat(e.target.value);
    setFormData({
      ...formData,
      advancePayment: advancePayment,
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
      const totalAmount = jobDetails.products.reduce((sum, product) => sum + product.MRP * product.Quantity, 0) + (jobDetails.customProduct ? jobDetails.customProduct.MRP : 0);
      const discountAmount = formData.discount ? (totalAmount * formData.discount) / 100 : 0;
      const totalBillAmount = totalAmount - discountAmount;
      const balance = totalBillAmount - formData.advancePayment;

      const lineItems = [
        ...jobDetails.products.map(product => ({
          description: product.ProductName,
          quantity: product.Quantity,
          price: parseFloat(product.MRP),
          totalCost: (parseFloat(product.Quantity) * parseFloat(product.Cost)) + parseFloat(product.WorkmanCharge),
          grossProfit: parseFloat(product.MRP) - ((parseFloat(product.Quantity) * parseFloat(product.Cost)) + parseFloat(product.WorkmanCharge)),
        })),
        ...(jobDetails.customProduct ? [{
          description: jobDetails.customProduct.CustomProductName,
          quantity: 1,
          price: parseFloat(jobDetails.customProduct.MRP),
          totalCost: parseFloat(jobDetails.customProduct.Cost) + parseFloat(jobDetails.customProduct.WorkmanCharge),
          grossProfit: parseFloat(jobDetails.customProduct.MRP) - (parseFloat(jobDetails.customProduct.Cost) + parseFloat(jobDetails.customProduct.WorkmanCharge)),
        }] : [])
      ];

      const invoiceData = {
        ...formData,
        date: new Date().toISOString().split('T')[0],
        totalAmount,
        discountAmount,
        totalBillAmount,
        balance,
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
          <div className="flex justify-between">
            <div className="w-full">
              <Label htmlFor="jobSearch" value="Search Job by Job ID" />
              <div className="flex">
                <TextInput
                  id="jobSearch"
                  type="text"
                  placeholder="Enter Job ID"
                  value={jobSearch}
                  onChange={(e) => setJobSearch(e.target.value)}
                />
                <Button onClick={handleSearchJob} className="ml-2">Search</Button>
              </div>
              {selectedJob && (
                <div className="mt-3 flex justify-between">
                  <div>
                    <p><strong>Customer Name:</strong> {selectedJob.CustomerName}</p>
                  </div>
                  <div className="text-right">
                    <p><strong>Job ID:</strong> {selectedJob.JobID}</p>
                    <p><strong>Due Date:</strong> {new Date(selectedJob.DueDate).toLocaleDateString()}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div>
            {jobDetails && (
              <>
                <h3 className="text-lg font-semibold">Products</h3>
                {jobDetails.products && jobDetails.products.length > 0 && (
                  <Table hoverable className="mb-4">
                    <TableHead>
                      <TableHeadCell>PRODUCT NAME</TableHeadCell>
                      <TableHeadCell>QUANTITY</TableHeadCell>
                      <TableHeadCell>COST PER UNIT</TableHeadCell>
                      <TableHeadCell>WORKMAN CHARGE</TableHeadCell>
                      <TableHeadCell>TOTAL COST</TableHeadCell>
                      <TableHeadCell>MRP</TableHeadCell>
                    </TableHead>
                    <TableBody>
                      {jobDetails.products.map((product, index) => (
                        <TableRow key={index}>
                          <TableCell>{product.ProductName}</TableCell>
                          <TableCell>{product.Quantity}</TableCell>
                          <TableCell>{product.Cost}</TableCell>
                          <TableCell>
                            <TextInput
                              type="number"
                              value={product.WorkmanCharge}
                              onChange={(e) => handleWorkmanChargeChange(index, e.target.value)}
                            />
                          </TableCell>
                          <TableCell>{product.Cost * product.Quantity + parseFloat(product.WorkmanCharge)}</TableCell>
                          <TableCell>
                            <TextInput
                              type="number"
                              value={product.MRP}
                              onChange={(e) => handleProductMRPChange(index, e.target.value)}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
                {jobDetails.customProduct && (
                  <>
                    <h3 className="text-lg font-semibold">Custom Product</h3>
                    <Table hoverable className="mb-4">
                      <TableHead>
                        <TableHeadCell>PRODUCT NAME</TableHeadCell>
                        <TableHeadCell>TOTAL COST</TableHeadCell>
                        <TableHeadCell>WORKMAN CHARGE</TableHeadCell>
                        <TableHeadCell>MRP</TableHeadCell>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>{jobDetails.customProduct.CustomProductName}</TableCell>
                          <TableCell>{jobDetails.customProduct.Cost}</TableCell>
                          <TableCell>
                            <TextInput
                              type="number"
                              value={jobDetails.customProduct.WorkmanCharge}
                              onChange={(e) => handleCustomWorkmanChargeChange(e.target.value)}
                            />
                          </TableCell>
                          <TableCell>
                            <TextInput
                              type="number"
                              value={jobDetails.customProduct.MRP}
                              onChange={(e) => handleCustomMRPChange(e.target.value)}
                            />
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </>
                )}
              </>
            )}
          </div>
          <div className="flex justify-between">
            <div className="w-1/2 pr-2">
              <Label htmlFor="status" value="Status" />
              <Select id="status" name="status" value={formData.status} onChange={handleChange} required>
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
              </Select>
            </div>
            <div className="w-1/2 pl-2">
              <Label htmlFor="amount" value="Amount" />
              <TextInput
                id="amount"
                type="number"
                value={totalMRP}
                readOnly
              />
            </div>
          </div>
          <div className="flex justify-between mt-3">
            <div className="w-1/2 pr-2">
              <Label htmlFor="discount" value="Discount %" />
              <TextInput
                id="discount"
                type="number"
                value={formData.discount}
                onChange={handleDiscountChange}
                required
              />
            </div>
            <div className="w-1/2 pl-2">
              <Label htmlFor="totalBillAmount" value="Total Bill Amount" />
              <TextInput
                id="totalBillAmount"
                type="number"
                value={totalBillAmount}
                readOnly
              />
            </div>
          </div>
          <div className="flex justify-between mt-3">
            <div className="w-1/2 pr-2">
              <Label htmlFor="advancePayment" value="Advance Payment" />
              <TextInput
                id="advancePayment"
                type="number"
                value={formData.advancePayment}
                onChange={handleAdvancePaymentChange}
                required
              />
            </div>
            <div className="w-1/2 pl-2">
              <Label htmlFor="balance" value="Balance" />
              <TextInput
                id="balance"
                type="number"
                value={totalBillAmount - formData.advancePayment}
                readOnly
              />
            </div>
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
