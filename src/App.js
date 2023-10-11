import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Card } from 'react-bootstrap';
import './App.css';

import FileUpload from './Components/FileUpload';
import ColumnSelection from './Components/ColumnSelection';
import PieChart from './Components/PieChart';

function App() {
  // State management
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [excelColumns, setExcelColumns] = useState([]);
  const [labels, setLabels] = useState([]);
  const [values, setValues] = useState([]);

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
    <Container>
      <FileUpload onFileSelect={handleFileSelect} />
      {selectedFile && (
        <Row>
          <Col>
            <Card className="chart-container">
              <Card.Body>
                <ColumnSelection columns={excelColumns} onColumnSelect={handleColumnSelect} />
                {selectedColumn && labels.length > 0 && (
                  <PieChart data={{ labels, values }} showLegend={true}/>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default App;
