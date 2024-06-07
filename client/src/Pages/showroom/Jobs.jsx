import React, { useState, useEffect } from 'react';
import ShowroomNavbar from '../../Components/showroom/showroom_navbar';
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Button } from "flowbite-react";
import SearchBar from '../../Components/showroom/SearchBar';
import AddJobModal from '../../Components/jobmodal/addjobmodal';
import EditStatusModal from '../../Components/jobmodal/editstatusmodal';
import ViewJobModal from '../../Components/jobmodal/viewjobmodal'; // Import the new ViewJobModal component
import { HiExclamation, HiCheck, HiPlus, HiPencil, HiEye, HiOutlineClock } from "react-icons/hi";
import axios from 'axios';

const Jobs = () => {
  const [AddJobModalIsOpen, setAddJobModalIsOpen] = useState(false);
  const [EditStatusModalIsOpen, setEditStatusModalIsOpen] = useState(false);
  const [ViewJobModalIsOpen, setViewJobModalIsOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');

  const openAddJobModal = () => setAddJobModalIsOpen(true);
  const closeAddJobModal = () => setAddJobModalIsOpen(false);
  const openEditStatusModal = (job) => {
    setSelectedJob(job);
    setEditStatusModalIsOpen(true);
  };
  const closeEditStatusModal = () => setEditStatusModalIsOpen(false);
  const openViewJobModal = (job) => {
    setSelectedJob(job);
    setViewJobModalIsOpen(true);
  };
  const closeViewJobModal = () => setViewJobModalIsOpen(false);

  // Fetch jobs from the backend
  const fetchJobs = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/jobs');
      setJobs(response.data);
      setFilteredJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleFilterClick = (status) => {
    setSelectedStatus(status);
    if (status) {
      setFilteredJobs(jobs.filter(job => job.Status === status));
    } else {
      setFilteredJobs(jobs);
    }
  };

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
            <Button
              color={selectedStatus === 'Completed' ? 'green' : 'gray'}
              className='mr-2'
              onClick={() => handleFilterClick('Completed')}
            >
              <HiCheck className="mr-2 h-5 w-5" />
              Completed
            </Button>
            <Button
              color={selectedStatus === 'Pending' ? 'warning' : 'gray'}
              className='mr-2'
              onClick={() => handleFilterClick('Pending')}
            >
              <HiExclamation className="ml-2 h-5 w-5" />
              Pending
            </Button>
            <Button
              color={selectedStatus === 'In Progress' ? 'blue' : 'gray'}
              className='mr-2'
              onClick={() => handleFilterClick('In Progress')}
            >
              <HiOutlineClock className="mr-2 h-5 w-5" />
              In Progress
            </Button>
            <Button
              color={selectedStatus === '' ? 'purple' : 'gray'}
              className='mr-2'
              onClick={() => handleFilterClick('')}
            >
              <HiPlus className="ml-2 h-5 w-5" />
              All
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
                <span className="sr-only">Actions</span>
              </TableHeadCell>
            </TableHead>
            <TableBody className="divide-y">
              {filteredJobs.map((job) => (
                <TableRow key={job.JobID} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {job.JobID}
                  </TableCell>
                  <TableCell>{job.CustomerName}</TableCell>
                  <TableCell>{job.Status}</TableCell>
                  <TableCell>{new Date(job.DueDate).toLocaleDateString()}</TableCell>
                  <TableCell>{job.Note}</TableCell>
                  <TableCell>{job.EmployeeName}</TableCell>
                  <TableCell className="flex space-x-2">
                    <Button onClick={() => openViewJobModal(job)} color="green">
                      <HiEye className="h-5 w-5" />
                    </Button>
                    <Button onClick={() => openEditStatusModal(job)} color="blue">
                      <HiPencil className="h-5 w-5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <AddJobModal isOpen={AddJobModalIsOpen} closeModal={closeAddJobModal} fetchJobs={fetchJobs} />
        <EditStatusModal isOpen={EditStatusModalIsOpen} closeModal={closeEditStatusModal} fetchJobs={fetchJobs} job={selectedJob} />
        <ViewJobModal isOpen={ViewJobModalIsOpen} closeModal={closeViewJobModal} job={selectedJob} />
      </div>
    </div>
  );
};

export default Jobs;
