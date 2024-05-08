import React from 'react'

function ItemTiles({image,name,icode,price,description}) {
  return (
    <div className="min-w-[245px] max-w-[230px] max-h-[290px] min-h-[290px] rounded-xl bg-white flex flex-col px-1 mb-5 hover:border-[3px] hover:border-black-600">
        <div className='items-center'>
        <img src={image} alt={name} className="mt-6 mb-2 max-h-[165px] max-w-[230px] min-h-[165px] mx-auto" />
        </div>
        <div className="px-3 mt-1 mb-5">
            <h1 className="text-black text-[14px] font-semibold">{name}</h1>
            <h1 className="text-[#929292] text-[10px]">Category Code: {icode}</h1>
            <h1 className="mt-2 text-black text-[14px] font-semibold">LKR {price}</h1>
        </div>
    </div>

  )
}

export default ItemTiles
