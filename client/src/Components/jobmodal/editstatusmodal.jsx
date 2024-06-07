import React, { useState } from 'react';
import Modal from 'react-modal';
import { Label, Select, Button } from 'flowbite-react';
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
    width: '300px',
    maxHeight: '80%',
    overflowY: 'auto',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
};

const EditStatusModal = ({ isOpen, closeModal, fetchJobs, job }) => {
  const [status, setStatus] = useState(job?.Status || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3001/api/jobs/${job.JobID}/status`, { status });
      fetchJobs();
      closeModal();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={closeModal} style={customStyles}>
      <h2 className='text-2xl text-center'>Edit Job Status</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="status" value="Status" className="mb-2 block" />
          <Select
            id="status"
            name="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="">Select status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </Select>
        </div>
        <div className="flex justify-end mt-4">
          <Button onClick={closeModal} color="warning" className="mr-2">Cancel</Button>
          <Button type="submit" color="success">Update Status</Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditStatusModal;
