import 'es5-shim/es5-shim'
import 'es5-shim/es5-sham'
import 'babel-polyfill'

import React from 'react'
import { Nav, Navbar, NavItem } from 'react-bootstrap'
import ReactDOM from 'react-dom'

import BasicSection from './sections/BasicSection'
import ReactBootstrapSection from './sections/ReactBootstrapSection'
import NonStringSection from './sections/NonStringSection'
import ItemAdapterSection from './sections/ItemAdapterSection'
import ItemsAsValuesSection from './sections/ItemsAsValuesSection'
import ListAdapterSection from './sections/ListAdapterSection'
import MultipleSection from './sections/MultipleSection'
import DynamicSection from './sections/DynamicSection'
import PlaygroundSection from './sections/PlaygroundSection'

import 'demo.scss'

ReactDOM.render(
  <div>
    <Navbar fluid staticTop className="navbar-autosuggest">
      <Navbar.Header>
        <Navbar.Toggle />
        <img className="logo" src={'images/logo.png'} />
        <div className="titles">
          <div className="title">
            <span className="secondary">react bootstrap </span>
            <br className="visible-xxs-inline" />
            <span className="primary">autosuggest</span>
          </div>
          <div className="subtitle">
            A modern <a href="https://en.wikipedia.org/wiki/Combo_box">combo-box</a>{' '}
            <br className="visible-xxs-inline" />
            built for <a href="https://facebook.github.io/react/">React</a>{' '}
            and <a href="http://getbootstrap.com/">Bootstrap</a>
          </div>
        </div>
      </Navbar.Header>
      <Navbar.Collapse>
        <Nav activeKey={1}>
          <NavItem eventKey={1} href="#">Examples</NavItem>
          <NavItem eventKey={2} href="https://github.com/affinipay/react-bootstrap-autosuggest">Source</NavItem>
          <NavItem eventKey={3} href="https://github.com/affinipay/react-bootstrap-autosuggest/tree/master/apidocs/Autosuggest.md">Documentation</NavItem>
          <NavItem eventKey={4} href="https://github.com/affinipay/react-bootstrap-autosuggest/issues">Issues</NavItem>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
    <div className="container">
      <BasicSection />
      <ReactBootstrapSection />
      <NonStringSection />
      <ItemAdapterSection />
      <ItemsAsValuesSection />
      <ListAdapterSection />
      <MultipleSection />
      <DynamicSection />
      <PlaygroundSection />
    </div>
    <div className="footer">
      Licensed under the <a href="https://en.wikipedia.org/wiki/ISC_license">ISC license</a> by <a href="https://affinipay.com/partners/">AffiniPay</a>
      &nbsp;| <a href="https://github.com/affinipay/react-bootstrap-autosuggest">GitHub</a>
      &nbsp;&middot; <a href="https://github.com/affinipay/react-bootstrap-autosuggest/issues">Issues</a>
      &nbsp;&middot; <a href="https://github.com/affinipay/react-bootstrap-autosuggest/releases">Releases</a>
    </div>
  </div>,
  document.getElementById('app')
)
