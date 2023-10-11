// ColumnSelection.js
import React from 'react';
import { Form } from 'react-bootstrap';

function ColumnSelection({ columns, onColumnSelect }) {
  return (
    <Form.Group>
      <Form.Label>Select a Column:</Form.Label>
      <Form.Select onChange={(e) => onColumnSelect(e.target.value)}>
        <option value="">Choose a Column</option>
        {columns.map((col) => (
          <option key={col} value={col}>
            {col}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );
}

export default ColumnSelection;
