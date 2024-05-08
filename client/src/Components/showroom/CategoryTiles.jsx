import React from 'react'



const CategoryTiles = ({icon,text}) => {

  return (
    <div className=" min-w-24 max-w-24 rounded-xl bg-#f7f7f7 items-center flex flex-col px-1 mt-5 hover:bg-[#FFEEEF] hover:border-[#F05756] hover:border-[1px] border-[1px] border-transparent">
      <h1 className="mb-6 text-[#ffffff] text-xs">{text}</h1>
    </div>
  )
}

export default CategoryTiles
