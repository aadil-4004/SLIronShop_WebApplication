import React from 'react';
import { Label, Select, TextInput, Button } from 'flowbite-react';

const AddNormalJobDetails = ({ products, setProducts, productLoad, handleProductChange, addProduct, removeProduct }) => {
  return (
    <div>
      {products.map((product, index) => (
        <div key={index} className="mb-4 p-3 border rounded">
          <div className="flex space-x-3 mb-2">
            <Label htmlFor={`product-${index}`} value="Product" className="w-1/5" />
            <Select
              id={`product-${index}`}
              value={product.product}
              onChange={(e) => handleProductChange(index, 'product', e.target.value)}
              required
            >
              <option value="">Select product</option>
              {productLoad.map(p => (
                <option key={p.ProductID} value={p.ProductID}>{p.ProductName}</option>
              ))}
            </Select>
            <Label htmlFor={`quantity-${index}`} value="Quantity" className="w-1/5" />
            <TextInput
              className="w-1/5"
              id={`quantity-${index}`}
              type="number"
              min="1"
              value={product.quantity}
              onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
              required
            />
            <Button type="button" color="red" onClick={() => removeProduct(index)}>Remove</Button>
          </div>

          <h4 className="text-lg font-semibold">Raw Materials</h4>
          {product.rawMaterials.map((rawMaterial, rmIndex) => (
            <div key={rmIndex} className="mb-2 p-2 border rounded">
              <Label value={`Material: ${rawMaterial.materialName}`} className="block mb-1" />
              <Label value={`Quantity: ${rawMaterial.quantity}`} className="block mb-1" />
            </div>
          ))}
        </div>
      ))}
      <Button type="button" onClick={addProduct}>Add Another Product</Button>
    </div>
  );
};

export default AddNormalJobDetails;
