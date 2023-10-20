import React, { useState } from 'react';
import { Form } from 'react-bootstrap';

function FilterDropdown({ columns, onFilterSelect, data, excelColumns }) {
  const [selectedColumn, setSelectedColumn] = useState('');
  const [selectedOperator, setSelectedOperator] = useState('=');
  const [selectedValue, setSelectedValue] = useState('');
  const [distinctValues, setDistinctValues] = useState([]);
  const [columnDataType, setColumnDataType] = useState(null);
  const [filterApplied, setFilterApplied] = useState(false);

  const handleColumnChange = (e) => {
    const selectedColumn = e.target.value;
    setSelectedColumn(selectedColumn);

    if (selectedColumn) {
      const columnIndex = columns.indexOf(selectedColumn);
      if (columnIndex !== -1) {
        const columnData = data.map((row) => row[columnIndex]);

        // Determine the data type of the column
        const dataType = determineDataType(columnData);
        setColumnDataType(dataType);

        console.log('Data type identified: ', dataType);

        // Set the operator options based on data type
        const operatorOptions = getOperatorOptions(dataType);
        setSelectedOperator(operatorOptions[0]); // Set to the first option
        // Create a Set to store distinct values
        const distinctValuesSet = new Set();

        // Iterate over the columnData and add values to the Set if they are not in excelColumns
        for (const value of columnData) {
          if (!excelColumns.includes(value)) {
            distinctValuesSet.add(value);
          }
        }

        // Convert the Set back to an array
        const distinctValuesArray = Array.from(distinctValuesSet).sort();
        setDistinctValues(distinctValuesArray);
      }
    }
  };

  const determineDataType = (data) => {
    const isString = isNaN(data[data.length - 1]);
    return isString ? 'string' : 'numeric';
  };

  const getOperatorOptions = (dataType) => {
    return dataType === 'string' ? ['='] : ['=', '>', '<', '>=', '<='];
  };

  const handleOperatorChange = (e) => {
    setSelectedOperator(e.target.value);
  };

  const handleValueChange = (e) => {
    setSelectedValue(e.target.value);
    handleAddFilter();
  };

  const handleAddFilter = () => {
    if (selectedColumn && selectedOperator && selectedValue) {
      onFilterSelect({
        column: selectedColumn,
        operator: selectedOperator,
        value: selectedValue,
      });
      setFilterApplied(true);
    }
  };

  return (
    <Form.Group>
      <div className="d-flex">
        <Form.Select
          className="select-dropdown me-2"
          style={{ flexBasis: '50%' }}
          onChange={handleColumnChange}
          value={selectedColumn}
          disabled={filterApplied}
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
          disabled={filterApplied}
        >
          {getOperatorOptions(columnDataType).map((operator) => (
            <option key={operator} value={operator}>
              {operator}
            </option>
          ))}
        </Form.Select>
        <Form.Select
          className="select-dropdown me-2"
          style={{ flexBasis: '30%' }}
          onChange={handleValueChange}
          value={selectedValue}
          disabled={filterApplied}
        >
          <option value="">Choose a Value</option>
          {distinctValues.map((value) => (
            <option key={value} value={value}>
              {typeof value === 'number' ? parseFloat(value.toFixed(2)) : value}
            </option>
          ))}
        </Form.Select>
      </div>
    </Form.Group>
  );
}

export default FilterDropdown;