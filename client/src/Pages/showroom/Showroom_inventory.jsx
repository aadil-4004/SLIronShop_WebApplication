import React from 'react'
import ShowroomNavbar from '../../Components/showroom/showroom_navbar'


const Showroom_inventory = () => {
  return (
    <div className="flex bg-[#F7F7F7]"> 
      <div className='w-20 h-screen'>
        <ShowroomNavbar activeItem={"inventory"}/>
      </div>
      <div className="">
       Inventory
      </div>
    </div>
  )
}

export default Showroom_inventory
