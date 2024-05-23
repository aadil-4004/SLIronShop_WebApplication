import React, { useState } from 'react';
import { HiChevronDown } from "react-icons/hi";
import billicon from '../../Assets/icons/select/pos.png';
import invicon_n from '../../Assets/icons/non-select/inventory.png';
import ordersicon_n from '../../Assets/icons/non-select/orders.png';
import customersicon_n from '../../Assets/icons/non-select/customers.png';
import settingsicon_n from '../../Assets/icons/non-select/settings.png';
import logouticon from '../../Assets/icons/logout.png';
import usericon from '../../Assets/icons/user.png';

const ShowroomNavbar = ({ activeItem }) => {
  const [activeLink, setActiveLink] = useState(activeItem); // State to keep track of active link
  const [expanded, setExpanded] = useState(false); // State to track if navbar is expanded on hover
  const [showDropdown, setShowDropdown] = useState({}); // State to handle dropdown visibility for each section

  const handleMouseEnter = () => {
    setExpanded(true);
  };

  const handleMouseLeave = () => {
    setExpanded(false);
    setShowDropdown({}); // Hide all dropdowns when not hovering over the navbar
  };

  const handleDropdownMouseEnter = (section) => {
    setShowDropdown((prev) => ({ ...prev, [section]: true }));
  };

  const handleDropdownMouseLeave = (section) => {
    setShowDropdown((prev) => ({ ...prev, [section]: false }));
  };

  return (
    <nav className='h-screen fixed flex z-10'>
      <div className={`h-screen bg-white text-black ${expanded ? 'w-[200px] items-start pl-3' : 'w-20 items-center'} flex flex-col justify-between transition-all duration-500 ease-in-out shadow-lg`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}>
        <div>
          <img src={usericon} alt="User" className={`p-3 mt-8 mb-10 w-20`} />
          <div className={`flex flex-col ${expanded ? 'items-start' : 'items-center'} `}>
            <div className='mb-5'>
              <a href="/dashboard" onClick={() => setActiveLink("billing")} >
                <div className={`flex p-3 ${activeLink === "billing" ? 'bg-[#AAD8E6]' : 'hover:bg-[#ADD8E6]'} rounded-lg ${expanded ? 'w-[170px]' : 'w-[50px] border-[1px] border-transparent'} ${expanded && activeLink !== "billing" ? 'border-[1px] border-gray-200' : ''} transition-all duration-500 ease-in-out`}>
                  <img src={billicon} alt="Billing" />
                  <span className={`flex-grow text-center transition-opacity ${expanded ? 'duration-[400ms] opacity-100 max-w-full' : 'duration-0 opacity-0 max-w-0'}`}>Catalogue</span>
                </div>
              </a>
            </div>

            <div className='mb-5 relative' onMouseEnter={() => handleDropdownMouseEnter("inventory")} onMouseLeave={() => handleDropdownMouseLeave("inventory")}>
              <div className={`flex p-3 ${activeLink === "inventory" ? 'bg-[#0096FF]' : 'hover:bg-[#0096FF]'} rounded-lg ${expanded ? 'w-[170px]' : 'w-[50px] border-[1px] border-transparent'} ${expanded && activeLink !== "inventory" ? 'border-[1px] border-gray-200' : ''} transition-all duration-500 ease-in-out cursor-pointer`}>
                <img src={invicon_n} alt="Inventory" />
                <span className={`flex-grow text-center transition-opacity ${expanded ? 'duration-[400ms] opacity-100 max-w-full' : 'duration-0 opacity-0 max-w-0'}`}>Inventory</span>
                <HiChevronDown className={`ml-2 transition-opacity ${expanded ? 'opacity-100' : 'opacity-0'}`} />
              </div>
              {showDropdown.inventory && expanded && (
                <div className="absolute left-full top-0 mt-1 w-[170px] bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                  <a href="/inventory" className="block px-4 py-2 hover:bg-gray-100 rounded-t-lg" onClick={() => setActiveLink("inventory")}>
                    Products
                  </a>
                  <a href="/rawmaterials" className="block px-4 py-2 hover:bg-gray-100 rounded-b-lg" onClick={() => setActiveLink("rawmaterials")}>
                    Raw Materials
                  </a>
                </div>
              )}
            </div>

            <div className='mb-5 relative' onMouseEnter={() => handleDropdownMouseEnter("orders")} onMouseLeave={() => handleDropdownMouseLeave("orders")}>
              <div className={`flex p-3 ${activeLink === "orders" ? 'bg-[#0096FF]' : 'hover:bg-[#0096FF]'} rounded-lg ${expanded ? 'w-[170px]' : 'w-[50px] border-[1px] border-transparent'} ${expanded && activeLink !== "orders" ? 'border-[1px] border-gray-200' : ''} transition-all duration-500 ease-in-out cursor-pointer`}>
                <img src={ordersicon_n} alt="Orders" />
                <span className={`flex-grow text-center transition-opacity ${expanded ? 'duration-[400ms] opacity-100 max-w-full' : 'duration-0 opacity-0 max-w-0'}`}>Orders</span>
                <HiChevronDown className={`ml-2 transition-opacity ${expanded ? 'opacity-100' : 'opacity-0'}`} />
              </div>
              {showDropdown.orders && expanded && (
                <div className="absolute left-full top-0 mt-1 w-[170px] bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                  <a href="/orders" className="block px-4 py-2 hover:bg-gray-100 rounded-t-lg" onClick={() => setActiveLink("orders")}>
                    Normal
                  </a>
                  <a href="/custom-orders" className="block px-4 py-2 hover:bg-gray-100 rounded-b-lg" onClick={() => setActiveLink("custom-orders")}>
                    Customized
                  </a>
                </div>
              )}
            </div>

            <div className='mb-5 relative' onMouseEnter={() => handleDropdownMouseEnter("customers")} onMouseLeave={() => handleDropdownMouseLeave("customers")}>
              <div className={`flex p-3 ${activeLink === "customers" ? 'bg-[#0096FF]' : 'hover:bg-[#0096FF]'} rounded-lg ${expanded ? 'w-[170px]' : 'w-[50px] border-[1px] border-transparent'} ${expanded && activeLink !== "customers" ? 'border-[1px] border-gray-200' : ''} transition-all duration-500 ease-in-out cursor-pointer`}>
                <img src={customersicon_n} alt="Customers" />
                <span className={`flex-grow text-center transition-opacity ${expanded ? 'duration-[400ms] opacity-100 max-w-full' : 'duration-0 opacity-0 max-w-0'}`}>Customers</span>
                <HiChevronDown className={`ml-2 transition-opacity ${expanded ? 'opacity-100' : 'opacity-0'}`} />
              </div>
              {showDropdown.customers && expanded && (
                <div className="absolute left-full top-0 mt-1 w-[170px] bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                  <a href="/customers" className="block px-4 py-2 hover:bg-gray-100 rounded-t-lg" onClick={() => setActiveLink("customers")}>
                    Customers
                  </a>
                  <a href="/suppliers" className="block px-4 py-2 hover:bg-gray-100 rounded-b-lg" onClick={() => setActiveLink("suppliers")}>
                    Suppliers
                  </a>
                </div>
              )}
            </div>

            <div className='mb-5'>
              <a href="/settings" onClick={() => setActiveLink("settings")}>
                <div className={`flex p-3 ${activeLink === "settings" ? 'bg-[#0096FF]' : 'hover:bg-[#0096FF]'} rounded-lg ${expanded ? 'w-[170px]' : 'w-[50px] border-[1px] border-transparent'} ${expanded && activeLink !== "settings" ? 'border-[1px] border-gray-200' : ''} transition-all duration-500 ease-in-out`}>
                  <img src={settingsicon_n} alt="Settings" />
                  <span className={`flex-grow text-center transition-opacity ${expanded ? 'duration-[400ms] opacity-100 max-w-full' : 'duration-0 opacity-0 max-w-0'}`}>Settings</span>
                </div>
              </a>
            </div>

          </div>
        </div>
        <div className="mb-5">
          <a href="/login" onClick={() => setActiveLink("logout")}>
            <div className={`flex p-3 hover:bg-[#6495ED] bg-[#6495ED] rounded-lg ${expanded ? 'w-[170px]' : 'w-12'} transition-all duration-500 ease-in-out`}>
              <img src={logouticon} alt="Logout" className='w-6 h-6' />
              <span className={`flex-grow text-center text-white transition-opacity ${expanded ? 'duration-[400ms] opacity-100 max-w-full' : 'duration-0 opacity-0 max-w-0'}`}>Logout</span>
            </div>
          </a>
        </div>
      </div>
      <div className='w-[2px] bg-[#89CFF0] h-screen'></div>
    </nav>
  );
};

export default ShowroomNavbar;
