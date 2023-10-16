// FilterDropdown.js
import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';

function FilterDropdown({ columns, selectedColumn, labels, filters, onFilterSelect }) {
  const [distinctValues, setDistinctValues] = useState([]);
  const [selectedValue, setSelectedValue] = useState('');

  useEffect(() => {
    // Calculate distinct values based on the selected column
    const distinct = Array.from(new Set(labels));
    setDistinctValues(distinct);
  }, [selectedColumn, labels]);

  const handleFilterChange = (e) => {
    setSelectedValue(e.target.value);
  };

  const handleAddFilter = () => {
    if (selectedValue) {
      onFilterSelect({ column: selectedColumn, value: selectedValue });
      setSelectedValue('');
    }
  };

  return (
    <Form.Group>
      <Form.Label>Select Filters:</Form.Label>
      <div className="d-flex">
        <Form.Select onChange={handleFilterChange} value={selectedValue}>
          <option value="">Choose a Value</option>
          {distinctValues.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </Form.Select>
        <Button variant="primary" onClick={handleAddFilter}>
          Add Filter
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
