// src/Pages/showroom/dashboard.jsx
import React, { useState, useEffect } from 'react';
import ShowroomNavbar from '../../Components/showroom/showroom_navbar';
import axios from 'axios';
import { Button } from 'flowbite-react';
import CalendarModal from '../../Components/CalendarModal';

const Dashboard = ({ images }) => {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchDueDates();
  }, []);

  const fetchDueDates = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/jobs/due-dates');
      const dueDates = response.data.map(job => ({
        title: job.CustomerName,
        date: job.DueDate,
      }));
      setEvents(dueDates);
    } catch (error) {
      console.error('Error fetching due dates:', error);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex bg-[#F7F7F7]" style={{ height: '100vh' }}>
      <div className='w-20 h-screen'>
        <ShowroomNavbar activeItem={"billing"} />
      </div>
      <div className="flex-grow p-5">
        <Button
          onClick={openModal}
          style={{
            padding: '10px 20px',
            backgroundColor: '#1E90FF',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginBottom: '20px',
            color: '#fff'
          }}
        >
          Show Calendar
        </Button>

        <div>
          <h2>Item Details</h2>
          {/* Add more content here */}
        </div>

        <CalendarModal
          isOpen={isModalOpen}
          closeModal={closeModal}
          events={events}
        />
      </div>
    </div>
  );
};

export default Dashboard;
