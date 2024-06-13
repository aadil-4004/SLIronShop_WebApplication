import React, { useState, useEffect } from 'react';
import ShowroomNavbar from '../../Components/showroom/showroom_navbar';
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Button } from "flowbite-react";
import SearchBar from '../../Components/showroom/SearchBar';
import AddCustomerModal from '../../Components/customermodal/addcustomermodal';
import EditCustomerModal from '../../Components/customermodal/editcustomermodal';
import { HiPlus } from "react-icons/hi";
import axios from 'axios';

const Showroom_customers = () => {
  const [AddCustomerModalIsOpen, setAddCustomerModalIsOpen] = useState(false);
  const [EditCustomerModalIsOpen, setEditCustomerModalIsOpen] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedCustomerID, setSelectedCustomerID] = useState(null);
  const [jobDetails, setJobDetails] = useState({});

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = () => {
    axios.get('http://localhost:3001/api/customers')
      .then(response => {
        setCustomers(response.data);
      })
      .catch(error => {
        console.error('Error fetching customer data:', error);
      });
  };

  const fetchJobDetails = (customerId) => {
    axios.get(`http://localhost:3001/api/customers/${customerId}/jobs`)
      .then(response => {
        setJobDetails((prevState) => ({
          ...prevState,
          [customerId]: response.data,
        }));
      })
      .catch(error => {
        console.error('Error fetching job details:', error);
      });
  };

  const openAddCustomerModal = () => {
    setAddCustomerModalIsOpen(true);
  };

  const closeAddCustomerModal = () => {
    setAddCustomerModalIsOpen(false);
  };

  const openEditCustomerModal = (customer) => {
    setSelectedCustomer(customer);
    setEditCustomerModalIsOpen(true);
  };

  const closeEditCustomerModal = () => {
    setEditCustomerModalIsOpen(false);
    setSelectedCustomer(null);
  };

  const handleRowClick = (customer) => {
    if (selectedCustomerID === customer.CustomerID) {
      setSelectedCustomerID(null);
    } else {
      setSelectedCustomerID(customer.CustomerID);
      fetchJobDetails(customer.CustomerID);
    }
  };

  return (
    <div className="flex bg-[#F7F7F7] ">
      <div className='w-20 h-screen '>
        <ShowroomNavbar activeItem={"customers"} />
      </div>
      <div className="py-10 w-full">
        <div className="px-10 pb-5">
          <h2 className="text-4xl font-semibold mb-3">Customers</h2>
          <SearchBar />
          <div className="flex">
            <div className="ml-auto">
              <Button onClick={openAddCustomerModal}>
                Add
                <HiPlus className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto px-10">
          <div className="table-container" style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 250px)' }}>
            <Table hoverable>
              <TableHead>
                <TableHeadCell>Customer Name</TableHeadCell>
                <TableHeadCell>Email</TableHeadCell>
                <TableHeadCell>Contact Number</TableHeadCell>
                <TableHeadCell>Address</TableHeadCell>
                <TableHeadCell>
                  <span className="sr-only">Edit</span>
                </TableHeadCell>
              </TableHead>
              <TableBody className="divide-y">
                {customers.map(customer => (
                  <React.Fragment key={customer.CustomerID}>
                    <TableRow
                      className="bg-white dark:border-gray-700 dark:bg-gray-800 cursor-pointer"
                      onClick={() => handleRowClick(customer)}
                    >
                      <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {customer.CustomerName}
                      </TableCell>
                      <TableCell>{customer.Email}</TableCell>
                      <TableCell>{customer.ContactNum}</TableCell>
                      <TableCell>{customer.Address}</TableCell>
                      <TableCell>
                        <a href="#" className="font-medium text-cyan-600 hover:underline dark:text-cyan-500" onClick={(e) => { e.stopPropagation(); openEditCustomerModal(customer); }}>
                          Edit
                        </a>
                      </TableCell>
                    </TableRow>
                    {selectedCustomerID === customer.CustomerID && jobDetails[customer.CustomerID] && (
                      <TableRow className="bg-gray-100 dark:bg-gray-700">
                        <TableCell colSpan="5">
                          <div className="overflow-x-auto">
                            <Table className="min-w-full divide-y divide-gray-200">
                              <TableHead>
                                <TableHeadCell>Job ID</TableHeadCell>
                                <TableHeadCell>Due Date</TableHeadCell>
                                <TableHeadCell>Status</TableHeadCell>
                                <TableHeadCell>Note</TableHeadCell>
                                <TableHeadCell>Employee Name</TableHeadCell>
                              </TableHead>
                              <TableBody className="bg-white divide-y divide-gray-200">
                                {jobDetails[customer.CustomerID].map((job, index) => (
                                  <TableRow key={index}>
                                    <TableCell>{job.JobID}</TableCell>
                                    <TableCell>{new Date(job.DueDate).toLocaleDateString()}</TableCell>
                                    <TableCell>{job.Status}</TableCell>
                                    <TableCell>{job.Note}</TableCell>
                                    <TableCell>{job.EmployeeName}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        <AddCustomerModal isOpen={AddCustomerModalIsOpen} closeModal={closeAddCustomerModal} fetchCustomers={fetchCustomers} />
        {selectedCustomer &&
          <EditCustomerModal isOpen={EditCustomerModalIsOpen} closeModal={closeEditCustomerModal} fetchCustomers={fetchCustomers} customer={selectedCustomer} />
        }
      </div>
    </div>
  );
};

export default Showroom_customers;
