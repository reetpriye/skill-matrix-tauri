import React, { useState, useEffect } from 'react'
import * as XLSX from 'xlsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container, Row, Col, Card, Button, Navbar } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons'

import './App.css'
import FileUpload from './Components/FileUpload'
import ColumnSelection from './Components/ColumnSelection'
import PieChart from './Components/PieChart'
import FixedPieChart from './Components/FixedPieChart'
import FilterDropdown from './Components/FilterDropdown'
import Alert from './Components/Alert'
import { readExcelFile } from './utils/fileUtils'

library.add(faSun, faMoon)

function App() {
  const [alertMessage, setAlertMessage] = useState('')
  const [alertType, setAlertType] = useState('')
  const [showAlert, setShowAlert] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [selectedColumn, setSelectedColumn] = useState(null)
  const [excelColumns, setExcelColumns] = useState([])
  const [darkTheme, setDarkTheme] = useState(false)
  const [filters, setFilters] = useState([])
  const [originalExcelData, setOriginalExcelData] = useState([])
  const [filteredExcelData, setFilteredExcelData] = useState([])
  const [labels, setLabels] = useState([])
  const [values, setValues] = useState([])
  const [fileSelected, setFileSelected] = useState(false)
  const fixedCharts = ['Active Skill#1', 'Role', 'Country', 'Grade']

  useEffect(() => {
    if (darkTheme) {
      document.documentElement.classList.add('dark-theme')
    } else {
      document.documentElement.classList.remove('dark-theme')
    }
  }, [darkTheme])

  // When filters get changed, it calls updateFilteredData() which updates
  // the filteredExcelData that in turn fires handleColumnSelect which
  // changes labels and values and the pie chart re renders

  useEffect(() => {
    updateFilteredData()
  }, [filters])

  useEffect(() => {
    handleColumnSelect(selectedColumn)
  }, [filteredExcelData])

  const handleFilterRemove = index => {
    const updatedFilters = [...filters]
    updatedFilters.splice(index, 1)
    setFilters(updatedFilters)
  }

  const showAlertMessage = (message, type) => {
    setShowAlert(true)
    setAlertMessage(message)
    setAlertType(type)
    setTimeout(() => {
      setShowAlert(false)
      setAlertMessage('')
    }, 2900)
  }

  const handleFilterSelect = filter => {
    const { column, operator, value } = filter
    const newFilter = { column, operator, value }

    if (
      filters.some(existingFilter => areFiltersEqual(existingFilter, newFilter))
    ) {
      showAlertMessage(
        `Filter for column '${column}' is already applied.`,
        'warning'
      )
      return
    }
    setFilters([...filters, newFilter])
  }

  const areFiltersEqual = (filter1, filter2) => {
    return (
      filter1.column === filter2.column &&
      filter1.operator === filter2.operator &&
      filter1.value === filter2.value
    )
  }

  const updateFilteredData = () => {
    const filteredData = originalExcelData.filter(row => {
      return filters.every(filter => {
        const { column, operator, value } = filter
        const columnValue = row[excelColumns.indexOf(column)]
        console.log('FromApp.js:', columnValue)

        if (!excelColumns.includes(columnValue)) {
          // Ensure the columnValue and filterValue are treated as numbers
          const filterValue = parseFloat(value)
          const columnValueNum = parseFloat(columnValue)

          if (!isNaN(filterValue) && !isNaN(columnValueNum)) {
            switch (operator) {
              case '=':
                return columnValueNum === filterValue
              case '>':
                return columnValueNum > filterValue
              case '<':
                return columnValueNum < filterValue
              case '>=':
                return columnValueNum >= filterValue
              case '<=':
                return columnValueNum <= filterValue
              default:
                return true
            }
          } else {
            // Handle non-numeric values here (e.g., strings)
            const lowercasedColumnValue = columnValue.toLowerCase()
            const lowercasedFilterValue = value.toLowerCase()
            switch (operator) {
              case '=':
                return lowercasedColumnValue === lowercasedFilterValue
              default:
                return true
            }
          }
        }
        return true
      })
    })

    setFilteredExcelData(filteredData)
  }

  const toggleDarkTheme = () => {
    setDarkTheme(!darkTheme)
  }

  const closeAlert = () => {
    setShowAlert(false)
  }

  const handleFileSelect = file => {
    try {
      setFileSelected(true)
      setSelectedFile(file)
      readExcelFile(file, sheet => {
        const data = XLSX.utils.sheet_to_json(sheet, { header: 1 })
        setOriginalExcelData(data)
        setFilteredExcelData(data)
        const headers = XLSX.utils.sheet_to_json(sheet, { header: 1 })[0]
        setExcelColumns(headers)
      })
    } catch (error) {
      console.error('Error handling file select:', error)
    }
  }

  const handleColumnSelect = column => {
    try {
      setSelectedColumn(column)
      if (!selectedFile) {
        // Handle the case where no file is selected
        return
      }
      const selectedColumnIndex = excelColumns.findIndex(
        header => header === column
      )
      if (selectedColumnIndex !== -1) {
        const columnData = filteredExcelData
          .map(row => row[selectedColumnIndex])
          .filter(value => !excelColumns.includes(value))
        const uniqueValues = [...new Set(columnData)]
        const labels = uniqueValues
        const values = labels.map(
          label => columnData.filter(value => value === label).length
        )
        setLabels(labels)
        setValues(values)
      }
    } catch (error) {
      console.error('Error handling column select:', error)
    }
  }

  return (
    <>
      <Container
        fluid
        className={darkTheme ? 'dark-theme main-container' : 'main-container'}
      >
        {/* Header Part */}
        <Row>
          <Navbar
            bg='dark'
            data-bs-theme='dark'
            className='justify-content-center'
          >
            <div>
              <Navbar.Brand>
                Skills Matrix for Digital Thread Associates
              </Navbar.Brand>
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
                  <FixedPieChart
                    column={fixedCharts[0]}
                    data={originalExcelData}
                    excelColumns={excelColumns}
                    showLegend={true}
                  />
                </Col>
                <Col md={6}>
                  <FixedPieChart
                    column={fixedCharts[1]}
                    data={originalExcelData}
                    excelColumns={excelColumns}
                    showLegend={true}
                  />
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <FixedPieChart
                    column={fixedCharts[2]}
                    data={originalExcelData}
                    excelColumns={excelColumns}
                    showLegend={true}
                  />
                </Col>
                <Col md={6}>
                  <FixedPieChart
                    column={fixedCharts[3]}
                    data={originalExcelData}
                    excelColumns={excelColumns}
                    showLegend={true}
                  />
                </Col>
              </Row>
            </Container>
          </Col>

          {/* Options + 1 chart */}
          <Col md={4}>
            {/* File Upload */}
            <FileUpload
              onFileSelect={handleFileSelect}
              fileSelected={fileSelected}
            />
            {/* Filter Selection Dropdown */}
            {selectedColumn && labels.length > 0 && (
              <Card className='chart-container rounded-0'>
                <Card.Body>
                  <FilterDropdown
                    columns={excelColumns}
                    selectedColumn={selectedColumn}
                    labels={labels}
                    filters={filters}
                    onFilterSelect={handleFilterSelect}
                    onFilterRemove={handleFilterRemove}
                    data={filteredExcelData}
                    excelColumns={excelColumns}
                  />
                </Card.Body>
              </Card>
            )}
            {/* Column Selection */}
            {selectedFile && (
              <Card className='chart-container rounded-0'>
                <Card.Body>
                  <ColumnSelection
                    columns={excelColumns}
                    onColumnSelect={handleColumnSelect}
                  />
                </Card.Body>
              </Card>
            )}
            {/* Pie Chart */}
            {selectedColumn && labels.length > 0 && (
              <Card className='chart-container rounded-0'>
                <Card.Header>{selectedColumn}</Card.Header>
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
                  <div className='d-flex justify-content-between align-items-center'>
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

        {showAlert && (
          <Alert message={alertMessage} type={alertType} onClose={closeAlert} />
        )}
      </Container>
    </>
  )
}

export default App
