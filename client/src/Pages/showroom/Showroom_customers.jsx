import React, { useState, useEffect } from 'react';
import ShowroomNavbar from '../../Components/showroom/showroom_navbar';
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import SearchBar from '../../Components/showroom/SearchBar';
import { Button } from "flowbite-react";
import AddCustomerModal from '../../Components/customermodal/addcustomermodal';
import EditCustomerModal from '../../Components/customermodal/editcustomermodal';
import { HiPlus } from "react-icons/hi";
import axios from 'axios';

const Showroom_customers = () => {
  const [AddCustomerModalIsOpen, setAddCustomerModalIsOpen] = useState(false);
  const [EditCustomerModalIsOpen, setEditCustomerModalIsOpen] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

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
                <TableRow key={customer.CustomerID} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {customer.CustomerName}
                  </TableCell>
                  <TableCell>{customer.Email}</TableCell>
                  <TableCell>{customer.ContactNum}</TableCell>
                  <TableCell>{customer.Address}</TableCell>
                  <TableCell>
                    <a href="#" className="font-medium text-cyan-600 hover:underline dark:text-cyan-500" onClick={() => openEditCustomerModal(customer)}>
                      Edit
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
