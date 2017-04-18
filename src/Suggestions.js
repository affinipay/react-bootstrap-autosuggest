// @flow

import shallowEqual from 'fbjs/lib/shallowEqual'
import PropTypes from 'prop-types'
import React from 'react'
import { Dropdown, MenuItem } from 'react-bootstrap'
import ReactDOM from 'react-dom'
import type { Node } from './types'

type Props = {
  datalistMessage?: Node;
  filtered?: boolean;
  focusedIndex?: number,
  getItemKey: (item: any) => string | number | boolean;
  isSelectedItem: (item: any) => boolean;
  items: any[];
  labelledBy?: string | number;
  onClose?: () => void;
  onDatalistMessageSelect?: () => void;
  onDisableFilter?: () => void;
  onSelect: (item: any) => void;
  open: boolean;
  renderItem: (item: any) => Node;
}

type State = {}

export default class Suggestions extends React.Component {
  static propTypes = {
    datalistMessage: PropTypes.node,
    filtered: PropTypes.bool,
    focusedIndex: PropTypes.number,
    getItemKey: PropTypes.func.isRequired,
    isSelectedItem: PropTypes.func.isRequired,
    items: PropTypes.arrayOf(PropTypes.any).isRequired,
    labelledBy: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    onClose: PropTypes.func,
    onDatalistMessageSelect: PropTypes.func,
    onDisableFilter: PropTypes.func,
    onSelect: PropTypes.func.isRequired,
    open: PropTypes.bool,
    renderItem: PropTypes.func.isRequired
  };

  props: Props;
  state: State;

  shouldComponentUpdate(nextProps: Props): boolean {
    return !shallowEqual(this.props, nextProps)
  }

  isFocused(): boolean {
    const menuNode = ReactDOM.findDOMNode(this.refs.menu)
    return menuNode != null && document && menuNode.contains(document.activeElement)
  }

  focusFirst() {
    const { menu } = this.refs
    menu.focusNext()
  }

  render(): React.Element<*> {
    const { items, datalistMessage, onDatalistMessageSelect } = this.props
    return <Dropdown.Menu
        labelledBy={this.props.labelledBy}
        onClose={this.props.onClose}
        open={this.props.open}
        ref="menu">
      {items.map(this._renderItem, this)}
      {this.props.filtered && <MenuItem key="show-all" onSelect={this.props.onDisableFilter}>
        <span className="show-all">
          {items.length === 0 ? <span className="no-matches" /> : null}
        </span>
      </MenuItem>}
      {datalistMessage && <MenuItem key="datalist-message"
          disabled={onDatalistMessageSelect == null}
          onSelect={onDatalistMessageSelect}>
        {datalistMessage}
      </MenuItem>}
    </Dropdown.Menu>
  }

  _renderItem(item: any, index: number): React.Element<*> {
    const active = this.props.isSelectedItem(item)
    return <MenuItem
        active={active}
        className={index === this.props.focusedIndex && !active ?
          'pseudofocused' : undefined}
        eventKey={item}
        key={this.props.getItemKey(item)}
        onSelect={this.props.onSelect}>
      {this.props.renderItem(item)}
    </MenuItem>
  }
}
