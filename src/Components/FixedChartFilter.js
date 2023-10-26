import React, { useEffect, useState } from 'react'
import { Form } from 'react-bootstrap'

const FixedChartFilter = ({ data, excelColumns, onExcelDataChange }) => {
  const [selectedColumn, setSelectedColumn] = useState('')
  const [selectedOperator, setSelectedOperator] = useState('=')
  const [selectedValue, setSelectedValue] = useState('')
  const [distinctValues, setDistinctValues] = useState([])
  const [columnDataType, setColumnDataType] = useState(null)
  const [excelData, setExcelData] = useState([])
  const [filterApplied, setFilterApplied] = useState(false)

  useEffect(() => {
    onExcelDataChange(excelData)
  }, [excelData])

  const handleColumnChange = e => {
    const selectedColumn = e.target.value
    setSelectedColumn(selectedColumn)

    if (selectedColumn) {
      const columnIndex = excelColumns.indexOf(selectedColumn)
      if (columnIndex !== -1) {
        const columnData = data.map(row => row[columnIndex])

        const dataType = determineDataType(columnData)
        setColumnDataType(dataType)

        const operatorOptions = getOperatorOptions(dataType)
        setSelectedOperator(operatorOptions[0])

        const distinctValuesSet = new Set()

        // Iterate over the columnData and add values to the Set if they are not in excelColumns
        for (const value of columnData) {
          distinctValuesSet.add(value)
        }

        const distinctValuesArray = Array.from(distinctValuesSet).sort()
        setDistinctValues(distinctValuesArray)
      }
    }
  }

  const determineDataType = data => {
    const isString = isNaN(data[data.length - 1])
    return isString ? 'string' : 'numeric'
  }

  const getOperatorOptions = dataType => {
    return dataType === 'string' ? ['='] : ['=', '>', '<', '>=', '<=']
  }

  const handleOperatorChange = e => {
    setSelectedOperator(e.target.value)
  }

  const handleValueChange = e => {
    setSelectedValue(e.target.value)
    handleAddFilter()
  }

  useEffect(() => {
    handleAddFilter()
  }, [selectedValue])

  const handleAddFilter = () => {
    if (data && selectedColumn && selectedOperator && selectedValue) {
      setFilterApplied(true)
      const filteredData = data.filter(row => {
        const columnValue = row[excelColumns.indexOf(selectedColumn)]

        if (!excelColumns.includes(columnValue)) {
          // Ensure the columnValue and filterValue are treated as numbers
          const filterValue = parseFloat(selectedValue)
          const columnValueNum = parseFloat(columnValue)

          if (!isNaN(filterValue) && !isNaN(columnValueNum)) {
            switch (selectedOperator) {
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
            const lowercasedFilterValue = selectedValue.toLowerCase()
            switch (selectedOperator) {
              case '=':
                return lowercasedColumnValue === lowercasedFilterValue
              default:
                return true
            }
          }
        }
        return true
      })
      console.log(
        '%cFixedChartFilter.js line:107 filteredData',
        'color: white; background-color: #007acc;',
        filteredData
      )
      setExcelData(filteredData)
    }
  }

  return (
    <Form.Group>
      <div className='d-flex'>
        <Form.Select
          className='select-dropdown me-2'
          style={{ flexBasis: '50%' }}
          onChange={handleColumnChange}
          value={selectedColumn}
          disabled={filterApplied}
        >
          <option value=''>Choose a Column</option>
          {excelColumns &&
            excelColumns.map(column => (
              <option key={column} value={column}>
                {column}
              </option>
            ))}
        </Form.Select>
        <Form.Select
          className='select-dropdown me-2'
          style={{ flexBasis: '20%' }}
          onChange={handleOperatorChange}
          value={selectedOperator}
          disabled={filterApplied}
        >
          {getOperatorOptions(columnDataType).map(operator => (
            <option key={operator} value={operator}>
              {operator}
            </option>
          ))}
        </Form.Select>
        <Form.Select
          className='select-dropdown me-2'
          style={{ flexBasis: '30%' }}
          onChange={handleValueChange}
          value={selectedValue}
          disabled={filterApplied}
        >
          <option value=''>Choose a Value</option>
          {distinctValues.map(value => (
            <option key={value} value={value}>
              {typeof value === 'number' ? parseFloat(value.toFixed(2)) : value}
            </option>
          ))}
        </Form.Select>
      </div>
    </Form.Group>
  )
}

export default FixedChartFilter
