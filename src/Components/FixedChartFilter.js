// FixedChartFilter.js
import React, { useEffect, useState } from 'react'
import { Form } from 'react-bootstrap'

function FixedChartFilter({ columns, data, onFilterSelect }) {
  const [selectedColumn, setSelectedColumn] = useState('')
  const [selectedOperator, setSelectedOperator] = useState('=')
  const [selectedValue, setSelectedValue] = useState('')
  const [distinctValues, setDistinctValues] = useState([])
  const [columnDataType, setColumnDataType] = useState(null)
  const [chartData, setChartData] = useState({ labels: [], values: [] })
  const [excelData, setExcelData] = useState([])

  useEffect(() => {
    setExcelData(data)
  }, [data])

  const handleFileSelect = file => {
    try {
      setSelectedFile(file)
      readExcelFile(file, sheet => {
        const data = XLSX.utils.sheet_to_json(sheet, { header: 1 })
        setOriginalExcelData(data)
        setFilteredExcelData(data)
        const headers = XLSX.utils.sheet_to_json(sheet, { header: 1 })[0]
        setExcelColumns(headers)
        const columnsToFetch = fixedCharts

        columnsToFetch.forEach(column => {
          const selectedColumnIndex = headers.findIndex(
            header => header === column
          )
          if (selectedColumnIndex !== -1) {
            const columnData = XLSX.utils.sheet_to_json(sheet, {
              header: 1,
              raw: true,
              range: 1
            })
            const labels = []
            const values = {}

            columnData.forEach(row => {
              const value = row[selectedColumnIndex]
              if (!excelColumns.includes(value)) {
                if (values[value]) {
                  values[value]++
                } else {
                  values[value] = 1
                  labels.push(value)
                }
              }
            })

            const valueArray = labels.map(label => values[label])
            if (column === 'Active Skill#1') {
              setSkillData({ labels, values: valueArray })
            } else if (column === 'Role') {
              setRoleData({ labels, values: valueArray })
            } else if (column === 'Country') {
              setCountryData({ labels, values: valueArray })
            } else if (column === 'Grade') {
              setGradeData({ labels, values: valueArray })
            }
          }
        })
      })
    } catch (error) {
      console.error('Error handling file select:', error)
    }
  }

  // const handleFilterSelectFC = (filter, columnName) => {
  //   console.log('Filter: ', filter)
  //   console.log('Column Name: ', columnName)
  //   const filteredData = excelData.filter(row => {
  //     const { column, operator, value } = filter
  //     const columnValue = row[excelColumns.indexOf(column)]

  //     if (!excelColumns.includes(columnValue)) {
  //       // Ensure the columnValue and filterValue are treated as numbers
  //       const filterValue = parseFloat(value)
  //       const columnValueNum = parseFloat(columnValue)

  //       if (!isNaN(filterValue) && !isNaN(columnValueNum)) {
  //         switch (operator) {
  //           case '=':
  //             return columnValueNum === filterValue
  //           case '>':
  //             return columnValueNum > filterValue
  //           case '<':
  //             return columnValueNum < filterValue
  //           case '>=':
  //             return columnValueNum >= filterValue
  //           case '<=':
  //             return columnValueNum <= filterValue
  //           default:
  //             return true
  //         }
  //       } else {
  //         // Handle non-numeric values here (e.g., strings)
  //         const lowercasedColumnValue = columnValue.toLowerCase()
  //         const lowercasedFilterValue = value.toLowerCase()
  //         switch (operator) {
  //           case '=':
  //             return lowercasedColumnValue === lowercasedFilterValue
  //           default:
  //             return true
  //         }
  //       }
  //     }
  //     return true
  //   })
  //   setExcelData(filteredData)
  // }

  const handleColumnChange = e => {
    const selectedColumn = e.target.value
    setSelectedColumn(selectedColumn)

    if (selectedColumn) {
      const columnIndex = columns.indexOf(selectedColumn)
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
    console.log(e.target.value)
    setSelectedValue(e.target.value)
  }

  const handleAddFilter = () => {
    // setFilterApplied(true)
    console.log(
      '%cFixedChartFilter.js line:60 selectedColumn',
      'color: white; background-color: #007acc;',
      selectedColumn
    )
    console.log(
      '%cFixedChartFilter.js line:60 selectedOperator',
      'color: white; background-color: #007acc;',
      selectedOperator
    )
    console.log(
      '%cFixedChartFilter.js line:60 selectedValue',
      'color: white; background-color: #007acc;',
      selectedValue
    )
    if (selectedColumn && selectedValue && selectedValue) {
      onFilterSelect({
        column: selectedColumn,
        operator: selectedOperator,
        value: selectedValue
      })
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
          // disabled={filterApplied}
        >
          <option value=''>Choose a Column</option>
          {columns.map(column => (
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
          // disabled={filterApplied}
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
          // disabled={filterApplied}
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
