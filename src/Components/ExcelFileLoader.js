// src/components/ExcelFileLoader.js
import React, { useEffect, useState } from 'react'
import { invoke } from '@tauri-apps/api/tauri'

const ExcelFileLoader = () => {
  const [fileData, setFileData] = useState(null)

  const fixedFilePath = 'C:/Path/To/Fixed/Location/file.xlsx'

  async function checkFixedLocation() {
    try {
      const response = await invoke('file_exists', { path: fixedFilePath })

      if (response.exists) {
        const data = await readExcelFile(fixedFilePath)
        setFileData(data)
      } else {
        selectExcelFile()
      }
    } catch (error) {
      console.error('Error checking the fixed location:', error)
    }
  }

  async function readExcelFile() {
    // Implement code to read Excel file (using a library like xlsx)
    // Return data from the Excel file
  }

  async function selectExcelFile() {
    try {
      const response = await invoke('open_file_dialog', {
        filters: [{ name: 'Excel Files', extensions: ['xlsx'] }]
      })

      if (!response.canceled) {
        const selectedFilePath = response.path
        const data = await readExcelFile(selectedFilePath)
        setFileData(data)
      }
    } catch (error) {
      console.error('Error selecting Excel file:', error)
    }
  }

  useEffect(() => {
    checkFixedLocation()
  }, [])

  return (
    <div>
      {fileData ? (
        // Display pie charts using the data
        // Implement pie chart rendering here
        <div> </div>
      ) : (
        // Render UI elements for file selection or other instructions
        <div>
          <p>Please select an Excel file.</p>
          {/* You can add a button or user interface elements to trigger file selection */}
          <button onClick={selectExcelFile}>Select Excel File</button>
        </div>
      )}
    </div>
  )
}

export default ExcelFileLoader
