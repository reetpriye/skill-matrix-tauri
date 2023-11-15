import React from 'react'
import Alert from 'react-bootstrap/Alert'

const CustomAlert = ({ message, variant }) => {
  return (
    <Alert variant={variant} className='custom-alert'>
      {variant === 'danger' && '⚠️'}
      {variant === 'success' && '✅'}
      {variant === 'info' && 'ℹ️'}
      <span className='message'>{message}</span>
    </Alert>
  )
}

export default CustomAlert
