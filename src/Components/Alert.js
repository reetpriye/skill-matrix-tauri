import React from 'react';
import Alert from 'react-bootstrap/Alert';
import './Alert.css';

const CustomAlert = ({ message, type }) => {
  let variant = 'info';
  if (type === 'warning') {
    variant = 'warning';
  } else if (type === 'success') {
    variant = 'success';
  }

  return (
    <Alert variant={variant} className="custom-alert">
      {type === 'warning' && '⚠️'}
      {type === 'success' && '✅'}
      {type === 'info' && 'ℹ️'}
      <span className="message">{message}</span>
    </Alert>
  );
};

export default CustomAlert;