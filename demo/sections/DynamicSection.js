import shallowEqual from 'fbjs/lib/shallowEqual'
import React from 'react'
import {
  ControlLabel,
  FormControl,
  FormGroup,
  Glyphicon
} from 'react-bootstrap'
import Autosuggest, { ItemAdapter } from 'react-bootstrap-autosuggest'
import Anchor from './Anchor'
import Playground from './Playground'
const GithubRepo = require('raw!../examples/GithubRepo').trim()

export default class DynamicSection extends React.Component {
  constructor(...args) {
    super(...args)
    this.state = {
      repo: '',
      repos: null,
      reposMessage: null,
      reposMore: null
    }
    this.setState = this.setState.bind(this)
  }

  shouldComponentUpdate(nextProps: Object, nextState: Object) {
    return !shallowEqual(this.props, nextProps) || !shallowEqual(this.state, nextState)
  }

  render() {
    return (
      <div>
        <h3><Anchor id="dynamic">Dynamic datalists</Anchor></h3>
        <p>
          All of the preceding examples use static datalists, which do not change
          while the component is mounted. However, changing the datalist at any time
          is fully supported. Furthermore, there are several features specifically
          intended to support dynamic datalists.
        </p>
        <h5><Anchor id="onsearch"><code>onSearch</code> event</Anchor></h5>
        <p>
          Autosuggest provides the <code>onSearch</code> event to allow the application
          to update the datalist based on user input. It is called periodically as the
          input value changes. The <code>searchDebounce</code> property, expressed in
          milliseconds, controls how frequently the <code>onSearch</code> event may be
          fired.
        </p>
        <h5><Anchor id="datalist-message">Datalist message</Anchor></h5>
        <p>
          The <code>datalistMessage</code> property, when defined, is a message displayed at the
          end of the drop-down menu of suggestions. It can be used for several purposes, such as
          indicating that the datalist is being fetched asynchronously, that an error occurred
          fetching the datalist, or that more suggestions are available to be fetched.
          If the <code>onDatalistMessageSelect</code> property is also defined, it causes the
          datalist message to become selectable and specifies a callback function to be
          invoked when it is selected. This feature is particularly useful for fetching
          additional suggestions.
        </p>
        <h5><Anchor id="datalist-partial">Partial datalists</Anchor></h5>
        <p>
          By default, Autosuggest assumes that the datalist represents the entire set of valid
          options when <code>datalistOnly</code> is true. However, a common use for dynamic
          datalists is fetching a subset of a very large collection of options from a server.
          In these cases, the <code>datalistPartial</code> boolean property should be set.
          It causes Autosuggest to consider a value not in the datalist valid if either of
          the following are true:
        </p>
        <ul>
          <li>The value came from the <code>value</code> or <code>defaultValue</code> property.</li>
          <li>The value was selected from a previous datalist.</li>
        </ul>
        <Playground
          code={GithubRepo}
          codeFolding
          lineNumbers
          scope={{
            Autosuggest,
            ItemAdapter,
            ControlLabel,
            FormControl,
            FormGroup,
            Glyphicon,
            state: this.state,
            setState: this.setState
          }} />
      </div>
    )
  }
}
