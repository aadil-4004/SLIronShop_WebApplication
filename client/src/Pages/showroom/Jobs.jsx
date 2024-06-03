import React, { useState } from 'react';
import ShowroomNavbar from '../../Components/showroom/showroom_navbar';
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import SearchBar from '../../Components/showroom/SearchBar';
import { Button } from "flowbite-react";
import AddJobModal from '../../Components/jobmodal/addjobmodal';
import { HiExclamation, HiCheck, HiPlus } from "react-icons/hi";
import axios from 'axios';

const Jobs = () => {
    const [AddJobModalIsOpen, setAddJobModalIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
  
    const openAddJobModal = () => setAddJobModalIsOpen(true);
    const closeAddJobModal = () => setAddJobModalIsOpen(false);
  
    // Add a function to fetch jobs from the backend
    const fetchJobs = async () => {
      try {
        // Replace with your backend API call
        const response = await axios.get('http://localhost:3001/api/jobs');
        // Update state with fetched jobs
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

  return (
    <div className="flex bg-[#F7F7F7]"> 
      <div className='w-20 h-screen'>
        <ShowroomNavbar activeItem={"jobs"}/>
      </div>
      <div className="py-10 w-full">
        <div className="px-10 pb-5">
          <h2 className="text-4xl font-semibold mb-3">Jobs</h2>
          <SearchBar/>
          <div className="flex">
            <Button color="green" className='mr-2'>
              <HiCheck className="mr-2 h-5 w-5" />
              Completed
            </Button>
            <Button color="warning" className='mr-2'>
              Pending
              <HiExclamation className="ml-2 h-5 w-5" />
            </Button>
            <div className="ml-auto">
              <Button onClick={openAddJobModal}>
                Add
                <HiPlus className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto px-10">
          <Table hoverable>
            <TableHead>
              <TableHeadCell>Job ID</TableHeadCell>
              <TableHeadCell>Created Date</TableHeadCell>
              <TableHeadCell>Due Date</TableHeadCell>
              <TableHeadCell>Status</TableHeadCell>
              <TableHeadCell>Customer Name</TableHeadCell>
              <TableHeadCell>Note</TableHeadCell>
              <TableHeadCell>
                <span className="sr-only">Edit</span>
              </TableHeadCell>
            </TableHead>
            <TableBody className="divide-y">
              <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {'1'}
                </TableCell>
                <TableCell>2024-06-01</TableCell>
                <TableCell>2024-06-10</TableCell>
                <TableCell>In Progress</TableCell>
                <TableCell>John Doe</TableCell>
                <TableCell>Fix the AC</TableCell>
                <TableCell>
                  <a href="#" className="font-medium text-cyan-600 hover:underline dark:text-cyan-500">
                    Edit
                  </a>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <AddJobModal isOpen={AddJobModalIsOpen} closeModal={closeAddJobModal} fetchJobs={fetchJobs} />
      </div>
    </div>
  );
};

export default Jobs;
