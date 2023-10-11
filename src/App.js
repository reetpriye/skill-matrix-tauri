import React, { useState } from 'react';
import FileUpload from './Components/FileUpload';
import ColumnSelection from './Components/ColumnSelection';
import PieChart from './Components/PieChart';
import * as XLSX from 'xlsx';
import './App.css'; // Import the CSS file for styling

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [excelColumns, setExcelColumns] = useState([]);
  const [labels, setLabels] = useState([]);
  const [values, setValues] = useState([]);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const headers = XLSX.utils.sheet_to_json(sheet, { header: 1 })[0];
      setExcelColumns(headers);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleColumnSelect = (column) => {
    setSelectedColumn(column);
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const headers = XLSX.utils.sheet_to_json(sheet, { header: 1 })[0];
      const selectedColumnIndex = headers.findIndex((header) => header === column);

      if (selectedColumnIndex !== -1) {
        const columnData = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: true, range: 1 });

        const labels = [];
        const values = {};

        columnData.forEach((row) => {
          const value = row[selectedColumnIndex];
          if (value !== 'EmpId') {
            if (values[value]) {
              values[value]++;
            } else {
              values[value] = 1;
              labels.push(value);
            }
          }
        });

        const valueArray = labels.map((label) => values[label]);

        setLabels(labels);
        setValues(valueArray);
      }
    };

    reader.readAsArrayBuffer(selectedFile);
  };

  return (
    <div className="app-container">
      <h1>Excel Pie Chart App</h1>
      <FileUpload onFileSelect={handleFileSelect} />
      {selectedFile && (
        <div className="chart-container">
          <ColumnSelection columns={excelColumns} onColumnSelect={handleColumnSelect} />
          {selectedColumn && labels.length > 0 && (
            <PieChart data={{ labels, values }} width="300px" height="300px" />
          )}
        </div>
      )}
    </div>
  );
}

export default App;
