<FormGroup controlId="browserInput"
    bsSize={bsSize} validationState={validationState}>
  <ControlLabel>Browser</ControlLabel>
  <Autosuggest
    datalist={['Chrome', 'Firefox', 'Internet Explorer', 'Opera', 'Safari']}
    placeholder="What browser do you use?"
    value={browser}
    onChange={onChange}
    bsSize={bsSize} />
  {validationState && <FormControl.Feedback />}
  {validationState && <HelpBlock>Please select a browser</HelpBlock>}
</FormGroup>
