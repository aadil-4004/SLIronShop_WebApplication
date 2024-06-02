import React, { useState, useEffect } from 'react';
import ShowroomNavbar from '../../Components/showroom/showroom_navbar';
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import SearchBar from '../../Components/showroom/SearchBar';
import { Button } from "flowbite-react";
import AddSupplierModal from '../../Components/suppliermodal/addsuppliermodal';
import EditSupplierModal from '../../Components/suppliermodal/editsuppliermodal';
import { HiPlus } from "react-icons/hi";
import axios from 'axios';

const Showroom_suppliers = () => {
  const [AddSupplierModalIsOpen, setAddSupplierModalIsOpen] = useState(false);
  const [EditSupplierModalIsOpen, setEditSupplierModalIsOpen] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = () => {
    axios.get('http://localhost:3001/api/suppliers')
      .then(response => {
        setSuppliers(response.data);
      })
      .catch(error => {
        console.error('Error fetching supplier data:', error);
      });
  };

  const openAddSupplierModal = () => {
    setAddSupplierModalIsOpen(true);
  };

  const closeAddSupplierModal = () => {
    setAddSupplierModalIsOpen(false);
  };

  const openEditSupplierModal = (supplier) => {
    setSelectedSupplier(supplier);
    setEditSupplierModalIsOpen(true);
  };

  const closeEditSupplierModal = () => {
    setEditSupplierModalIsOpen(false);
    setSelectedSupplier(null);
  };

  return (
    <div className="flex bg-[#F7F7F7]">
      <div className='w-20 h-screen'>
        <ShowroomNavbar activeItem={"suppliers"} />
      </div>
      <div className="py-10 w-full">
        <div className="px-10 pb-5">
          <h2 className="text-4xl font-semibold mb-3">Suppliers</h2>
          <SearchBar />
          <div className="flex">
            <div className="ml-auto">
              <Button onClick={openAddSupplierModal}>
                Add
                <HiPlus className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto px-10">
          <Table hoverable>
            <TableHead>
              <TableHeadCell>Supplier Name</TableHeadCell>
              <TableHeadCell>Raw Material Type</TableHeadCell>
              <TableHeadCell>Email</TableHeadCell>
              <TableHeadCell>Contact Number</TableHeadCell>
              <TableHeadCell>
                <span className="sr-only">Edit</span>
              </TableHeadCell>
            </TableHead>
            <TableBody className="divide-y">
              {suppliers.map(supplier => (
                <TableRow key={supplier.SupplierID} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {supplier.SupplierName}
                  </TableCell>
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {supplier.RawType}
                  </TableCell>
                  <TableCell>{supplier.Email}</TableCell>
                  <TableCell>{supplier.ContactNum}</TableCell>
                  <TableCell>
                    <a href="#" className="font-medium text-cyan-600 hover:underline dark:text-cyan-500" onClick={() => openEditSupplierModal(supplier)}>
                      Edit
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <AddSupplierModal isOpen={AddSupplierModalIsOpen} closeModal={closeAddSupplierModal} fetchSuppliers={fetchSuppliers} />
        {selectedSupplier && 
          <EditSupplierModal isOpen={EditSupplierModalIsOpen} closeModal={closeEditSupplierModal} fetchSuppliers={fetchSuppliers} supplier={selectedSupplier} />
        }
      </div>
    </div>
  );
};

export default Showroom_suppliers;
