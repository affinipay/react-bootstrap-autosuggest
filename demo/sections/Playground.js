// @flow

import { transform } from 'babel-standalone'
import shallowEqual from 'fbjs/lib/shallowEqual'
import React from 'react'
import { Alert, SafeAnchor } from 'react-bootstrap'
import ReactCodeMirror from 'react-codemirror'
import ReactDOM from 'react-dom'

import CodeMirror from 'codemirror'
import 'codemirror/mode/jsx/jsx'
import 'codemirror/addon/fold/foldcode'
import 'codemirror/addon/fold/foldgutter'
import 'codemirror/addon/fold/brace-fold'

import { prefold } from './CodeMirror-prefold'

import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'
import 'codemirror/addon/fold/foldgutter.css'

type Props = {
  code: string,
  codeFolding?: boolean,
  lineNumbers?: boolean,
  ribbonText?: string,
  scope: Object,
  showCode?: boolean
}

type State = {
  code: string,
  showCode: boolean
}

type UserFn = (scope: Object) => ?React.Element<*>

export default class Playground extends React.Component {
  static propTypes = {
    code: React.PropTypes.string.isRequired,
    codeFolding: React.PropTypes.bool,
    lineNumbers: React.PropTypes.bool,
    ribbonText: React.PropTypes.node,
    scope: React.PropTypes.object.isRequired,
    showCode: React.PropTypes.bool
  };

  state: State;

  _cachedUserFn: ?UserFn;

  constructor(props: Props, ...args: any) {
    super(props, ...args)
    this.state = {
      code: this.props.code,
      showCode: this.props.showCode || false
    }
    const self: any = this
    self._handleCodeMount = this._handleCodeMount.bind(this)
    self._handleCodeChange = this._handleCodeChange.bind(this)
    self._handleCodeReset = this._handleCodeReset.bind(this)
    self._handleCodeToggle = this._handleCodeToggle.bind(this)
  }

  componentDidMount() {
    this._transformAndExecuteCode(this.state.code)
  }

  shouldComponentUpdate(nextProps: Props, nextState: State): boolean {
    return !shallowEqual(this.props, nextProps) || !shallowEqual(this.state, nextState)
  }

  componentWillUpdate(nextProps: Props, nextState: State) {
    if (nextState.code !== this.state.code) {
      this._transformAndExecuteCode(nextState.code)
    } else if (nextProps.scope !== this.props.scope) {
      this._renderCode(this._buildScope(nextProps))
    }
  }

  componentWillUnmount() {
    const { mountNode, errorNode } = this.refs
    ReactDOM.unmountComponentAtNode(errorNode)
    ReactDOM.unmountComponentAtNode(mountNode)
  }

  render() {
    return (
      <div className="playground">
        {this._renderExample()}
        {this._renderToggle()}
        {this._renderReset()}
      </div>
    )
  }

  _renderExample() {
    return (
      <div className="example">
        <div className="mount-node" ref="mountNode" />
        {this._renderEditor()}
        <div className="error-node" ref="errorNode" />
      </div>
    )
  }

  _renderEditor() {
    if (!this.state.showCode) {
      return null
    }
    const options: Object = {
      extraKeys: {
        'Tab': false, // let focus go to next control
        'Shift-Tab': false, // let focus go to previous control
        'Alt-Tab': 'indentMore',
        'Shift-Alt-Tab': 'indentLess'
      },
      foldGutter: this.props.codeFolding,
      gutters: [],
      lineNumbers: this.props.lineNumbers,
      lineWrapping: false,
      matchBrackets: true,
      mode: 'jsx',
      readOnly: false,
      smartIndent: true,
      theme: 'material'
    }
    if (this.props.lineNumbers) {
      options.gutters.push('CodeMirror-linenumbers')
    }
    if (this.props.codeFolding) {
      options.gutters.push('CodeMirror-foldgutter')
    }
    const { ribbonText } = this.props
    return <div className="editor">
      {ribbonText && <div className="ribbon">{ribbonText}</div>}
      <ReactCodeMirror
        codeMirrorInstance={CodeMirror}
        ref={this._handleCodeMount}
        onChange={this._handleCodeChange}
        options={options}
        value={this.state.code}
      />
    </div>
  }

  _renderReset() {
    return this.state.code !== this.props.code ? (
      <SafeAnchor className="code-tab" onClick={this._handleCodeReset}>
        reset code
      </SafeAnchor>
    ) : null
  }

  _renderToggle() {
    return (
      <SafeAnchor className="code-tab" onClick={this._handleCodeToggle}>
        {this.state.showCode ? 'hide code' : 'show code'}
      </SafeAnchor>
    )
  }

  // autobind
  _handleCodeMount(ref: ReactCodeMirror) {
    if (ref && this.props.codeFolding) {
      prefold(ref.getCodeMirror())
    }
  }

  // autobind
  _handleCodeChange(value: string) {
    this.setState({ code: value })
  }

  // autobind
  _handleCodeReset() {
    this.setState({ code: this.props.code })
  }

  // autobind
  _handleCodeToggle() {
    this.setState({ showCode: !this.state.showCode })
  }

  _transformAndExecuteCode(code: string) {
    const { errorNode } = this.refs
    let transformedCode = null
    try {
      const scope = this._buildScope(this.props)
      const scopeKeys = Object.keys(scope).join(',')
      const isJSX = this._isJSX(code)
      let wrapperCode
      if (isJSX) {
        wrapperCode = `(({ ${scopeKeys} }) => ( ${code} ))`
      } else {
        wrapperCode = `(({ ${scopeKeys} }) => { ${code} })`
      }
      this._cachedUserFn = null
      transformedCode = transform(wrapperCode,
        {
          presets: ['es2015', 'react'],
          plugins: ['transform-object-rest-spread']
        }).code
      this._cachedUserFn = eval(transformedCode)
      let result = this._cachedUserFn(scope)
      // allow non-JSX to return a render function, to avoid recomputing constants
      // on each state change, which may cause unnecessary component re-rendering
      if (!isJSX && typeof result === 'function') {
        this._cachedUserFn = result
        result = this._cachedUserFn(scope)
      }
      if (result != null) {
        ReactDOM.render(result, this.refs.mountNode)
      }
      ReactDOM.unmountComponentAtNode(errorNode)
    } catch (err) {
      ReactDOM.unmountComponentAtNode(this.refs.mountNode)
      ReactDOM.render(
        <Alert bsStyle="danger">
          <pre>{err.toString()}</pre>
          {transformedCode && <pre>{transformedCode}</pre>}
        </Alert>,
        errorNode
      )
    }
  }

  _renderCode(scope: Object) {
    const { _cachedUserFn } = this
    if (_cachedUserFn != null) {
      const result = _cachedUserFn(scope)
      if (result != null) {
        ReactDOM.render(result, this.refs.mountNode)
      }
    }
  }

  _buildScope(props: Props): Object {
    const { mountNode } = this.refs
    return { ...props.scope, React, ReactDOM, mountNode }
  }

  _isJSX(code: string) {
    const trimmed = code.trim()
    return trimmed.startsWith('<') && trimmed.endsWith('>')
  }
}
