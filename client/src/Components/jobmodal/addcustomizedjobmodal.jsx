import React from 'react';
import { Label, TextInput, Button, Select } from 'flowbite-react';

const AddCustomizedJobDetails = ({ rawMaterials, setRawMaterials, rawMaterialLoad, handleRawMaterialChange, addRawMaterial, removeRawMaterial, handleImageChange, customProductName, setCustomProductName }) => {
  return (
    <div>
      <div className="space-y-3">
        <div>
          <Label htmlFor="customProductName" value="Custom Product Name" className="mb-2 block" />
          <TextInput
            id="customProductName"
            name="customProductName"
            placeholder="Enter custom product name"
            value={customProductName}
            onChange={(e) => setCustomProductName(e.target.value)}
            required
          />
        </div>
      </div>
      {rawMaterials.map((rawMaterial, index) => (
        <div key={index} className="mb-4 p-3 border rounded">
          <div className="flex space-x-3 mb-2">
            <Label htmlFor={`rawMaterial-${index}`} value="Raw Material" className="w-1/10" />
            <Select
              id={`rawMaterial-${index}`}
              value={rawMaterial.material}
              onChange={(e) => handleRawMaterialChange(index, 'material', e.target.value)}
              required
            >
              <option value="">Select raw material</option>
              {rawMaterialLoad.map(rm => (
                <option key={rm.RawMaterialID} value={rm.RawMaterialID}>{rm.RawMaterial}</option>
              ))}
            </Select>
            <Label htmlFor={`quantity-${index}`} value="Quantity" className="w-1/5" />
            <TextInput
              className="w-1/5"
              id={`quantity-${index}`}
              type="number"
              min="1"
              value={rawMaterial.quantity}
              onChange={(e) => handleRawMaterialChange(index, 'quantity', e.target.value)}
              required
            />
            <Button type="button" color="red" onClick={() => removeRawMaterial(index)}>Remove</Button>
          </div>
        </div>
      ))}
      <div className="mb-4">
        <Label htmlFor="productImage" value="Upload Custom Product Image" className="mb-2 block" />
        <input type="file" id="productImage" accept="image/*" onChange={handleImageChange} />
      </div>
      <Button type="button" onClick={addRawMaterial}>Add Another Raw Material</Button>
    </div>
  );
};

export default AddCustomizedJobDetails;
