// @flow

import type { Node } from './types'

export type Props = {
  itemReactKeyPropName?: string;
  itemSortKeyPropName?: string;
  itemValuePropName?: string;
}

function toStringOrNumber(v: any): string | number {
  return typeof v === 'number' ? v : v.toString()
}

export default class ItemAdapter<I> {
  props: Props;

  receiveProps(props: Props) {
    this.props = props
  }

  getReactKey(item: I): string | number {
    const { itemReactKeyPropName: propName } = this.props
    if (propName) {
      const value = (item: any)[propName]
      if (value != null) {
        return value
      }
    }
    return toStringOrNumber(this.getRawValue(item))
  }

  getSortKey(item: I): string | number {
    const { itemSortKeyPropName: propName } = this.props
    if (propName) {
      const value = (item: any)[propName]
      if (value != null) {
        return value
      }
    }
    return toStringOrNumber(this.getRawValue(item))
  }

  getInputValue(item: I): string {
    return this.getRawValue(item).toString()
  }

  // protected
  getRawValue(item: I): any {
    const { itemValuePropName: propName } = this.props
    if (propName) {
      const value = (item: any)[propName]
      if (value != null) {
        return value
      }
    }
    return item
  }

  getTextRepresentations(item: I): string[] {
    return [this.foldValue(this.getInputValue(item))]
  }

  foldValue(value: string): string {
    // perform case folding by default; override for diacritic folding, etc.
    return value.toLowerCase()
  }

  newFromValue(value: string): string | Object {
    return value
  }

  itemIncludedByInput(item: I, foldedValue: string): boolean {
    for (let text of this.getTextRepresentations(item)) {
      if (text.indexOf(foldedValue) >= 0) {
        return true
      }
    }
    return false
  }

  itemMatchesInput(item: I, foldedValue: string): boolean {
    for (let text of this.getTextRepresentations(item)) {
      if (text === foldedValue) {
        return true
      }
    }
    return false
  }

  sortItems(items: I[], foldedValue: string): I[] {
    items.sort((a, b) => this.compareItemsWithValue(a, b, foldedValue))
    return items
  }

  // protected
  compareItemsWithValue(a: I, b: I, foldedValue: string): number {
    // sort matching item(s) before non-matching
    const aMatches = this.itemMatchesInput(a, foldedValue)
    const bMatches = this.itemMatchesInput(b, foldedValue)
    if (aMatches != bMatches) {
      return aMatches ? -1 : 1
    }
    // then sort based on inclusion rank
    const aRank = this.itemInclusionRankForInput(a, foldedValue)
    const bRank = this.itemInclusionRankForInput(b, foldedValue)
    if (aRank != bRank) {
      return aRank - bRank
    }
    // within same inclusion rank, compare items ignoring value
    return this.compareItems(a, b)
  }

  // protected
  itemInclusionRankForInput(item: I, foldedValue: string): number {
    let contains = false
    for (let text of this.getTextRepresentations(item)) {
      const index = text.indexOf(foldedValue)
      if (index === 0) {
        return 0
      }
      if (index > 0) {
        contains = true
      }
    }
    return contains ? 1 : 2
  }

  // protected
  compareItems(a: I, b: I): number {
    const aSortKey: any = this.getSortKey(a)
    const bSortKey: any = this.getSortKey(b)
    return aSortKey < bSortKey ? -1 : aSortKey == bSortKey ? 0 : 1
  }

  // protected
  renderItem(item: I): Node { // default rendering for both dropdown and multiple
    return this.getInputValue(item)
  }

  renderSuggested(item: I): Node { // dropdown rendering
    return this.renderItem(item)
  }

  renderSelected(item: I): Node { // multiple selected rendering
    return this.renderItem(item)
  }
}
