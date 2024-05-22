import React, { useState } from 'react';
import Navbar from '../../Components/showroom/showroom_navbar';
import SearchBar from '../../Components/showroom/SearchBar';
import ItemTiles from '../../Components/showroom/ItemTiles';
import { Link } from 'react-router-dom';

import DownArrowIcon from '../../Assets/icons/downarrow.png';

import Tile1 from '../../Assets/items/1.png';
import Tile2 from '../../Assets/items/2.jpg';
import Tile3 from '../../Assets/items/3.png';
import Tile4 from '../../Assets/items/4.png';
import Tile5 from '../../Assets/items/5.png';
import Tile6 from '../../Assets/items/6.png';

const ShowroomDashboard = () => {
  const [catalogueImages, setCatalogueImages] = useState([]);

  // Function to retrieve images based on clicked catalogue
  const handleCatalogueClick = (catalogueName) => {
    // Dummy images for now
    let images = [];
    switch (catalogueName) {
      case 'GATE':
        images = [Tile1, Tile2, Tile3];
        break;
      case 'WHEELBARROW':
        images = [Tile4, Tile5, Tile6];
        break;
      case 'BBQ MACHINE':
        images = [Tile1, Tile2, Tile3];
        break;
      case 'HANGING CHAIR':
        images = [Tile4, Tile5, Tile6];
        break;
      case 'COFFEE TABLE':
        images = [Tile1, Tile2, Tile3];
        break;
      case 'GARDEN BENCH':
        images = [Tile4, Tile5, Tile6];
        break;
      default:
        images = [];
    }
    setCatalogueImages(images);
  };

  return (
    <div className="h-screen flex bg-[#F7F7F7]">
      <div className='w-20 h-screen'>
        <Navbar activeItem={"billing"}/>
      </div>
      <div className="flex w-full overflow-y-auto px-10">
        <div className="w-full">
          <h1 className="text-[#2B2B2B] font-semibold text-2xl mt-8 ">Choose Category</h1>
          <SearchBar/>
          <div className="flex justify-end  mx-8">
            <p className="text-[#929292] text-[14px] mr-3">Sort by A-Z</p>
            <img src={DownArrowIcon} className="w-[14px] h-[14px] mt-[3px]"/>
          </div>
          <div className=" mr-4 overflow-y-auto mt-2 flex flex-wrap justify-between" style={{maxHeight: '100vh', height: '100%', paddingRight: '16px', boxSizing: 'content-box' }}>
            <ItemTiles image={Tile1} name={"GATE"} icode={"G002"} price={"XXXX"} description={"asdf"} onClick={() => handleCatalogueClick("GATE")} />
            <ItemTiles image={Tile2} name={"WHEELBARROW"} icode={"WB005"} price={"XXXX"} description={""} onClick={() => handleCatalogueClick("WHEELBARROW")} />
            <ItemTiles image={Tile3} name={"BBQ MACHINE"} icode={"BM004"} price={"XXXX"} description={""} onClick={() => handleCatalogueClick("BBQ MACHINE")} />
            <ItemTiles image={Tile4} name={"HANGING CHAIR"} icode={"HC001"} price={"XXXX"} description={""} onClick={() => handleCatalogueClick("HANGING CHAIR")} />
            <ItemTiles image={Tile5} name={"COFFEE TABLE"} icode={"CT001"} price={"XXXX"} description={""} onClick={() => handleCatalogueClick("COFFEE TABLE")} />
            <ItemTiles image={Tile6} name={"GARDEN BENCH"} icode={"GB006"} price={"XXXX"} description={""} onClick={() => handleCatalogueClick("GARDEN BENCH")} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowroomDashboard;
