import React, { useState, useEffect } from 'react';
import ShowroomNavbar from '../../Components/showroom/showroom_navbar';
import axios from 'axios';
import { Button, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from 'flowbite-react';
import CalendarModal from '../../Components/CalendarModal';
import { FaReceipt } from 'react-icons/fa';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const Dashboard = ({ images }) => {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobCounts, setJobCounts] = useState({ pending: 0, inProgress: 0 });
  const [lowStockRawMaterials, setLowStockRawMaterials] = useState([]);
  const [incomeData, setIncomeData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    fetchDueDates();
    fetchJobCounts();
    fetchLowStockRawMaterials();
    fetchInvoiceDetails();
    fetchTopProducts();
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

  const fetchJobCounts = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/jobs/status-counts');
      setJobCounts(response.data);
    } catch (error) {
      console.error('Error fetching job counts:', error);
    }
  };

  const fetchLowStockRawMaterials = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/rawmaterial/low-stock-raw-materials');
      setLowStockRawMaterials(response.data);
    } catch (error) {
      console.error('Error fetching low stock raw materials:', error);
    }
  };

  const fetchInvoiceDetails = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/dashboard/getInvoiceDetails');
      console.log('Invoice details response:', response.data);
      if (response.data && response.data.length > 0) {
        const formattedData = response.data.map(invoice => ({
          date: new Date(invoice.Date).toISOString().split('T')[0], // Format date to exclude time part
          income: invoice.TotalBillAmount
        }));
        setIncomeData(formattedData);
      } else {
        console.error('No data received');
        setIncomeData([]); // Clear existing data if no new data is received
      }
    } catch (error) {
      console.error('Error fetching invoice details:', error.response ? error.response.data : error.message);
    }
  };

  const fetchTopProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/dashboard/top-performing-products');
      setTopProducts(response.data);
    } catch (error) {
      console.error('Error fetching top performing products:', error);
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
        <ShowroomNavbar activeItem={"dashboard"} />
      </div>
      <div className="flex-grow p-5 grid grid-cols-2 gap-4">
        <div>
          <div className="bg-white shadow-lg rounded-lg p-6 transform hover:scale-105 transition-transform duration-300 ease-in-out mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FaReceipt className="text-5xl text-blue-500 mr-4" />
                <div>
                  <h3 className="text-xl font-bold text-gray-700">Job Status Counts</h3>
                  <p className="text-lg text-gray-900">Pending: {jobCounts.pending}</p>
                  <p className="text-lg text-gray-900">In Progress: {jobCounts.inProgress}</p>
                </div>
              </div>
              <Button
                onClick={openModal}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#1E90FF',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  color: '#fff'
                }}
              >
                Show Calendar
              </Button>
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-6 transform hover:scale-105 transition-transform duration-300 ease-in-out">
            <h3 className="text-xl font-bold text-gray-700 mb-4">Low Stock and Out of Stock Raw Materials</h3>
            <Table>
              <TableHead>
                  <TableHeadCell>Raw Material</TableHeadCell>
                  <TableHeadCell>Units</TableHeadCell>
              </TableHead>
              <TableBody>
                {lowStockRawMaterials.map(material => (
                  <TableRow key={material.RawMaterialID}>
                    <TableCell>{material.RawMaterial}</TableCell>
                    <TableCell>{material.CurrentStock}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={incomeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#8884d8" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>

          <div className="mt-6">
            <h3 className="text-xl font-bold text-gray-700 mb-4">Top Performing Products</h3>
            <Table>
              <TableHead>
                  <TableHeadCell>Product Name</TableHeadCell>
                  <TableHeadCell>Total Sold</TableHeadCell>
                  <TableHeadCell>Profit</TableHeadCell>
              </TableHead>
              <TableBody>
                {topProducts.map(product => (
                  <TableRow key={product.Description}>
                    <TableCell>{product.Description}</TableCell>
                    <TableCell>{product.TotalSold}</TableCell>
                    <TableCell>{product.Profit}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <CalendarModal
        isOpen={isModalOpen}
        closeModal={closeModal}
        events={events}
      />
    </div>
  );
};

export default Dashboard;
