import React from 'react'
import { Form } from 'react-bootstrap'

const ColumnSelection = ({ columns, onColumnSelect }) => {
  return (
    <Form.Group className='d-flex align-items-center'>
      <Form.Label className='m-0' style={{ flexBasis: '50%' }}>
        Select a Column:
      </Form.Label>
      <Form.Select
        style={{ flexBasis: '50%' }}
        onChange={e => onColumnSelect(e.target.value)}
      >
        <option value=''>Choose a Column</option>
        {columns.map(col => (
          <option key={col} value={col}>
            {col}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  )
}

export default ColumnSelection
