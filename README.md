# react-bootstrap-autosuggest

`react-bootstrap-autosuggest` is a [ReactJS](https://facebook.github.io/react/) component that provides a [combo-box](https://en.wikipedia.org/wiki/Combo_box) input control styled using [Bootstrap](http://getbootstrap.com/). It is both inspired by and depends upon [`react-bootstrap`](https://react-bootstrap.github.io/).

See the [live demo](https://affinipay.github.io/react-bootstrap-autosuggest/) on the home page.

## Getting started

Install `react-bootstrap-autosuggest` using npm:

    npm install react-bootstrap-autosuggest --save

Import the CommonJS module (which has been transpiled to ES3-compatible form using [Babel](https://babeljs.io/)):

    import Autosuggest from 'react-bootstrap-autosuggest'

Alternatively, load the minified UMD (Universal Module Definition) build:

    <script src="path-to-dist/react-bootstrap-autosuggest.min.js"></script>

Note that the required CSS styles (in addition to Bootstrap) are included automatically for either build. The CommonJS module executes `require('Autosuggest.scss')`, which requires that you configure the appropriate [Sass](http://sass-lang.com/) loader (such as [Webpack](https://webpack.github.io/)'s [sass-loader](https://github.com/jtangelder/sass-loader)) in your application build. The UMD build uses an embedded stylesheet and Webpack's [style-loader](https://github.com/webpack/style-loader) to automatically inject a `<style>` tag into the document head.

## Motivation

There are many auto-complete&thinsp;/&thinsp;auto-suggest&thinsp;/&thinsp;combo-box&thinsp;/&thinsp;enhanced-select input controls out there. However, I could not find any that met all of my requirements:

* **True combo-box**: Combines a drop-down list and a single-line editable text box (not just a search box). The final input value need not come from a list of options (though optionally it may be required to). The user is free to enter any value, and the developer need not employ workarounds (like continually adding the current input value to the list of options) to achieve this.
* **React**: Available as a ReactJS component that does not depend on other frameworks, such as jQuery.
* **Bootstrap**: Supports full Bootstrap styling (including input group add-ons and sizing, validation states, and feedback icons).
* **Dynamic**: Supports dynamically loading suggested values based on the current input value.
* **Multi-select**: Supports selecting multiple values.
* **Accessible**: Provides keyboard accessibility and compatibility with assistive technologies.
* Production ready and actively maintained.

## Supported browsers

`react-bootstrap-autosuggest` aims to support all modern desktop and mobile browsers. Despite some incomplete work to support IE 8, only IE 9+ are expected to work. If you find a browser-specific problem, please [report](https://github.com/affinipay/react-bootstrap-autosuggest/issues/new) it along with any code necessary to reproduce it. For visual/layout issues, please [attach](https://help.github.com/articles/file-attachments-on-issues-and-pull-requests/) an image of the issue.

## Support

Please use [GitHub issues](https://github.com/affinipay/react-bootstrap-autosuggest/issues) for bug reports or feature requests. For usage questions, please use [Stack Overflow](http://stackoverflow.com/) to [ask a question with the `rbs-autosuggest` tag](http://stackoverflow.com/questions/ask?tags=rbs-autosuggest).

## Contributions

Contributions in the form of [GitHub pull requests](https://github.com/affinipay/react-bootstrap-autosuggest/pulls) are welcome. Please adhere to the following guidelines:

* Before embarking on a significant change, please create an issue to discuss the proposed change and ensure that it is likely to be merged.
* Follow the coding conventions used throughout the project, including 2-space indentation and no unnecessary semicolons. Many conventions are enforced using `eslint`.
* Include unit tests for any new code. This project maintains 100% code coverage.
* Any contributions must be licensed under the ISC license.

## License

`react-bootstrap-autosuggest` is available under the [ISC license](LICENSE).
