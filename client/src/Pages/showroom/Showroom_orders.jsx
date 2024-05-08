import React, { useState } from 'react';
import ShowroomNavbar from '../../Components/showroom/showroom_navbar';
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import SearchBar from '../../Components/showroom/SearchBar';
import { Button } from "flowbite-react";
import AddOrderModal from '../../Components/addordermodal';
import { HiExclamation, HiCheck, HiPlus } from "react-icons/hi";

const Showroom_orders = () => {
  const [AddOrderModalIsOpen, setAddOrderModalIsOpen] = useState(false);

  const openAddOrderModal = () => {
    setAddOrderModalIsOpen(true);
  };

  const closeAddOrderModal = () => {
    setAddOrderModalIsOpen(false);
  };

  return (
    <div className="flex bg-[#F7F7F7] "> 
      <div className='w-20 h-screen '>
        <ShowroomNavbar activeItem={"orders"}/>
      </div>
      <div className="py-10 w-full">
        <div className="px-10 pb-5">
          <h2 className="text-4xl font-semibold mb-3">Orders</h2>
          <SearchBar/>
          <div className="flex">
            <Button color="green" className='mr-2'>
              <HiCheck className="mr-2 h-5 w-5 bg-" />
              Completed
            </Button>
            <Button color="warning" className='mr-2'>
              Pending
              <HiExclamation className="ml-2 h-5 w-5" />
            </Button>
            <div className="ml-auto"> {/* Added ml-auto class to align right */}
              <Button onClick={openAddOrderModal}>
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
              <TableHeadCell>OrderID</TableHeadCell>
              <TableHeadCell>Status</TableHeadCell>
              <TableHeadCell>Due Date</TableHeadCell>
              <TableHeadCell>Contact Number</TableHeadCell>
              <TableHeadCell>Product</TableHeadCell>
              <TableHeadCell>Quantity</TableHeadCell>
              <TableHeadCell>Total</TableHeadCell>
              <TableHeadCell>
                <span className="sr-only">Edit</span>
              </TableHeadCell>
            </TableHead>
            <TableBody className="divide-y">
              <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {'John Doe'}
                </TableCell>
                <TableCell>12345</TableCell>
                <TableCell>Shipped</TableCell>
                <TableCell>2024-05-05</TableCell>
                <TableCell>123-456-7890</TableCell>
                <TableCell>Laptop</TableCell>
                <TableCell>1</TableCell>
                <TableCell>$2999</TableCell>
                <TableCell>
                  <a href="#" className="font-medium text-cyan-600 hover:underline dark:text-cyan-500">
                    Edit
                  </a>
                </TableCell>
              </TableRow>
              <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {'Jane Smith'}
                </TableCell>
                <TableCell>12346</TableCell>
                <TableCell>Processing</TableCell>
                <TableCell>2024-05-10</TableCell>
                <TableCell>987-654-3210</TableCell>
                <TableCell>Desktop</TableCell>
                <TableCell>2</TableCell>
                <TableCell>$5998</TableCell>
                <TableCell>
                  <a href="#" className="font-medium text-cyan-600 hover:underline dark:text-cyan-500">
                    Edit
                  </a>
                </TableCell>
              </TableRow>
              <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{'James Bond'}</TableCell>
                <TableCell>12347</TableCell>
                <TableCell>Cancelled</TableCell>
                <TableCell>2024-05-15</TableCell>
                <TableCell>345-678-9012</TableCell>
                <TableCell>Monitor</TableCell>
                <TableCell>3</TableCell>
                <TableCell>$1500</TableCell>
                <TableCell>
                  <a href="#" className="font-medium text-cyan-600 hover:underline dark:text-cyan-500">
                    Edit
                  </a>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <AddOrderModal isOpen={AddOrderModalIsOpen} closeModal={closeAddOrderModal} />
      </div>
    </div>
  );
};

export default Showroom_orders;
