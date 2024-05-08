import React, { useState } from 'react';
import { HiOutlineSearch } from 'react-icons/hi';

const SearchBar = ({ onSearch }) => {
  const [searchText, setSearchText] = useState('');

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      onSearch(searchText);
    }
  };

  const handleChange = (event) => {
    setSearchText(event.target.value);
  };

  return (
    <div className="flex items bg-white rounded-lg overflow-hidden mt-5 mb-5 h-9 relative z-0 w-full">
      <input
        type="text"
        placeholder="Search Item"
        value={searchText}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        className="py-4 px-4 bg-transparent outline-none flex-grow rounded-lg text-s"
      />
      <button onClick={() => onSearch(searchText)} className="p-2 rounded-lg text-[#8a8a8a] hover:bg-[#FFEEEF]">
        <HiOutlineSearch className="w-5 h-5" />
      </button>
    </div>
  );
};

export default SearchBar;
