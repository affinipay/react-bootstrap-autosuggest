## Autosuggest

From [`src/Autosuggest.js`](../../master/src/Autosuggest.js)

Combo-box input component that combines a drop-down list and a single-line
editable text box. The set of options for the drop-down list can be
controlled dynamically. Selection of multiple items is supported using a
tag/pill-style user interface within a simulated text box.

#### addonAfter

```js
addonAfter: PropTypes.node (custom validator)
```

Text or component appearing in the input group after the input element
(and before any button specified in `buttonAfter`).

#### addonBefore

```js
addonBefore: PropTypes.node (custom validator)
```

Text or component appearing in the input group before the input element
(and before any button specified in `buttonBefore`).

#### allowDuplicates

```js
allowDuplicates: PropTypes.bool (custom validator)
```

Indicates whether duplicate values are allowed in `multiple` mode.

#### bsSize

```js
bsSize: PropTypes.oneOf(['small', 'large']) (custom validator)
```

Specifies the size of the form group and its contained components.
Leave undefined for normal/medium size.

#### buttonAfter

```js
buttonAfter: PropTypes.node (custom validator)
```

Button component appearing in the input group after the input element
(and after any add-on specified in `addonAfter`).

#### buttonBefore

```js
buttonBefore: PropTypes.node (custom validator)
```

Button component appearing in the input group before the input element
(and after any add-on specified in `addonBefore`).

#### choicesClass

```js
choicesClass: PropTypes.oneOfType([
  PropTypes.func,
  PropTypes.string
]) (custom validator)
```

React component class used to render the selected items in multiple mode.

#### closeOnCompletion

```js
// Default: false
closeOnCompletion: PropTypes.bool (custom validator)
```

Indicates whether the drop-down menu should be closed automatically when
auto-completion occurs. By default, the menu will remain open, so the
user can see any additional information about the selected item (such as
a shorthand code that caused it to be selected).

#### datalist

```js
datalist: PropTypes.any (custom validator)
```

A collection of items (such as an array, object, or Map) used as
auto-complete suggestions. Each item may have any type supported by the
`itemAdapter`. The default item adapter has basic support for any
non-null type: it will initially try to access item properties using the
configured property names (`itemReactKeyPropName`, `itemSortKeyPropName`,
and `itemValuePropName`), but will fall back to using the `toString`
method to obtain these properties to support primitives and other object
types.

If `datalist` is undefined or null and `onSearch` is not, the datalist
is assumed to be dynamically populated, and the drop-down toggle will be
enabled and will trigger `onSearch` the first time it is clicked.
Conversely, an empty `datalist` or undefined/null `onSearch` indicates
that there are no auto-complete options.

#### datalistAdapter

```js
datalistAdapter: PropTypes.object (custom validator)
```

An instance of the ListAdapter class that provides datalist access
methods required by this component.

#### datalistMessage

```js
datalistMessage: PropTypes.node (custom validator)
```

Message to be displayed at the end of the datalist. It can be used to
indicate that data is being fetched asynchronously, that an error
occurred fetching data, or that additional options can be requested.
It behaves similarly to a menu item, except that it is not filtered or
sorted and cannot be selected (except to invoke `onDatalistMessageSelect`).
Changing this property to a different non-null value while the component
is focused causes the drop-down menu to be opened, which is useful for
reporting status, such as that options are being fetched or failed to be
fetched.

#### datalistOnly

```js
// Default: false
datalistOnly: PropTypes.bool (custom validator)
```

Indicates that only values matching an item from the `datalist` property
are considered valid. For search purposes, intermediate values of the
underlying `input` element may not match while the component is focused,
but any non-matching value will be replaced with the previous matching
value when the component loses focus.

Note that there are two cases where the current (valid) value may not
correspond to an item in the datalist:

- If the value was provided by the `value` or `defaultValue` property
  and either `datalist` is undefined/null (as opposed to empty) or
  `datalistPartial` is true, the value is assumed to be valid.
