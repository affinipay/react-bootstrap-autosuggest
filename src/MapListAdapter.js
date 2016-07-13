// @flow

import KeyedListAdapter from './KeyedListAdapter'

export default class MapListAdapter<V>
  extends KeyedListAdapter<V, Map<string, V>> {

  getLength(list: Map<string, V>): number {
    return list.size
  }

  filter(list: Map<string, V>, predicate: (item: Object) => boolean): Object[] {
    const result = []
    for (let entry of list.entries()) {
      const item = this._getKeyValueItem(entry[0], entry[1])
      if (predicate(item)) {
        result.push(item)
      }
    }
    return result
  }

  find(list: Map<string, V>, predicate: (item: Object) => boolean): ?Object {
    for (let entry of list.entries()) {
      const item = this._getKeyValueItem(entry[0], entry[1])
      if (predicate(item)) {
        return item
      }
    }
  }

  toArray(list: Map<string, V>): Object[] {
    const result = []
    for (let entry of list.entries()) {
      result.push(this._getKeyValueItem(entry[0], entry[1]))
    }
    return result
  }
}
