import React from 'react'
import SearchBar from '../../Components/showroom/SearchBar';
import ItemTiles from '../../Components/showroom/ItemTiles';

import Tile1 from '../../Assets/items/1.png';
import Tile2 from '../../Assets/items/2.jpg';
import Tile3 from '../../Assets/items/3.png';
import Tile4 from '../../Assets/items/4.png';
import Tile5 from '../../Assets/items/5.png';
import Tile6 from '../../Assets/items/6.png';
import DownArrowIcon from '../../Assets/icons/downarrow.png';


const Catalogue = () => {
    return (
      <div className="h-screen flex bg-[#F7F7F7]"> 
        <div className='w-20 h-screen'>
        </div>
        <div className="flex w-full overflow-y-auto">
          <div className="w-[100%]">
            <SearchBar/>
            <h1 className="text-[#2B2B2B] font-semibold text-xl mx-8 mt-8 ">Choose Category</h1>
           
            <div className="flex justify-end mt-8  mx-8">
              <p className="text-[#929292] text-[14px] mr-3">Sort by A-Z</p>
              <img src={DownArrowIcon} className="w-[14px] h-[14px] mt-[3px]"/>
            </div>
            <div className="ml-8 mr-4 overflow-y-auto mt-2 flex flex-wrap justify-between" style={{maxHeight: '62vh', height: '100%', paddingRight: '16px', boxSizing: 'content-box' }}>
              <ItemTiles image={Tile1} name={"SLIDING GATE"} icode={"G002"} price={"XXXX"} description={""}/>
              <ItemTiles image={Tile2} name={"WHEELBARROW"} icode={"WB005"} price={"XXXX"} description={""}/>
              <ItemTiles image={Tile3} name={"BBQ MACHINE"} icode={"BM004"} price={"XXXX"} description={""}/>
              <ItemTiles image={Tile4} name={"HANGING CHAIR"} icode={"HC001"} price={"XXXX"} description={""}/>
              <ItemTiles image={Tile5} name={"COFFEE TABLE"} icode={"CT001"} price={"XXXX"} description={""}/>
              <ItemTiles image={Tile6} name={"GARDEN BENCH"} icode={"GB006"} price={"XXXX"} description={""}/>
              <ItemTiles image={Tile1} name={"SLIDING GATE"} icode={"G002"} price={"XXXX"} description={""}/>
              <ItemTiles image={Tile2} name={"WHEELBARROW"} icode={"WB005"} price={"XXXX"} description={""}/>
              <ItemTiles image={Tile3} name={"BBQ MACHINE"} icode={"BM004"} price={"XXXX"} description={""}/>
              <ItemTiles image={Tile4} name={"HANGING CHAIR"} icode={"HC001"} price={"XXXX"} description={""}/>
              <ItemTiles image={Tile5} name={"COFFEE TABLE"} icode={"CT001"} price={"XXXX"} description={""}/>
              <ItemTiles image={Tile6} name={"GARDEN BENCH"} icode={"GB006"} price={"XXXX"} description={""}/>
            </div>
          </div>
        </div>
    </div>
  )
}

export default Catalogue;
