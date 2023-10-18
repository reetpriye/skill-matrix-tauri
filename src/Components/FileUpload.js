// FileUpload.js
import React from 'react';
import { Form, Card } from 'react-bootstrap';

function FileUpload({ onFileSelect }) {
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    onFileSelect(file);
  };

  return (
    <Card className="chart-container rounded-0">
      <Card.Body>
        <Form.Group controlId="formFileSm">
          <Form.Label>Select Input File</Form.Label>
          <Form.Control
            type="file"
            size="sm"
            accept=".xlsx"
            onChange={handleFileSelect}
          />
        </Form.Group>
      </Card.Body>
    </Card>
  );
}

export default FileUpload;