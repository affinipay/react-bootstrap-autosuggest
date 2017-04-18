import React from 'react'
import { ControlLabel, FormGroup } from 'react-bootstrap'
import Autosuggest from 'react-bootstrap-autosuggest'
import Anchor from './Anchor'
import Playground from './Playground'
const Number = require('raw-loader!../examples/Number').trim()

const scope = { Autosuggest, ControlLabel, FormGroup }

export default function NonStringSection() {
  return (
    <div>
      <h3><Anchor id="nonstring">Non-string options</Anchor></h3>

      <p>
        The items in the <code>datalist</code> property need not be strings.
        Numeric items are supported natively, as well as objects with particular
        property names. (Arbitrary objects are also supported by specifying
        the relevant property names or providing an <a href="#item-adapter">item adapter</a>,
        both of which are discussed in the next section.) This example also demonstrates
        the Bootstrap feature of input group add-ons.
      </p>

      <Playground code={Number} scope={scope} />
    </div>
  )
}
