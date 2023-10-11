// FileUpload.js
import React from 'react';

function FileUpload({ onFileSelect }) {
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    onFileSelect(file);
  };

  return (
    <input type="file" accept=".xlsx" onChange={handleFileSelect} />
  );
}

export default FileUpload;
