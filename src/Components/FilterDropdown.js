import React, { useState, useEffect } from 'react';
import { Form, Button, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

function FilterDropdown({
  columns,
  onFilterSelect,
  filters,
  onFilterRemove,
  data,
  excelColumns,
}) {
  const [selectedColumn, setSelectedColumn] = useState('');
  const [selectedOperator, setSelectedOperator] = useState('=');
  const [selectedValue, setSelectedValue] = useState('');
  const [distinctValues, setDistinctValues] = useState([]);

  const handleColumnChange = (e) => {
    const selectedColumn = e.target.value;
    setSelectedColumn(selectedColumn);

    // Fetch distinct values from the data for the selected column
    if (selectedColumn) {
      const columnIndex = columns.indexOf(selectedColumn);
      if (columnIndex !== -1) {
        const columnData = data
          .map((row) => row[columnIndex])
          .filter((value) => !excelColumns.includes(value));
        const uniqueValues = [...new Set(columnData)];
        setDistinctValues(uniqueValues);
      }
    }
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

  const handleRemoveFilter = (index) => {
    onFilterRemove(index);
  };

  return (
    <Form.Group>
      <Form.Label>Select Filters:</Form.Label>
      <div className="d-flex">
        <Form.Select
          className="select-dropdown me-2"
          style={{ flexBasis: '40%' }}
          onChange={handleColumnChange}
          value={selectedColumn}
        >
          <option value="">Choose a Column</option>
          {columns.map((column) => (
            <option key={column} value={column}>
              {column}
            </option>
          ))}
        </Form.Select>
        <Form.Select
          className="select-dropdown me-2"
          style={{ flexBasis: '20%' }}
          onChange={handleOperatorChange}
          value={selectedOperator}
        >
          <option value="="> = </option>
          <option value=">"> &gt; </option>
          <option value="<"> &lt; </option>
          <option value=">="> &ge; </option>
          <option value="<="> &le; </option>
        </Form.Select>
        <Form.Select
          className="select-dropdown me-2"
          style={{ flexBasis: '30%' }}
          onChange={handleValueChange}
          value={selectedValue}
        >
          <option value="">Choose a Value</option>
          {distinctValues.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </Form.Select>
        {/* <Form.Control
          style={{ flexBasis: '30%' }}
          type="text"
          placeholder="Enter Value"
          value={selectedValue}
          onChange={handleValueChange}
        /> */}
        <Button
          style={{ flexBasis: '10%' }}
          variant="primary"
          onClick={handleAddFilter}
          className="btn-sm"
        >
          <FontAwesomeIcon icon={faPlus} />
        </Button>
      </div>
      <div className="mt-2">
        <Form.Group>
          {filters.map((filter, index) => (
            <div className="d-flex mt-2" key={index}>
              <Form.Select
                className="select-dropdown me-2"
                style={{ flexBasis: '40%' }}
                value={filter.column}
                disabled
              >
                <option value="">{filter.column}</option>
              </Form.Select>
              <Form.Select
                className="select-dropdown me-2"
                style={{ flexBasis: '20%' }}
                onChange={handleOperatorChange}
                value={selectedOperator}
                disabled
              >
                <option value="="> {filter.operator} </option>
              </Form.Select>
              <Form.Control
                className="select-dropdown me-2"
                style={{ flexBasis: '30%' }}
                type="text"
                value={filter.value}
                onChange={handleValueChange}
                disabled
              />
              <Button
                style={{ flexBasis: '10%' }}
                variant="danger"
                onClick={() => handleRemoveFilter(index)}
                className="btn-sm"
              >
                <FontAwesomeIcon icon={faTrash} />
              </Button>
            </div>
          ))}
        </Form.Group>
      </div>
    </Form.Group>
  );
}

export default FilterDropdown;