// @flow

import type { Props } from './ItemAdapter'

import ItemAdapter from './ItemAdapter'

export default class ListAdapter<I, L> {
  props: Props;
  itemAdapter: ItemAdapter<I>;

  receiveProps(props: Props, itemAdapter: ItemAdapter<I>) {
    this.props = props
    this.itemAdapter = itemAdapter
  }

  isEmpty(list: L): boolean {
    return !this.getLength(list)
  }

  +getLength: (list: L) => number;

  filter(list: L, predicate: (item: I) => boolean): I[] {
    return this.toArray(list).filter(predicate)
  }

  find(list: L, predicate: (item: I) => boolean): ?I {
    return this.toArray(list).find(predicate)
  }

  findMatching(list: L, inputValue: string): ?I {
    const foldedValue = this.itemAdapter.foldValue(inputValue)
    return this.find(list, item => this.itemAdapter.itemMatchesInput(item, foldedValue))
  }

  +toArray: (list: L) => I[];
}
