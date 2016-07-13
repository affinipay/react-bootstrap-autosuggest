<FormGroup controlId="numberInput">
  <ControlLabel>Pick a number</ControlLabel>
  <Autosuggest
    datalist={[1, 2, 3, 42, 100,
      { value: 'e', sortKey: 2.71828182846 },
      { value: 'π', sortKey: 3.14159265359 }]}
    placeholder="What is your favorite number?"
    addonBefore="=" />
</FormGroup>
