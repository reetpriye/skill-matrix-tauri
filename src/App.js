// App.js
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Card, Button, Navbar} from 'react-bootstrap';

import FileUpload from './Components/FileUpload';
import ColumnSelection from './Components/ColumnSelection';
import PieChart from './Components/PieChart';
import FilterDropdown from './Components/FilterDropdown';
import { readExcelFile } from './utils/fileUtils';

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
  const [filters, setFilters] = useState([]);
  const [primarySkillData, setPrimarySkillData] = useState({ labels: [], values: [] });
  const [roleData, setRoleData] = useState({ labels: [], values: [] });
  const [countryData, setCountryData] = useState({ labels: [], values: [] });
  const [gradeData, setGradeData] = useState({ labels: [], values: [] });

  // const fixedCharts = ['Active Skill#1', 'Role', 'Country', 'Group']

  useEffect(() => {
    updateFilteredData();
  }, [filters, selectedColumn]);

  const handleFilterSelect = (filter) => {
    setFilters([...filters, filter]);
    console.log("handleFilterSelect FIRED...............")
    console.log('%cApp.js line:39 filter', 'color: white; background-color: #007acc;', filter);
  };
  
  const updateFilteredData = () => {
    console.log("updateFilteredData FIRED...............")
    if (selectedColumn && filters.length > 0) {
      console.log("updateFilteredData IN THE LOOP...............")
      const selectedColumnIndex = excelColumns.findIndex((column) => column === selectedColumn);
      if (selectedColumnIndex !== -1) {
        const filteredLabels = [];
        const filteredValues = {};
  
        labels.forEach((label, index) => {
          const value = label;
  
          // Check against each filter
          const passesFilters = filters.every((filter) => {
            const filterValue = filter.value.toLowerCase(); // Convert to lowercase for case-insensitive comparison
            switch (filter.operator) {
              case '=':
                return value.toLowerCase() === filterValue;
              case '>':
                return value.toLowerCase() > filterValue;
              case '<':
                return value.toLowerCase() < filterValue;
              case '>=':
                return value.toLowerCase() >= filterValue;
              case '<=':
                return value.toLowerCase() <= filterValue;
              default:
                return true; // Include in case of an invalid operator
            }
          });
  
          if (passesFilters) {
            if (filteredValues[value]) {
              filteredValues[value]++;
            } else {
              filteredValues[value] = 1;
              filteredLabels.push(value);
            }
          }
        });
  
        // Update the state with filtered data
        setLabels(filteredLabels);
        setValues(filteredLabels.map((label) => filteredValues[label]));
      }
    }
  };

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

  const handleFileSelect = (file) => {
    try {
      setSelectedFile(file);
      readExcelFile(file, (sheet) => {
        const headers = XLSX.utils.sheet_to_json(sheet, { header: 1 })[0];
        setExcelColumns(headers);
        const columnsToFetch = ['Active Skill#1', 'Role', 'Country', 'Grade'];
  
        columnsToFetch.forEach((column) => {
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
            if (column === 'Active Skill#1') {
              setPrimarySkillData({ labels, values: valueArray });
              console.log('%c primarySkillData', 'color: white; background-color: #007acc;', labels, values);
            } else if (column === 'Role') {
              setRoleData({ labels, values: valueArray });
              console.log('%c roleData', 'color: white; background-color: #007acc;', labels, values);
            } else if (column === 'Country') {
              setCountryData({ labels, values: valueArray });
              console.log('%c countryData', 'color: white; background-color: #007acc;', labels, values);
            } else if (column === 'Grade') {
              setGradeData({ labels, values: valueArray });
              console.log('%c gradeData', 'color: white; background-color: #007acc;', labels, values);
            }
          }
        });
      })
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
      readExcelFile(selectedFile, (sheet) => {
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
      })
    } catch (error) {
      console.error('Error handling column select:', error);
    }
  };

  return (
    <>
      <Container fluid className={darkTheme ? 'dark-theme mt-2 main-container' : 'mt-2 main-container'}>
        {/* Header Part */}
        <Row>
          <Navbar bg="dark" data-bs-theme="dark" className='justify-content-center'>
            <div>
              <Navbar.Brand href="#home">Skills Matrix for Digital Thread Associates</Navbar.Brand>
            </div>
          </Navbar>
        </Row>

        {/* Main Body 4*4 chart & options + 1 chart */}
        <Row className='body-container'>

          {/* 4*4 charts */}
          <Col md={8}>
            <Container>
              <Row>
                <Col md={6}>
                  {primarySkillData && (
                    <Card className="chart-container rounded-0">
                      <Card.Body>
                        <PieChart data={primarySkillData} showLegend={true} />
                      </Card.Body>
                    </Card>
                  )}
                </Col>
                <Col md={6}>
                  {roleData && (
                    <Card className="chart-container rounded-0">
                      <Card.Body>
                        <PieChart data={roleData} showLegend={true} />
                      </Card.Body>
                    </Card>
                  )}
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  {countryData && (
                    <Card className="chart-container rounded-0">
                      <Card.Body>
                        <PieChart data={countryData} showLegend={true} />
                      </Card.Body>
                    </Card>
                  )}
                </Col>
                <Col md={6}>
                  {gradeData && (
                    <Card className="chart-container rounded-0">
                      <Card.Body>
                        <PieChart data={gradeData} showLegend={true} />
                      </Card.Body>
                    </Card>
                  )}
                </Col>
              </Row>
            </Container> 
          </Col>

          {/* Options + 1 chart */}
          <Col md={4}>
            {/* File Upload */}
            <FileUpload onFileSelect={handleFileSelect} />
            {/* Filter Selection Dropdown */}
            {selectedColumn && labels.length > 0 && (
              <Card className="chart-container rounded-0">
                <Card.Body>
                  <FilterDropdown
                    columns={excelColumns}
                    selectedColumn={selectedColumn}
                    labels={labels} // Pass the 'labels' prop here
                    filters={filters}
                    onFilterSelect={handleFilterSelect}
                    />
                </Card.Body>
              </Card>
            )}
            {/* Column Selection */}
            {selectedFile && (
              <Card className="chart-container rounded-0">
                <Card.Body>
                  <ColumnSelection columns={excelColumns} onColumnSelect={handleColumnSelect} />
                </Card.Body>
              </Card>
            )}
            {/* Pie Chart */}
            {selectedColumn && labels.length > 0 && (
              <Card className="chart-container rounded-0">
                <Card.Body>
                  <PieChart data={{ labels, values }} showLegend={true} />
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>

        {/* Footer Part */}
        <Row>
            <Col>
              <div className='bg-dark text-white d-flex justify-content-between align-items-center'>
                <div className='px-2'>
                  <h6>Made with love from TCS</h6>
                </div>
                <div onClick={toggleDarkTheme}>
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
            </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;
