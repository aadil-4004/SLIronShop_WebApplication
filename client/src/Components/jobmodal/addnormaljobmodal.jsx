import React from 'react';
import { Button, Label, Select, TextInput } from 'flowbite-react';

const AddNormalJobDetails = ({ products, setProducts, productLoad, handleProductChange, addProduct, removeProduct }) => {
  return (
    <div className="space-y-3 mt-3">
      {products.map((product, index) => (
        <div key={index} className="flex flex-col space-y-3 mb-2">
          <div className="flex space-x-3">
            <Select
              className="flex-1"
              value={product.product}
              onChange={(e) => handleProductChange(index, 'product', e.target.value)}
              required
            >
              <option value="">Select product</option>
              {productLoad.map(prod => (
                <option key={prod.ProductID} value={prod.ProductID}>
                  {prod.ProductName}
                </option>
              ))}
            </Select>
            <TextInput
              className="flex-1"
              type="number"
              min="1"
              value={product.quantity}
              onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
              placeholder="Quantity"
              required
            />
            <Button onClick={() => removeProduct(index)} color="failure">
              Remove
            </Button>
          </div>
          {product.rawMaterials.length > 0 && (
            <div className="ml-6 mb-2">
              <h4 className="text-md font-semibold">Raw Materials</h4>
              <ul>
                {product.rawMaterials.map((rm) => (
                  <li key={rm.RawMaterialID}>
                    {rm.materialName}: {rm.quantity}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
      <Button onClick={addProduct}>Add Product</Button>
    </div>
  );
};

export default AddNormalJobDetails;