- If `datalist` changes and `datalistPartial` is true, any previously
  valid value is assumed to remain valid. (Conversely, if `datalist`
  changes and `datalistPartial` is false, a previously valid value will
  be invalidated if not in the new `datalist`.)

#### datalistPartial

```js
// Default: false
datalistPartial: PropTypes.bool (custom validator)
```

Indicates that the `datalist` property should be considered incomplete
for validation purposes. Specifically, if both `datalistPartial` and
`datalistOnly` are true, changes to the `datalist` will not render
invalid a value that was previously valid. This is useful in cases where
a partial datalist is obtained dynamically in response to the `onSearch`
callback.

#### defaultValue

```js
defaultValue: PropTypes.any (custom validator)
```

Initial value to be rendered when used as an
[uncontrolled component](https://facebook.github.io/react/docs/forms.html#uncontrolled-components)
(i.e. no `value` property is supplied).

#### disabled

```js
// Default: false
disabled: PropTypes.bool (custom validator)
```

Indicates whether the form group is disabled, which causes all of its
contained elements to ignore input and focus events and to be displayed
grayed out.

#### dropup

```js
// Default: false
dropup: PropTypes.bool (custom validator)
```

Indicates whether the suggestion list should drop up instead of down.

Note that currently a drop-up list extending past the top of the page is
clipped, rendering the clipped items inaccessible, whereas a drop-down
list will extend the page and allow scrolling as necessary.

#### groupClassName

```js
groupClassName: PropTypes.string (custom validator)
```

Custom class name applied to the input group.

#### inputSelect

```js
// Default: Autosuggest.defaultInputSelect
inputSelect: PropTypes.func (custom validator)
```

Function used to select a portion of the input value when auto-completion
occurs. The default implementation selects just the auto-completed
portion, which is equivalent to:

```js
  defaultInputSelect(input, value, completion) {
    input.setSelectionRange(value.length, completion.length)
  }
```

#### itemAdapter

```js
itemAdapter: PropTypes.object (custom validator)
```

An instance of the ItemAdapter class that provides the item access
methods required by this component.

#### itemReactKeyPropName

```js
// Default: 'key'
itemReactKeyPropName: PropTypes.string (custom validator)
```

Name of the item property used for the React component key. If this
property is not defined, `itemValuePropName` is used instead. If neither
property is defined, `toString()` is called on the item.

#### itemSortKeyPropName

```js
// Default: 'sortKey'
itemSortKeyPropName: PropTypes.string (custom validator)
```

Name of the item property used for sorting items. If this property is not
defined, `itemValuePropName` is used instead. If neither property is
defined, `toString()` is called on the item.

#### itemValuePropName

```js
// Default: 'value'
itemValuePropName: PropTypes.string (custom validator)
```

Name of item property used for the input element value. If this property
is not defined, `toString()` is called on the item.

#### multiple

```js
// Default: false
multiple: PropTypes.bool (custom validator)
```

Enables selection of multiple items. The value property should be an
array of items.

#### onAdd

```js
onAdd: PropTypes.func (custom validator)
```

Callback function called whenever a new value should be appended to the
array of values in `multiple` mode. The sole argument is the added item.

#### onBlur

```js
onBlur: PropTypes.func (custom validator)
```

Callback function called whenever the input focus leaves this component.
The sole argument is current value (see `onChange for details`).

#### onChange

```js
onChange: PropTypes.func (custom validator)
```

Callback function called whenever the input value changes to a different
valid value. Validity depends on properties such as `datalistOnly`,
`valueIsItem`, and `required`. The sole argument is current value:

- If `multiple` is enabled, the current value is an array of selected
  items.
- If `valueIsItem` is enabled, the current value is the selected
  datalist item.
- Otherwise, the current value is the `input` element value. Note that
  if `datalistOnly` or `required` are enabled, only valid values trigger
  a callback.

#### onDatalistMessageSelect

```js
onDatalistMessageSelect: PropTypes.func (custom validator)
```

Callback function called whenever the datalist item created for
`datalistMessage` is selected. If this property is null, the associated
item is displayed as disabled.

#### onFocus

```js
onFocus: PropTypes.func (custom validator)
```

Callback function called whenever the input focus enters this component.
The sole argument is current value (see `onChange for details`).

#### onRemove

```js
onRemove: PropTypes.func (custom validator)
```

Callback function called whenever a value should be removed from the
array of values in `multiple` mode. The sole argument is the index of
the value to remove.

#### onSearch

```js
onSearch: PropTypes.func (custom validator)
```

Callback function called periodically when the `input` element value has
changed. The sole argument is the current value of the `input` element.
This callback can be used to dynamically populate the `datalist` based on
the input value so far, e.g. with values obtained from a remote service.
Once changed, the value must then remain unchanged for `searchDebounce`
milliseconds before the function will be called. No two consecutive
invocations of the function will be passed the same value (i.e. changing
and then restoring the value within the debounce interval is not
considered a change). Note also that the callback can be invoked with an
empty string, if the user clears the `input` element; this implies that
any minimum search string length should be imposed by the function.

#### onSelect

```js
onSelect: PropTypes.func (custom validator)
```

Callback function called whenever an item from the suggestion list is
selected (regardless of whether it is clicked or typed). The sole
argument is the selected item.

#### onToggle

```js
onToggle: PropTypes.func (custom validator)
```

Callback function called whenever the drop-down list of suggestions is
opened or closed. The sole argument is a boolean value indicating whether
the list is open.

#### placeholder

```js
placeholder: PropTypes.string (custom validator)
```

Placeholder text propagated to the underlying `input` element (when
`multiple` is false or no items have been selected).

#### required

```js
required: PropTypes.bool (custom validator)
```

`required` property passed to the `input` element (when `multiple` is
false or no items have been selected).

#### searchDebounce

```js
// Default: 250
searchDebounce: PropTypes.number (custom validator)
```

The number of milliseconds that must elapse between the last change to
the `input` element value and a call to `onSearch`. The default is 250.

#### showToggle

```js
// Default: 'auto'
showToggle: PropTypes.oneOfType([
  PropTypes.bool,
  PropTypes.oneOf(['auto'])
]) (custom validator)
```

Indicates whether to show the drop-down toggle. If set to `auto`, the
toggle is shown only when the `datalist` is non-empty or dynamic.

#### suggestionsClass

```js
suggestionsClass: PropTypes.oneOfType([
  PropTypes.func,
  PropTypes.string
]) (custom validator)
```

React component class used to render the drop-down list of suggestions.

#### toggleId

```js
toggleId: PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.number
]) (custom validator)
```

ID supplied to the drop-down toggle and used by the drop-down menu to
refer to it.

#### type

```js
// Default: 'text'
type: PropTypes.string (custom validator)
```

`type` property supplied to the contained `input` element. Only textual
types should be specified, such as `text`, `search`, `email`, `tel`, or
perhaps `number`. Note that the browser may supply additional UI elements
for some types (e.g. increment/decrement buttons for `number`) that may
need additional styling or may interfere with UI elements supplied by
this component.

#### value

```js
value: PropTypes.any (custom validator)
```

The value to be rendered by the component. If unspecified, the component
behaves like an [uncontrolled component](https://facebook.github.io/react/docs/forms.html#uncontrolled-components).

#### valueIsItem

```js
// Default: false
valueIsItem: PropTypes.bool (custom validator)
```

Indicates that the `value` property should be interpreted as a datalist
item, as opposed to the string value of the underlying `input` element.
When false (the default), the `value` property (if specified) is
expected to be a string and corresponds (indirectly) to the `value`
property of the underlying `input` element. When true, the `value`
property is expected to be a datalist item whose display value (as
provided by the `itemAdapter`) is used as the `input` element value.
This property also determines whether the argument to the `onChange`
callback is the `input` value or a datalist item.

Note that unless `datalistOnly` is also true, items may also be created
dynamically using the `newFromValue` method of the `itemAdapter`.

Also note that this property is ignored if `multiple` is true; in that
case, the `value` property and `onChange` callback argument are
implicitly an array of datalist items.

<br><br>
