import React from 'react'
import {
  ControlLabel,
  FormControl,
  FormGroup
} from 'react-bootstrap'

export default function sizeSelect(props) {
  return (
    <FormGroup controlId="sizeSelect">
      <ControlLabel>Form/input group size</ControlLabel>
      <FormControl componentClass="select" {...props}>
        <option value="small">Small</option>
        <option value="">Medium</option>
        <option value="large">Large</option>
      </FormControl>
    </FormGroup>
  )
}
