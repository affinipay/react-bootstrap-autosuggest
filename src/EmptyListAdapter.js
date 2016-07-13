// @flow

import ListAdapter from './ListAdapter'

export default class EmptyListAdapter<I> extends ListAdapter<I, void> {
  getLength() {
    return 0
  }

  filter(): I[] {
    return []
  }

  find(): ?I {
  }

  toArray(): I[] {
    return []
  }
}
