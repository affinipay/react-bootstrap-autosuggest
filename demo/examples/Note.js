// import Autosuggest, { ListAdapter } from 'react-bootstrap-autosuggest'

class NoteListAdapter extends ListAdapter {
  getLength(s) {
    return s.length
  }
  toArray(s) {
    return [...s].map((e, i) => ({
      key: i,
      value: e !== '#' ? e : s[i - 1] + '#'
    }))
  }
}
NoteListAdapter.instance = new NoteListAdapter()

return function render() {
  return <FormGroup controlId="noteInput">
    <ControlLabel>Pick a note</ControlLabel>
    <Autosuggest
      datalist="A#BC#D#EF#G#"
      datalistAdapter={NoteListAdapter.instance}
      datalistOnly
      closeOnCompletion
      placeholder="What is your favorite musical note?" />
  </FormGroup>
}
