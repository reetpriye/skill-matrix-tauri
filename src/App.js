// App.js
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

import FileUpload from './Components/FileUpload';
import ColumnSelection from './Components/ColumnSelection';
import PieChart from './Components/PieChart';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import './App.css';

library.add(faSun, faMoon);

function App() {
  // State management
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [excelColumns, setExcelColumns] = useState([]);
  const [labels, setLabels] = useState([]);
  const [values, setValues] = useState([]);
  const [darkTheme, setDarkTheme] = useState(false);

  const toggleDarkTheme = () => {
    setDarkTheme(!darkTheme);
  };
  
  useEffect(() => {
    if (darkTheme) {
      document.documentElement.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
    }
  }, [darkTheme]);

  // File selection handler
  const handleFileSelect = (file) => {
    try {
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
    } catch (error) {
      console.error('Error handling file select:', error);
    }
  };

  // Column selection handler
  const handleColumnSelect = (column) => {
    try {
      setSelectedColumn(column);
      if (!selectedFile) {
        // Handle the case where no file is selected
        return;
      }
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
    } catch (error) {
      console.error('Error handling column select:', error);
      // Handle the error, perhaps show a user-friendly message
    }
  };

  return (
    <div className={darkTheme ? 'dark-theme mt-2 main-container' : 'mt-2 main-container'}>
      <Container>
        <Row>
          <Col md={4}>
            {/* Left Column - File Upload and Column Selection */}
            <FileUpload onFileSelect={handleFileSelect} />
            {selectedFile && (
              <Card className="chart-container rounded-0">
                <Card.Body>
                  <ColumnSelection columns={excelColumns} onColumnSelect={handleColumnSelect} />
                </Card.Body>
              </Card>
            )}
          </Col>
          <Col md={8}>
            {/* Right Column - Pie Chart */}
            {selectedColumn && labels.length > 0 && (
              <Card className="chart-container rounded-0">
                <Card.Body>
                  <PieChart data={{ labels, values }} showLegend={true} />
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      </Container>
      
      <div id="theme-toggle" onClick={toggleDarkTheme}>
        <Button variant={darkTheme ? 'light' : 'dark'}>
          <div className="d-flex justify-content-between align-items-center">
            <p className='m-0'>Toggle theme</p>
            <div className='px-2'>
              <FontAwesomeIcon icon={darkTheme ? 'sun' : 'moon'} />
            </div>
          </div>
        </Button>
      </div>
    </div>
  );
}

export default App;
