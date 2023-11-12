import React from 'react'
import { Form, Card } from 'react-bootstrap'

const FileUpload = ({ onFileSelect, isFileSelected, isFileFound }) => {
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
            {isFileFound ? 'Change Input File' : 'Select Input File1'}
          </Form.Label>
          <Form.Control
            style={{ flexBasis: '50%' }}
            type='file'
            size='sm'
            accept='.xlsx'
            onChange={handleFileSelect}
            disabled={isFileSelected}
          />
        </Form.Group>
      </Card.Body>
    </Card>
  )
}

export default FileUpload
