// ColumnSelection.js
import React from 'react';

function ColumnSelection({ columns, onColumnSelect }) {
  return (
    <select onChange={(e) => onColumnSelect(e.target.value)}>
      {columns.map((col) => (
        <option key={col}>{col}</option>
      ))}
    </select>
  );
}

export default ColumnSelection;
