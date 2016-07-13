import React from 'react'
import {
  ControlLabel,
  FormControl,
  FormGroup
} from 'react-bootstrap'

export default function ValidationSelect(props) {
  return (
    <FormGroup controlId="validationSelect">
      <ControlLabel>Validation state</ControlLabel>
      <FormControl componentClass="select" {...props}>
        <option value="">Default</option>
        <option value="success">Success</option>
        <option value="warning">Warning</option>
        <option value="error">Error</option>
      </FormControl>
    </FormGroup>
  )
}
