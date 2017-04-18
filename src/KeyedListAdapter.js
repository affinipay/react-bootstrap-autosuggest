// @flow

import ListAdapter from './ListAdapter'

export default class KeyedListAdapter<V, L> extends ListAdapter<Object, L> {
  itemKeyPropName: string;

  constructor(itemKeyPropName: string = 'key') {
    super()
    this.itemKeyPropName = itemKeyPropName
  }

  _getKeyValueItem(key: string, value: V): Object {
    const { itemKeyPropName } = this
    // istanbul ignore next
    const { itemValuePropName = 'value' } = this.props
    if (typeof value === 'object' && itemValuePropName in (value: any)) {
      if ((value: any)[itemKeyPropName] === key) {
        return (value: any)
      } else {
        return {
          [itemKeyPropName]: key,
          ...value
        }
      }
    }
    return {
      [itemKeyPropName]: key,
      [itemValuePropName]: value
    }
  }
}
