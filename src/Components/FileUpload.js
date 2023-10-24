// FileUpload.js
import React from 'react'
import { Form, Card } from 'react-bootstrap'

function FileUpload({ onFileSelect, fileSelected }) {
  const handleFileSelect = e => {
    const file = e.target.files[0]
    onFileSelect(file)
  }

  return (
    <Card className='chart-container rounded-0'>
      <Card.Body>
        <Form.Group
          className='d-flex align-items-center'
          controlId='formFileSm'
        >
          <Form.Label className='m-0' style={{ flexBasis: '50%' }}>
            Select Input File
          </Form.Label>
          <Form.Control
            type='file'
            size='sm'
            accept='.xlsx'
            onChange={handleFileSelect}
            disabled={fileSelected}
          />
        </Form.Group>
      </Card.Body>
    </Card>
  )
}

export default FileUpload
