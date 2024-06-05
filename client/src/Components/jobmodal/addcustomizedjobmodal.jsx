import React from 'react';
import { Label, Select, TextInput, Button } from 'flowbite-react';

const AddCustomizedJobDetails = ({
  rawMaterials,
  setRawMaterials,
  rawMaterialLoad,
  rawMaterialBatches,
  setRawMaterialBatches,
  handleRawMaterialChange,
  addRawMaterial,
  removeRawMaterial,
  handleImageChange,
}) => {
  const handleRawMaterialBatchChange = async (index, rawMaterialID) => {
    const response = await fetch(`http://localhost:3001/api/rawmaterial/${rawMaterialID}/batches`);
    const data = await response.json();
    const updatedBatches = { ...rawMaterialBatches, [rawMaterialID]: data };
    setRawMaterialBatches(updatedBatches);
  };

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="productName" value="Product Name" className="mb-2 block" />
        <TextInput
          id="productName"
          name="productName"
          type="text"
          placeholder='Enter Customized Product Name'
          onChange={(e) => setRawMaterials((prev) => {
            const newMaterials = [...prev];
            newMaterials.productName = e.target.value;
            return newMaterials;
          })}
          required
        />
      </div>
      <div>
        <Label htmlFor="image" value="Upload Image" className="mb-2 block" />
        <TextInput
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
      </div>
      {Array.isArray(rawMaterials) && rawMaterials.map((rm, index) => (
        <div key={index} className="flex space-x-3 mb-2">
          <Select
            className="flex-1"
            value={rm.material}
            onChange={(e) => {
              handleRawMaterialChange(index, 'material', e.target.value);
              handleRawMaterialBatchChange(index, e.target.value);
            }}
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
          {rawMaterialBatches[rm.material] && (
            <Select className="flex-1" required>
              {rawMaterialBatches[rm.material].map(batch => (
                <option key={batch.BatchID} value={batch.BatchID}>
                  {batch.Quantity} units @ {batch.UnitPrice} each
                </option>
              ))}
            </Select>
          )}
        </div>
      ))}
      <Button onClick={addRawMaterial}>Add Raw Material</Button>
    </div>
  );
};

export default AddCustomizedJobDetails;
