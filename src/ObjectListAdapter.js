// @flow

import KeyedListAdapter from './KeyedListAdapter'

export default class ObjectListAdapter<V>
  extends KeyedListAdapter<V, { [key: string]: V }> {

  getLength(list: { [key: string]: V }): number {
    return Object.keys(list).length
  }

  filter(list: { [key: string]: V }, predicate: (item: Object) => boolean): Object[] {
    const result = []
    for (let key of Object.keys(list)) {
      const item = this._getKeyValueItem(key, list[key])
      if (predicate(item)) {
        result.push(item)
      }
    }
    return result
  }

  find(list: { [key: string]: V }, predicate: (item: Object) => boolean): ?Object {
    for (let key of Object.keys(list)) {
      const item = this._getKeyValueItem(key, list[key])
      if (predicate(item)) {
        return item
      }
    }
  }

  toArray(list: { [key: string]: V }): Object[] {
    const result = []
    for (let key of Object.keys(list)) {
      result.push(this._getKeyValueItem(key, list[key]))
    }
    return result
  }
}
