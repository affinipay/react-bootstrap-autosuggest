// @flow

import classNames from 'classnames'
import shallowEqual from 'fbjs/lib/shallowEqual'
import keycode from 'keycode'
import PropTypes from 'prop-types'
import React from 'react'
import ReactDOM from 'react-dom'
import type { Node } from './types'

export default class Choices extends React.Component {
  static propTypes = {
    autoHeight: PropTypes.bool,
    disabled: PropTypes.bool,
    focused: PropTypes.bool,
    inputValue: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.any).isRequired,
    onKeyPress: PropTypes.func,
    onRemove: PropTypes.func,
    renderItem: PropTypes.func.isRequired
  };

  props: {
    autoHeight?: boolean;
    children?: Node | Node[];
    disabled?: boolean;
    focused?: boolean;
    inputValue: string;
    items: any[];
    onKeyPress?: (event: SyntheticKeyboardEvent) => void;
    onRemove?: (index: number) => void;
    renderItem: (item: any) => Node;
  };

  state: {
  };

  constructor(...args: any) {
    super(...args)
    /* istanbul ignore next: https://github.com/gotwarlost/istanbul/issues/690#issuecomment-265718617 */
    const self: any = this // https://github.com/facebook/flow/issues/1517
    self._handleKeyDown = this._handleKeyDown.bind(this)
    self._handleKeyPress = this._handleKeyPress.bind(this)
    self._handleClose = this._handleClose.bind(this)
    self._handleClick = this._handleClick.bind(this)
    self._focusInput = this._focusInput.bind(this)
  }

  shouldComponentUpdate(nextProps: Object) {
    return !shallowEqual(this.props, nextProps)
  }

  render() {
    const { autoHeight, disabled, focused, inputValue, items, renderItem, children } = this.props
    const hasItems = items.length > 0
    let inputStyle
    if (hasItems) {
      // guesstimate input width since inline-block container
      // won't allow it to expand automatically
      inputStyle = { width: ((inputValue.length + 1) * 0.75) + 'em' }
    }
    return (
      <ul className={classNames(
          'form-control', 'autosuggest-choices', {
            focused,
            'has-items': hasItems,
            'auto-height': autoHeight
          })}
          disabled={disabled}
          onClick={this._focusInput}>
        {items.map((item, index) =>
          <li key={index} data-index={index}
            tabIndex={!disabled ? '-1' : undefined}
            className="autosuggest-choice"
            onKeyDown={this._handleKeyDown}
            onKeyPress={this._handleKeyPress}>
            <span className="autosuggest-choice-close"
              onClick={this._handleClose} />
            <span className="autosuggest-choice-label"
              onClick={this._handleClick} >
              {renderItem(item)}
            </span>
          </li>)}
        <li className="autosuggest-input-choice" style={inputStyle}>
          {children}
        </li>
      </ul>
    )
  }

  // autobind
  _handleKeyDown(event: SyntheticKeyboardEvent) {
    switch (event.keyCode) {
    case keycode.codes.left:
      this._focusPrevious()
      event.preventDefault()
      break
    case keycode.codes.right:
      this._focusNext()
      event.preventDefault()
      break
    case keycode.codes.backspace:
      this._removeActive(-1)
      event.preventDefault()
      break
    case keycode.codes.delete:
      this._removeActive(0)
      event.preventDefault()
      break
    }
  }

  // autobind
  _handleKeyPress(event: SyntheticKeyboardEvent) {
    // Chrome and Safari lets the input accept the key, Firefox does not
    this._focusInput()

    const { onKeyPress } = this.props
    // istanbul ignore else
    if (onKeyPress) {
      onKeyPress(event)
    }
  }

  // autobind
  _handleClose(event: SyntheticEvent) {
    if (!this.props.disabled && event.target instanceof HTMLElement) {
      const choices = event.target.parentNode
      // istanbul ignore else
      if (choices instanceof Element) {
        const index = Number(choices.getAttribute('data-index'))
        this._remove(index)
      }
    }
    event.stopPropagation()
  }

  // autobind
  _handleClick(event: SyntheticEvent) {
    event.stopPropagation()
  }

  focusFirst() {
    const items = this._getFocusableMenuItems(false)
    if (items.length > 0) {
      items[0].focus()
    }
  }

  focusLast() {
    const items = this._getFocusableMenuItems(false)
    if (items.length > 0) {
      items[items.length - 1].focus()
    }
  }

  _focusPrevious() {
    const { items, activeIndex } = this._getItemsAndActiveIndex(true)
    // istanbul ignore else: currently input handles wrap-around
    if (activeIndex > 0) {
      items[activeIndex - 1].focus()
    } else if (items.length > 0) {
      items[items.length - 1].focus()
    }
  }

  _focusNext() {
    const { items, activeIndex } = this._getItemsAndActiveIndex(true)
    // istanbul ignore else: currently input handles wrap-around
    if (activeIndex < items.length - 1) {
      items[activeIndex + 1].focus()
    } else if (items.length > 0) {
      items[0].focus()
    }
  }

  // autobind
  _focusInput() {
    const node = ReactDOM.findDOMNode(this)
    // istanbul ignore else
    if (node instanceof Element) {
      const input = node.querySelector('input')
      // istanbul ignore else
      if (input) {
        input.focus()
      }
    }
  }

  _remove(index: number) {
    const { onRemove } = this.props
    // istanbul ignore else
    if (onRemove) {
      onRemove(index)
    }
  }

  _removeActive(focusAdjust: number) {
    const { items, activeIndex } = this._getItemsAndActiveIndex(false)
    // istanbul ignore else
    if (activeIndex >= 0) {
      let nextIndex = activeIndex + focusAdjust
      if (nextIndex < 0 || nextIndex >= items.length - 1) {
        this._focusInput()
      } else if (focusAdjust != 0) {
        items[nextIndex].focus()
      }
      this._remove(activeIndex)
    }
  }

  _getItemsAndActiveIndex(includeInput: boolean): { items: HTMLElement[], activeIndex: number } {
    const items = this._getFocusableMenuItems(includeInput)
    const activeElement = document.activeElement
    const activeIndex = activeElement ? items.indexOf(activeElement) : // istanbul ignore next
      -1
    return { items, activeIndex }
  }

  _getFocusableMenuItems(includeInput: boolean): HTMLElement[] {
    const node = ReactDOM.findDOMNode(this)
    // istanbul ignore else
    if (node instanceof Element) {
      return Array.from(node.querySelectorAll(
        includeInput ? '[tabIndex="-1"],input' : '[tabIndex="-1"]'))
    } else {
      return []
    }
  }
}
