// src/Components/CalendarModal.jsx
import React from 'react';
import Modal from 'react-modal';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { Button } from 'flowbite-react';

Modal.setAppElement('#root');

const CalendarModal = ({ isOpen, closeModal, events }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          height: '80%',
          padding: '20px',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
          borderRadius: '10px',
          backgroundColor: '#fff',
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
      }}
    >
      <h2 className="text-2xl text-center mb-4">Calendar</h2>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events}
      />
      <Button
        onClick={closeModal}
        style={{
          padding: '10px 20px',
          backgroundColor: '#1E90FF',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '20px',
          display: 'block',
          marginLeft: 'auto',
          marginRight: 'auto',
          color: '#fff'
        }}
      >
        Close Calendar
      </Button>
    </Modal>
  );
};

export default CalendarModal;
