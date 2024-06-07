import React, { useState, useEffect } from 'react';
import SearchBar from '../../Components/showroom/SearchBar';
import ItemTiles from '../../Components/showroom/ItemTiles';
import axios from 'axios';


const ShowroomDashboard = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryID, setSelectedCategoryID] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = () => {
    axios.get('http://localhost:3001/api/product')
      .then(response => {
        console.log('Products:', response.data);
        setProducts(response.data);
        setFilteredProducts(response.data);
      })
      .catch(error => {
        console.error('Error fetching product data:', error);
      });
  };

  const fetchCategories = () => {
    axios.get('http://localhost:3001/api/product/categories')
      .then(response => {
        console.log('Categories:', response.data);
        setCategories(response.data);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
      });
  };

  const handleCategoryClick = (categoryID) => {
    console.log('Selected CategoryID:', categoryID);
    if (categoryID === selectedCategoryID) {
      setSelectedCategoryID('');
      setFilteredProducts(products);
    } else {
      setSelectedCategoryID(categoryID);
      const filtered = products.filter(product => product.Category === categoryID);
      console.log('Filtered Products:', filtered);
      setFilteredProducts(filtered);
    }
  };


  return (
    <div className="h-screen flex bg-[#F7F7F7]">
     
      <div className="flex w-full overflow-y-auto px-10">
        <div className="w-full">
          <h1 className="text-[#2B2B2B] font-semibold text-2xl mt-8">Product Catalogue</h1>
          <SearchBar />
          <div className="flex justify-between items-center mx-4 mt-4">
            <h4 className="text-[#2B2B2B] font-medium text-xl">Categories</h4>
            <div className="ml-auto"> 
             
            </div>          
          </div>
          <div className="flex flex-wrap my-4">
            {categories.map(category => (
              <button
                key={category.CategoryID}
                className={`m-2 px-4 py-2 rounded-lg ${selectedCategoryID === category.CategoryID ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                onClick={() => handleCategoryClick(category.CategoryID)}
              >
                {category.CategoryName}
              </button>
            ))}
          </div>
          <div className="mr-4 overflow-y-auto mt-2 flex flex-wrap" style={{ maxHeight: '100vh', height: '100%', paddingRight: '16px', boxSizing: 'content-box' }}>
            {filteredProducts.map(product => (
              <div key={product.ProductID} className="flex-none w-full sm:w-1/2 md:w-1/3 lg:w-1/5 p-2">
                <ItemTiles
                  image={`http://localhost:3001/${product.Image}`}
                  name={product.ProductName}
                  icode={product.ProductID}
                  price={product.WorkmanCharge}
                  description={`Workman Charge: ${product.WorkmanCharge}`}
                  categoryName={categories.find(cat => cat.CategoryID === product.Category)?.CategoryName || 'Unknown'}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowroomDashboard;
