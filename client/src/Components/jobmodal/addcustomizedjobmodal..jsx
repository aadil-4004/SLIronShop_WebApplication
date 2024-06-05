import React from 'react';
import { Button, Label, Select, TextInput } from 'flowbite-react';

const AddCustomizedJobDetails = ({ rawMaterials, setRawMaterials, rawMaterialLoad, rawMaterialBatches, handleRawMaterialChange, addRawMaterial, removeRawMaterial, handleImageChange }) => {
  return (
    <div className="space-y-3 mt-3">
      <h3 className="text-lg font-semibold">Raw Materials</h3>
      {rawMaterials.map((rm, index) => (
        <div key={index} className="mb-2">
          <div className="flex space-x-3 mb-2">
            <Select
              className="flex-1"
              value={rm.material}
              onChange={(e) => handleRawMaterialChange(index, 'material', e.target.value)}
              required
            >
              <option value="">Select raw material</option>
              {rawMaterialLoad.map(material => (
                <option key={material.RawMaterialID} value={material.RawMaterialID}>
                  {material.RawMaterial}
                </option>
              ))}
            </Select>
            <TextInput
              className="flex-1"
              type="number"
              min="1"
              value={rm.quantity}
              onChange={(e) => handleRawMaterialChange(index, 'quantity', e.target.value)}
              placeholder="Quantity"
              required
            />
            <Button onClick={() => removeRawMaterial(index)} color="failure">
              Remove
            </Button>
          </div>
          {rawMaterialBatches[rm.material] && (
            <div className="ml-6 mb-2">
              <h4 className="text-md font-semibold">Available Batches</h4>
              <ul>
                {rawMaterialBatches[rm.material].map(batch => (
                  <li key={batch.BatchID}>
                    Batch ID: {batch.BatchID}, Quantity: {batch.Quantity}, Unit Price: {batch.UnitPrice}, Date Received: {new Date(batch.DateReceived).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
      <Button onClick={addRawMaterial}>Add Raw Material</Button>
      <div className="mt-4">
        <Label htmlFor="image" value="Upload Image" className="mb-2 block" />
        <TextInput
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
      </div>
    </div>
  );
};

export default AddCustomizedJobDetails;
