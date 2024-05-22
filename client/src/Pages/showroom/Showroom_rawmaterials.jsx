import React, { useState, useEffect } from 'react';
import ShowroomNavbar from '../../Components/showroom/showroom_navbar';
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import SearchBar from '../../Components/showroom/SearchBar';
import { Button } from "flowbite-react";
import AddRawMaterialModal from '../../Components/rawmaterialmodal/addrawmaterialmodal';
import EditRawMaterialModal from '../../Components/rawmaterialmodal/editrawmaterialmodal';
import { HiPlus } from "react-icons/hi";
import axios from 'axios';

const RawMaterial = () => {
  const [AddRawMaterialModalIsOpen, setAddRawMaterialModalIsOpen] = useState(false);
  const [EditRawMaterialModalIsOpen, setEditRawMaterialModalIsOpen] = useState(false);
  const [rawMaterials, setRawMaterials] = useState([]);
  const [selectedRawMaterial, setSelectedRawMaterial] = useState(null);

  useEffect(() => {
    fetchRawMaterials();
  }, []);

  const fetchRawMaterials = () => {
    axios.get('http://localhost:3001/api/rawmaterial')
      .then(response => {
        setRawMaterials(response.data);
      })
      .catch(error => {
        console.error('Error fetching raw material data:', error);
      });
  };

  const openAddRawMaterialModal = () => {
    setAddRawMaterialModalIsOpen(true);
  };

  const closeAddRawMaterialModal = () => {
    setAddRawMaterialModalIsOpen(false);
  };

  const openEditRawMaterialModal = (rawMaterial) => {
    setSelectedRawMaterial(rawMaterial);
    setEditRawMaterialModalIsOpen(true);
  };

  const closeEditRawMaterialModal = () => {
    setEditRawMaterialModalIsOpen(false);
    setSelectedRawMaterial(null);
  };

  return (
    <div className="flex bg-[#F7F7F7]">
      <div className='w-20 h-screen'>
        <ShowroomNavbar activeItem={"rawmaterial"} />
      </div>
      <div className="py-10 w-full">
        <div className="px-10 pb-5">
          <h2 className="text-4xl font-semibold mb-3">Raw Material</h2>
          <SearchBar />
          <div className="flex">
            <div className="ml-auto">
              <Button onClick={openAddRawMaterialModal}>
                Add
                <HiPlus className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto px-10">
          <Table hoverable>
            <TableHead>
              <TableHeadCell>Raw Material</TableHeadCell>
              <TableHeadCell>Last Update</TableHeadCell>
              <TableHeadCell>Current Stock</TableHeadCell>
              <TableHeadCell>Unit Price</TableHeadCell>
              <TableHeadCell>
                <span className="sr-only">Edit</span>
              </TableHeadCell>
            </TableHead>
            <TableBody className="divide-y">
              {rawMaterials.map(rawMaterial => (
                <TableRow key={rawMaterial.RawMaterialID} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {rawMaterial.RawMaterial}
                  </TableCell>
                  <TableCell>{new Date(rawMaterial.LastUpdate).toLocaleDateString()}</TableCell>
                  <TableCell>{rawMaterial.CurrentStock}</TableCell>
                  <TableCell>{rawMaterial.UnitPrice}</TableCell> {/* Display Unit Price */}
                  <TableCell>
                    <a href="#" className="font-medium text-cyan-600 hover:underline dark:text-cyan-500" onClick={() => openEditRawMaterialModal(rawMaterial)}>
                      Edit
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <AddRawMaterialModal isOpen={AddRawMaterialModalIsOpen} closeModal={closeAddRawMaterialModal} fetchRawMaterials={fetchRawMaterials} />
        {selectedRawMaterial &&
          <EditRawMaterialModal isOpen={EditRawMaterialModalIsOpen} closeModal={closeEditRawMaterialModal} fetchRawMaterials={fetchRawMaterials} rawMaterial={selectedRawMaterial} />
        }
      </div>
    </div>
  );
};

export default RawMaterial;
