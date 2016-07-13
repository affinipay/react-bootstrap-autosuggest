import React from 'react'
import { Alert } from 'react-bootstrap'
import Autosuggest from 'react-bootstrap-autosuggest'
import Anchor from './Anchor'
import Playground from './Playground'
const NamePrefix = require('raw!../examples/NamePrefix').trim()

const scope = { Autosuggest }

export default function BasicSection() {
  return (
    <div>
      <h3><Anchor id="basic">Basic usage</Anchor></h3>
      <p>
        In its most basic usage, <code>&lt;Autosuggest&gt;</code> acts like an
        <code>&lt;input&gt;</code> combined with a
        <a href="https://www.w3.org/TR/html5/forms.html#the-datalist-element"><code>&lt;datalist&gt;</code></a>
        (introduced in HTML5 but not yet supported by all browsers).
        The user is free to type any value, but a drop-down menu is available
        that will suggest predefined options containing the input text.
      </p>
      <p>
        In this <a href="http://notes.ericwillis.com/2009/11/common-name-prefixes-titles-and-honorifics/">name prefix</a> example,
        typing <kbd>m</kbd> will suggest completions of "Mr.", "Mrs.", or "Ms.",
        though you are still free to type less common prefixes like "Maj." or "Msgr.".
        Standard <code>&lt;input&gt;</code> attributes like <code>placeholder</code> are
        propagated to the underlying input element.
      </p>
      <Playground code={NamePrefix} scope={scope} showCode={true}
        ribbonText={<a href="#playground">Edit Me!</a>} />
      <Alert bsStyle="info">
        For instructions on installing and importing Autosuggest within your project,
        see the <a href="https://github.com/affinipay/react-bootstrap-autosuggest/README.md">README</a>.
      </Alert>
      <p>
        Note that just like a React input element, an Autosuggest without a <code>value</code> property is
        an <a href="https://facebook.github.io/react/docs/forms.html#uncontrolled-components">uncontrolled component</a>.
        It starts off with an empty value and immediately reflects any user input.
        To listen to updates on the value, use the <code>onChange</code> event, as
        is done with <a href="https://facebook.github.io/react/docs/forms.html#controlled-components">controlled components</a>.
      </p>
    </div>
  )
}
