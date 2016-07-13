import React from 'react'
import Anchor from './Anchor'

export default function PlaygroundSection() {
  return (
    <div>
      <h3><Anchor id="playground">Appendix: Live code editor</Anchor></h3>
      <p>
        All of the examples on this page are dynamically transpiled and rendered from
        code you can edit within the page itself. The code viewers are instances of
        the <a href="http://codemirror.net/">CodeMirror</a> text editor. Whenever the
        code changes, it is transformed from programmer-friendly ES2015/JSX to
        browser-friendly ES5 using the <a href="https://babeljs.io/">Babel</a> transpiler
        configured with the <code>es2015</code> and <code>react</code> presets and
        the <code>transform-object-rest-spread</code> plugin. The transpiled code is
        then rendered into the DOM by React in one of three ways:
      </p>
      <ul>
        <li>
          If the code appears to be a JSX snippet, which starts with <code>&lt;</code> and ends
          with <code>&gt;</code>, then it is evaluated as an expression and automatically rendered.
        </li>
        <li>
          Otherwise, the code is evaluated as arbitrary JavaScript statements. The final statement
          can optionally return a render function.
          <ul>
            <li>
              If a function is returned, it is called whenever the React state of its
              container changes. It is expected to return a React element, which will be
              automatically rendered. The remainder of the code is not re-evaluated when the
              state changes, so it can be used to provide constants to the render function.
            </li>
            <li>
              If the evaluated code does not return a function, it is expected to render itself
              using <code>ReactDOM.render</code> and the provided <code>mountNode</code>.
              The code is executed each time the React state of its container changes.
            </li>
          </ul>
        </li>
      </ul>
      <p>
        In all cases, at least the following symbols are injected into the scope of the
        evaluated code: <code>React</code>, <code>ReactDOM</code>, <code>mountNode</code>,
        and <code>Autosuggest</code>. Depending on the section, additional symbols may
        be injected, such as React-Bootstrap components, React state, or callback functions.
      </p>
    </div>
  )
}
