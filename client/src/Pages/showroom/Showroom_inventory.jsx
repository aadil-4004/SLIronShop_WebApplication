import React, { useState, useEffect } from 'react';
import ShowroomNavbar from '../../Components/showroom/showroom_navbar';
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import SearchBar from '../../Components/showroom/SearchBar';
import { Button } from "flowbite-react";
import AddProductModal from '../../Components/productmodal/addproductmodal';
import EditProductModal from '../../Components/productmodal/editproductmodal';
import { HiPlus } from "react-icons/hi";
import axios from 'axios';

const Showroom_inventory = () => {
  const [AddProductModalIsOpen, setAddProductModalIsOpen] = useState(false);
  const [EditProductModalIsOpen, setEditProductModalIsOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    axios.get('http://localhost:3001/api/product') // Corrected endpoint
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error('Error fetching product data:', error);
      });
  };

  const openAddProductModal = () => {
    setAddProductModalIsOpen(true);
  };

  const closeAddProductModal = () => {
    setAddProductModalIsOpen(false);
  };

  const openEditProductModal = (product) => {
    setSelectedProduct(product);
    setEditProductModalIsOpen(true);
  };

  const closeEditProductModal = () => {
    setEditProductModalIsOpen(false);
    setSelectedProduct(null);
  };

  
  
  return (
    <div className="flex bg-[#F7F7F7] ">
      <div className='w-20 h-screen '>
        <ShowroomNavbar activeItem={"inventory"} />
      </div>
      <div className="py-10 w-full">
        <div className="px-10 pb-5">
          <h2 className="text-4xl font-semibold mb-3">Inventory</h2>
          <SearchBar />
          <div className="flex">
            <div className="ml-auto"> 
              <Button onClick={openAddProductModal}>
                Add
                <HiPlus className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto px-10">
          <Table hoverable>
            <TableHead>
              <TableHeadCell>Product Name</TableHeadCell>
              <TableHeadCell>In-Stock</TableHeadCell>
              <TableHeadCell>Price</TableHeadCell>
              <TableHeadCell>Category</TableHeadCell>
              <TableHeadCell>
                <span className="sr-only">Edit</span>
              </TableHeadCell>
            </TableHead>
            <TableBody className="divide-y">
              {products.map(product => (
                <TableRow key={product.ProductID} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {product.ProductName}
                  </TableCell>
                  <TableCell>{product.InStock}</TableCell>
                  <TableCell>{product.Price}</TableCell>
                  <TableCell>{product.Category}</TableCell>

                  <TableCell>
                    <a href="#" className="font-medium text-cyan-600 hover:underline dark:text-cyan-500" onClick={() => openEditProductModal(product)}>
                      Edit
                    </a>
                  </TableCell>
                  
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <AddProductModal isOpen={AddProductModalIsOpen} closeModal={closeAddProductModal} fetchProducts={fetchProducts} />
        {selectedProduct && 
          <EditProductModal isOpen={EditProductModalIsOpen} closeModal={closeEditProductModal} fetchProducts={fetchProducts} product={selectedProduct} />
        }
      </div>
    </div>
  );
};

export default Showroom_inventory;
