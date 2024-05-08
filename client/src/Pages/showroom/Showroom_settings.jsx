import React from 'react'
import ShowroomNavbar from '../../Components/showroom/showroom_navbar'

const Showroom_settings = () => {
  return (
    <div className="flex bg-[#F7F7F7]"> 
      <div className='w-20 h-screen'>
        <ShowroomNavbar activeItem={"settings"}/>
      </div>
      <div className="">
       Settings
      </div>
    </div>
  )
}

export default Showroom_settings
