import React, { useState, useEffect } from 'react';
import ShowroomNavbar from '../../Components/showroom/showroom_navbar';
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Button } from "flowbite-react";
import SearchBar from '../../Components/showroom/SearchBar';
import AddRawMaterialModal from '../../Components/rawmaterialmodal/addrawmaterialmodal';
import EditRawMaterialModal from '../../Components/rawmaterialmodal/editrawmaterialmodal';
import { HiPlus } from "react-icons/hi";
import axios from 'axios';

const RawMaterial = () => {
  const [AddRawMaterialModalIsOpen, setAddRawMaterialModalIsOpen] = useState(false);
  const [EditRawMaterialModalIsOpen, setEditRawMaterialModalIsOpen] = useState(false);
  const [rawMaterials, setRawMaterials] = useState([]);
  const [selectedRawMaterial, setSelectedRawMaterial] = useState(null);
  const [batchDetails, setBatchDetails] = useState({});
  const [selectedRawMaterialID, setSelectedRawMaterialID] = useState(null);

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

  const fetchBatchDetails = (rawMaterialId) => {
    axios.get(`http://localhost:3001/api/rawmaterial/${rawMaterialId}/batches`)
      .then(response => {
        setBatchDetails((prevState) => ({
          ...prevState,
          [rawMaterialId]: response.data,
        }));
      })
      .catch(error => {
        console.error('Error fetching batch details:', error);
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

  const handleRowClick = (rawMaterial) => {
    if (selectedRawMaterialID === rawMaterial.RawMaterialID) {
      setSelectedRawMaterialID(null);
    } else {
      setSelectedRawMaterialID(rawMaterial.RawMaterialID);
      fetchBatchDetails(rawMaterial.RawMaterialID);
    }
  };

  const getStatus = (currentStock) => {
    if (currentStock === 0) {
      return <span style={{ color: 'red' }}>Out of Stock</span>;
    } else if (currentStock < 10) {
      return <span style={{ color: 'orange' }}>Low Stock</span>;
    } else {
      return <span style={{ color: 'green' }}>In Stock</span>;
    }
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
                Add Raw Materials
                <HiPlus className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto px-10">
          <div className="table-container" style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 250px)' }}>
            <Table hoverable>
              <TableHead>
                
                  <TableHeadCell>Raw Material</TableHeadCell>
                  <TableHeadCell>Last Update</TableHeadCell>
                  <TableHeadCell>Current Stock</TableHeadCell>
                  <TableHeadCell>Status</TableHeadCell>
                  <TableHeadCell>
                    <span className="sr-only">Edit</span>
                  </TableHeadCell>
                
              </TableHead>
              <TableBody className="divide-y">
                {rawMaterials.map(rawMaterial => (
                  <React.Fragment key={rawMaterial.RawMaterialID}>
                    <TableRow
                      className="bg-white dark:border-gray-700 dark:bg-gray-800 cursor-pointer"
                      onClick={() => handleRowClick(rawMaterial)}
                    >
                      <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {rawMaterial.RawMaterial}
                      </TableCell>
                      <TableCell>{new Date(rawMaterial.LastUpdate).toDateString()}</TableCell>
                      <TableCell>{rawMaterial.CurrentStock}</TableCell>
                      <TableCell>{getStatus(rawMaterial.CurrentStock)}</TableCell>
                      <TableCell>
                        <a href="#" className="font-medium text-cyan-600 hover:underline dark:text-cyan-500" onClick={(e) => { e.stopPropagation(); openEditRawMaterialModal(rawMaterial); }}>
                          Add Stock
                        </a>
                      </TableCell>
                    </TableRow>
                    {selectedRawMaterialID === rawMaterial.RawMaterialID && batchDetails[rawMaterial.RawMaterialID] && (
                      <TableRow className="bg-gray-100 dark:bg-gray-700">
                        <TableCell colSpan="5">
                          <div className="overflow-x-auto">
                            <Table className="min-w-full divide-y divide-gray-200">
                              <TableHead>
                                
                                  <TableHeadCell>Batch ID</TableHeadCell>
                                  <TableHeadCell>Supplier Name</TableHeadCell>
                                  <TableHeadCell>Quantity</TableHeadCell>
                                  <TableHeadCell>Unit Price</TableHeadCell>
                                
                              </TableHead>
                              <TableBody className="bg-white divide-y divide-gray-200">
                                {batchDetails[rawMaterial.RawMaterialID].map((batch, index) => (
                                  <TableRow key={index}>
                                    <TableCell>{batch.BatchID}</TableCell>
                                    <TableCell>{batch.SupplierName}</TableCell>
                                    <TableCell>{batch.Quantity}</TableCell>
                                    <TableCell>{batch.UnitPrice}</TableCell>
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
        <AddRawMaterialModal isOpen={AddRawMaterialModalIsOpen} closeModal={closeAddRawMaterialModal} fetchRawMaterials={fetchRawMaterials} />
        {selectedRawMaterial &&
          <EditRawMaterialModal isOpen={EditRawMaterialModalIsOpen} closeModal={closeEditRawMaterialModal} fetchRawMaterials={fetchRawMaterials} rawMaterial={selectedRawMaterial} />
        }
      </div>
    </div>
  );
};

export default RawMaterial;
