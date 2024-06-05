import React, { useState, useEffect } from 'react';
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
  const [jobs, setJobs] = useState([]);

  const openAddJobModal = () => setAddJobModalIsOpen(true);
  const closeAddJobModal = () => setAddJobModalIsOpen(false);

  // Fetch jobs from the backend
  const fetchJobs = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/jobs');
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="flex bg-[#F7F7F7]">
      <div className='w-20 h-screen'>
        <ShowroomNavbar activeItem={"jobs"} />
      </div>
      <div className="py-10 w-full">
        <div className="px-10 pb-5">
          <h2 className="text-4xl font-semibold mb-3">Jobs</h2>
          <SearchBar value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
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
                <TableHeadCell>Customer Name</TableHeadCell>
                <TableHeadCell>Status</TableHeadCell>
                <TableHeadCell>Due Date</TableHeadCell>
                <TableHeadCell>Note</TableHeadCell>
                <TableHeadCell>Employee Name</TableHeadCell>
                <TableHeadCell>
                  <span className="sr-only">Edit</span>
                </TableHeadCell>
            </TableHead>
            <TableBody className="divide-y">
              {jobs.map((job) => (
                <TableRow key={job.JobID} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {job.JobID}
                  </TableCell>
                  <TableCell>{job.CustomerName}</TableCell>
                  <TableCell>{job.Status}</TableCell>
                  <TableCell>{new Date(job.DueDate).toLocaleDateString()}</TableCell>
                  <TableCell>{job.Note}</TableCell>
                  <TableCell>{job.EmployeeName}</TableCell>
                  <TableCell>
                    <a href="#" className="font-medium text-cyan-600 hover:underline dark:text-cyan-500">
                      Edit
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <AddJobModal isOpen={AddJobModalIsOpen} closeModal={closeAddJobModal} fetchJobs={fetchJobs} />
      </div>
    </div>
  );
};

export default Jobs;
