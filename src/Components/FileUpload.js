// FileUpload.js
import React from 'react';
import Form from 'react-bootstrap/Form';

function FileUpload({ onFileSelect }) {
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    onFileSelect(file);
  };

  return (
    <>
      <Form.Group controlId="formFileSm">
        <Form.Label>Select Input File</Form.Label>
        <Form.Control type="file" size="sm" accept=".xlsx" onChange={handleFileSelect} />
      </Form.Group>
    </>
  );
}

export default FileUpload;
