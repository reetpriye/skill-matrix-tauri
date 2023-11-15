import React, { useState, useEffect } from 'react'
import { invoke } from '@tauri-apps/api/tauri'
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
import CustomAlert from './Components/CustomAlert'

library.add(faSun, faMoon)

const App = () => {
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
  const [isFileSelected, setIsFileSelected] = useState(false)
  const [isFileFound, setIsFileFound] = useState(false)
  const [fixedChartPositions, setFixedChartPositions] = useState([3, 4, 5, 6])

  useEffect(() => {
    findExcelFromFixedLocation()
  }, [])

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

  const resetAppState = () => {
    setAlertMessage('')
    setAlertType('')
    setShowAlert(false)
    setSelectedFile(null)
    setSelectedColumn(null)
    setExcelColumns([])
    setDarkTheme(false)
    setFilters([])
    setOriginalExcelData([])
    setFilteredExcelData([])
    setLabels([])
    setValues([])
    setIsFileSelected(false)
    setIsFileFound(false)
    setFixedChartPositions([3, 4, 5, 6])
  }

  const fixedCharts = fixedChartPositions.map(
    position => excelColumns[position - 1]
  )

  const handleDropdownChange = (index, value) => {
    const updatedPositions = [...fixedChartPositions]
    updatedPositions[index] = parseInt(value)
    setFixedChartPositions(updatedPositions)
  }

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
        'danger'
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
            const lowercasedColumnValue =
              typeof columnValue === 'string'
                ? columnValue.toLowerCase()
                : columnValue
            const lowercasedFilterValue =
              typeof value === 'string' ? value.toLowerCase() : value
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

  const findExcelFromFixedLocation = async () => {
    if (isFileFound) return
    const filePath = 'C:/SkillMatrix/SkillMatrixDT.xlsx'
    try {
      const fileExists = await invoke('file_exists', { path: filePath })
      if (fileExists) {
        setIsFileFound(true)
        const readFileResponse = await invoke('read_excel_file', {
          path: filePath
        })
        setSelectedFile(readFileResponse)
        const workbook = XLSX.read(readFileResponse, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const sheet = workbook.Sheets[sheetName]
        const data = XLSX.utils.sheet_to_json(sheet, { header: 1 })
        setOriginalExcelData(data)
        setFilteredExcelData(data)
        const headers = XLSX.utils.sheet_to_json(sheet, { header: 1 })[0]
        setExcelColumns(headers)
        showAlertMessage(`Data loaded from ${filePath}`, 'success')
      }
    } catch (err) {
      console.log(err)
      showAlertMessage(`File not found at ${filePath}`, 'danger')
    }
  }

  const handleFileSelect = file => {
    try {
      resetAppState()
      if (file) {
        setIsFileSelected(true)
        setSelectedFile(file)

        const reader = new FileReader()
        reader.onload = e => {
          const eTargetData = e.target.result
          const workbook = XLSX.read(eTargetData, { type: 'array' })
          const sheetName = workbook.SheetNames[0]
          const sheet = workbook.Sheets[sheetName]
          const data = XLSX.utils.sheet_to_json(sheet, { header: 1 })
          setOriginalExcelData(data)
          setFilteredExcelData(data)
          const headers = XLSX.utils.sheet_to_json(sheet, { header: 1 })[0]
          setExcelColumns(headers)
        }
        reader.readAsArrayBuffer(file)
      }
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
                Skill Matrix for Digital Thread Associates
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
                    legendColor={darkTheme ? '#fff' : '#000'}
                    column={fixedCharts[0]}
                    data={originalExcelData}
                    excelColumns={excelColumns}
                    showLegend={true}
                  />
                </Col>
                <Col md={6}>
                  <FixedPieChart
                    legendColor={darkTheme ? '#fff' : '#000'}
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
                    legendColor={darkTheme ? '#fff' : '#000'}
                    column={fixedCharts[2]}
                    data={originalExcelData}
                    excelColumns={excelColumns}
                    showLegend={true}
                  />
                </Col>
                <Col md={6}>
                  <FixedPieChart
                    legendColor={darkTheme ? '#fff' : '#000'}
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
              isFileSelected={isFileSelected}
              isFileFound={isFileFound}
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
                  <PieChart
                    legendColor={darkTheme ? '#fff' : '#000'}
                    data={{ labels, values }}
                    showLegend={true}
                  />
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>

        {/* Footer Part */}
        <Row>
          <Col className='p-0 mt-4'>
            <div className='bg-dark text-white d-flex justify-content-between px-2'>
              <Button
                onClick={toggleDarkTheme}
                style={{ height: '2.5rem' }}
                className='rounded-0 border-0'
                variant={darkTheme ? 'light' : 'dark'}
              >
                <div className='d-flex justify-content-between align-items-center'>
                  <p className='m-0' style={{ fontSize: '0.9rem' }}>
                    Toggle theme
                  </p>
                  <div className='px-2'>
                    <FontAwesomeIcon icon={darkTheme ? 'sun' : 'moon'} />
                  </div>
                </div>
              </Button>
              <div className='d-flex align-items-center'>
                <div className='mx-2'>
                  <p style={{ fontSize: '0.9rem' }}>
                    Change fixed chart columns:{' '}
                  </p>
                </div>
                {fixedChartPositions.map((position, index) => (
                  <div key={index} className='mx-1'>
                    <select
                      className='form-control bg-dark text-white rounded-0 small-select'
                      value={position}
                      onChange={e =>
                        handleDropdownChange(index, e.target.value)
                      }
                    >
                      {excelColumns.map((column, idx) => (
                        <option key={idx} value={idx + 1}>
                          {idx + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </Col>
        </Row>

        {showAlert && (
          <CustomAlert
            message={alertMessage}
            variant={alertType}
            onClose={closeAlert}
          />
        )}
      </Container>
    </>
  )
}

export default App
