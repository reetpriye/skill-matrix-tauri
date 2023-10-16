import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';

function FilterDropdown({ columns, onFilterSelect, filters }) {
  const [selectedColumn, setSelectedColumn] = useState('');
  const [selectedOperator, setSelectedOperator] = useState('=');
  const [selectedValue, setSelectedValue] = useState('');

  const handleColumnChange = (e) => {
    setSelectedColumn(e.target.value);
  };

  const handleOperatorChange = (e) => {
    setSelectedOperator(e.target.value);
  };

  const handleValueChange = (e) => {
    setSelectedValue(e.target.value);
  };

  const handleAddFilter = () => {
    if (selectedColumn && selectedOperator && selectedValue) {
      onFilterSelect({
        column: selectedColumn,
        operator: selectedOperator,
        value: selectedValue,
      });
      setSelectedColumn('');
      setSelectedOperator('=');
      setSelectedValue('');
    }
  };

  return (
    <Form.Group>
      <Form.Label>Select Filters:</Form.Label>
      <div className="d-flex">
        <Form.Select className="select-dropdown me-2" onChange={handleColumnChange} value={selectedColumn}>
          <option value="">Choose a Column</option>
          {columns.map((column) => (
            <option key={column} value={column}>
              {column}
            </option>
          ))}
        </Form.Select>
        <Form.Select className="select-dropdown me-2" onChange={handleOperatorChange} value={selectedOperator}>
          <option value="="> = </option>
          <option value=">"> &gt; </option>
          <option value="<"> &lt; </option>
          <option value=">="> &ge; </option>
          <option value="<="> &le; </option>
        </Form.Select>
        <Form.Control
          type="text"
          placeholder="Enter Value"
          value={selectedValue}
          onChange={handleValueChange}
        />
        <Button variant="primary" onClick={handleAddFilter} className='btn-sm'>
          Add
        </Button>
      </div>
      <div className="mt-2">
        {filters.map((filter, index) => (
          <span key={index} className="badge bg-secondary me-2">
            {filter.column}: {filter.value}
          </span>
        ))}
      </div>
    </Form.Group>
  );
}

export default FilterDropdown;
