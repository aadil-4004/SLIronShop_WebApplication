import React from 'react';
import ShowroomNavbar from '../../Components/showroom/showroom_navbar';

const Jobs = ({ images }) => {
  return (
    <div className="flex bg-[#F7F7F7]"> 
      <div className='w-20 h-screen'>
        <ShowroomNavbar activeItem={"orders"}/>
      </div>
      <div className="">
       Item Details
      </div>
    </div>
  )
}

export default Jobs;
