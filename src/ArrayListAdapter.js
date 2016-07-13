// @flow

import ListAdapter from './ListAdapter'

export default class ArrayListAdapter<I> extends ListAdapter<I, I[]> {
  getLength(list: I[]) {
    return list.length
  }

  filter(list: I[], predicate: (item: I) => boolean): I[] {
    return list.filter(predicate)
  }

  find(list: I[], predicate: (item: I) => boolean): ?I {
    return list.find(predicate)
  }

  toArray(list: I[]): I[] {
    return list.slice()
  }
}
