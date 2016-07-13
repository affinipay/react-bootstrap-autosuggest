import chai, { assert, expect } from 'chai'
import chaiEnzyme from 'chai-enzyme'
import { mount, shallow } from 'enzyme'
import React from 'react'
import { FormGroup } from 'react-bootstrap'
import Autosuggest, { ItemAdapter, ListAdapter, ObjectListAdapter } from 'react-bootstrap-autosuggest'
import ReactDOM from 'react-dom'
import sinonChai from 'sinon-chai'

chai.use(chaiEnzyme())
chai.use(sinonChai)

const arrowDownKey = 40
const arrowLeftKey = 37
const arrowRightKey = 39
const backspaceKey = 8
const deleteKey = 46
const enterKey = 13

describe('Process environment', () => {
  it('should be development for React console warnings', () => {
    assert.equal(process.env.NODE_ENV, 'development')
  })
})

function openMenu(wrapper) {
  const toggle = wrapper.find('DropdownToggle')
  expect(toggle).to.have.length(1)
  if (!toggle.props().open) {
    toggle.simulate('click')
  }
}

function getItems(wrapper) {
  const dropdownItems = wrapper.find('MenuItem')
  return dropdownItems.map(i => i.text())
}

function expectItems(wrapper, items) {
  expect(getItems(wrapper)).to.eql(items)
}

function getSelected(wrapper) {
  const choices = wrapper.find('.autosuggest-choices')
  const listItems = choices.find('li')
  return listItems.map(i => i.text().trim()).slice(0, listItems.length - 1)
}

function expectSelected(wrapper, items) {
  expect(getSelected(wrapper)).to.eql(items)
}

const SHOW_ALL = ''

function isDropdownOpen(wrapper) {
  const dropdown = wrapper.find('.autosuggest')
  expect(dropdown).to.have.length(1)
  const open = dropdown.hasClass('open')

  const toggle = dropdown.find('DropdownToggle')
  if (toggle.length == 1) {
    expect(toggle.props().open).to.equal(open)
  }

  return open
}

function createBodyDiv() {
  const div = global.document.createElement('div')
  global.document.body.appendChild(div)
  return div
}

function deleteBodyDiv(div) {
  const len = document.body.childNodes.length
  global.document.body.removeChild(div)
  expect(document.body.childNodes).to.have.length(len - 1)
}

function replaceRange(str, start, end, sub = '') {
  return str.substring(0, start) + sub + str.substring(end)
}

function simulateKeyDown(target, keyCode) {
  target.simulate('keydown', { keyCode, which: keyCode })
}

function simulateKeyUp(target, keyCode) {
  target.simulate('keyup', { keyCode, which: keyCode })
}

function simulateKeyDownUp(target, keyCode) {
  simulateKeyDown(target, keyCode)
  simulateKeyUp(target, keyCode)
}

function simulateKeyPress(target, charCode) {
  target.simulate('keypress', { charCode, keyCode: charCode, which: charCode })
}

function inputType(input, char) {
  const charCode = char.charCodeAt(0)
  // exclude keyCode for coverage of which
  input.simulate('keydown', { which: charCode })
  simulateKeyPress(input, charCode)
  const inputDOM = ReactDOM.findDOMNode(input.node)
  const oldValue = input.props().value || ''
  const value = replaceRange(
    oldValue, inputDOM.selectionStart, inputDOM.selectionEnd, char)
  input.simulate('change', { target: { value } })
  simulateKeyUp(input, charCode)
}

function inputBsDel(input, keyCode) {
  simulateKeyDown(input, keyCode)
  const inputDOM = ReactDOM.findDOMNode(input.node)
  const oldValue = input.props().value
  let value
  if (inputDOM.selectionStart != inputDOM.selectionEnd) {
    value = replaceRange(
      oldValue, inputDOM.selectionStart, inputDOM.selectionEnd)
  } else {
    const index = inputDOM.selectionStart - (keyCode == backspaceKey ? 1 : 0)
    value = replaceRange(oldValue, index, index + 1)
  }
  input.simulate('change', { target: { value } })
  simulateKeyUp(input, keyCode)
}

class StringListAdapter extends ListAdapter {
  getLength(s) {
    return s.length
  }
  toArray(s) {
    return [...s].map((e, i) => ({ key: i, value: e }))
  }
}

class KeyAndValueItemAdapter extends ItemAdapter {
  getTextRepresentations(item) {
    return [this.foldValue(item.key), this.foldValue(item.value)]
  }
  newFromValue(value) {
    return { value }
  }
}

describe('Autosuggest', () => {
  it('requires no attributes', () => {
    const autosuggest = shallow(<Autosuggest />)
    expect(autosuggest).to.have.className('autosuggest')
    expect(autosuggest).to.not.have.className('dropdown')

    const formControl = autosuggest.find('.form-control')
    expect(formControl).to.have.length(1)
    expect(formControl.type()).to.equal('input')
  })

  it('renders forced toggle with empty list', () => {
    const autosuggest = shallow(<Autosuggest showToggle />)
    expect(autosuggest).to.have.className('autosuggest')
    expect(autosuggest).to.have.className('dropdown')

    const inputGroup = autosuggest.find('.input-group')
    expect(inputGroup).to.have.length(1)

    const formControl = inputGroup.find('.form-control')
    expect(formControl).to.have.length(1)
    expect(formControl.type()).to.equal('input')

    const inputGroupBtns = inputGroup.find('.input-group-btn')
    expect(inputGroupBtns).to.have.length(1)

    const toggle = inputGroupBtns.find('DropdownToggle')
    expect(toggle).to.have.length(1)
    expect(toggle.props().disabled).to.be.true
    expect(toggle.props().open).to.be.false
  })

  it('renders an add-on before', () => {
    const autosuggest = shallow(<Autosuggest addonBefore="@" />)
    const inputGroup = autosuggest.find('.input-group')
    expect(inputGroup).to.have.length(1)
    const addonSpan = inputGroup.childAt(0)
    expect(addonSpan).to.have.length(1)
    expect(addonSpan).to.have.className('input-group-addon')
    expect(addonSpan.type()).to.equal('span')
    expect(addonSpan.text()).to.equal('@')
  })

  it('renders an add-on after', () => {
    const autosuggest = shallow(<Autosuggest addonAfter="@" />)
    const inputGroup = autosuggest.find('.input-group')
    expect(inputGroup).to.have.length(1)
    const addonSpan = inputGroup.children().last()
    expect(addonSpan).to.have.length(1)
    expect(addonSpan).to.have.className('input-group-addon')
    expect(addonSpan.type()).to.equal('span')
    expect(addonSpan.text()).to.equal('@')
  })

  it('renders a button before', () => {
    const button = <button>Before</button>
    const autosuggest = shallow(<Autosuggest buttonBefore={button} />)
    const inputGroup = autosuggest.find('.input-group')
    expect(inputGroup).to.have.length(1)
    const btnSpan = inputGroup.childAt(0)
    expect(btnSpan).to.have.length(1)
    expect(btnSpan).to.have.className('input-group-btn')
    expect(btnSpan.type()).to.equal('span')
    expect(btnSpan).to.contain(button)
  })

  it('renders a button after', () => {
    const button = <button>After</button>
    const autosuggest = shallow(<Autosuggest buttonAfter={button} />)
    const inputGroup = autosuggest.find('.input-group')
    expect(inputGroup).to.have.length(1)
    const btnSpan = inputGroup.children().last()
    expect(btnSpan).to.have.length(1)
    expect(btnSpan).to.have.className('input-group-btn')
    expect(btnSpan.type()).to.equal('span')
    expect(btnSpan.children().last()).to.contain(button)
  })

  it('supports small input group', () => {
    const autosuggest = shallow(<Autosuggest bsSize="small" showToggle />)
    const inputGroup = autosuggest.find('.input-group')
    expect(inputGroup).to.have.length(1)
    expect(inputGroup).to.have.className('input-group-sm')
  })

  it('supports large input group', () => {
    const autosuggest = shallow(<Autosuggest bsSize="large" showToggle />)
    const inputGroup = autosuggest.find('.input-group')
    expect(inputGroup).to.have.length(1)
    expect(inputGroup).to.have.className('input-group-lg')
  })

  it('supports input placeholder', () => {
    const placeholder = 'Type stuff'
    const autosuggest = shallow(<Autosuggest placeholder={placeholder} />)
    const input = autosuggest.find('input')
    expect(input).to.have.length(1)
    expect(input.props().placeholder).to.equal(placeholder)
  })

  it('supports multiple selections', () => {
    const autosuggest = mount(<Autosuggest multiple value={['abc', '123']} />)
    const formControl = autosuggest.find('.form-control')
    expect(formControl.type()).to.equal('ul')
    expect(formControl.hasClass('autosuggest-choices')).to.be.true
    const items = formControl.find('li')
    expect(items).to.have.length(3)
    expect(items.at(0).text().indexOf('abc')).to.be.at.least(0)
    expect(items.at(1).text().indexOf('123')).to.be.at.least(0)
    expect(items.at(2).hasClass('autosuggest-input-choice')).to.be.true
    expectSelected(autosuggest, ['abc', '123'])
    autosuggest.setProps({ value: ['xyz'] })
    expectSelected(autosuggest, ['xyz'])
    expect(autosuggest.find('.auto-height')).to.have.length(0)
  })

  it('supports allowDuplicates in multiple mode', () => {
    const autosuggest = mount(<Autosuggest multiple defaultValue={['c', 'c']} allowDuplicates />)
    expectSelected(autosuggest, ['c', 'c'])

    const input = autosuggest.find('input')
    expect(input).to.have.length(1)

    inputType(input, 'a')
    simulateKeyDown(input, enterKey)
    inputType(input, 'b')
    simulateKeyDown(input, enterKey)
    inputType(input, 'a')
    simulateKeyDown(input, enterKey)
    inputType(input, 'a')
    simulateKeyDown(input, enterKey)
    expectSelected(autosuggest, ['c', 'c', 'a', 'b', 'a', 'a'])
  })

  it('ignores duplicates by default in multiple mode', () => {
    const autosuggest = mount(<Autosuggest multiple defaultValue={['c', 'c']} />)
    expectSelected(autosuggest, ['c'])

    const input = autosuggest.find('input')
    expect(input).to.have.length(1)

    inputType(input, 'a')
    simulateKeyDown(input, enterKey)
    inputType(input, 'b')
    simulateKeyDown(input, enterKey)
    inputType(input, 'a')
    simulateKeyDown(input, enterKey)
    inputType(input, 'a')
    simulateKeyDown(input, enterKey)
    expectSelected(autosuggest, ['c', 'a', 'b'])
  })

  it('removes duplicates when allowDuplicates is set to false', () => {
    const autosuggest = mount(<Autosuggest multiple
      defaultValue={['c', 'c', 'a', 'c']} allowDuplicates />)
    expectSelected(autosuggest, ['c', 'c', 'a', 'c'])
    autosuggest.setProps({ allowDuplicates: false })
    expectSelected(autosuggest, ['c', 'a'])
  })

  it('ignores non-array value in multiple mode', () => {
    const autosuggest = mount(<Autosuggest multiple value={'abc'} />)
    const formControl = autosuggest.find('.form-control')
    expect(formControl.type()).to.equal('ul')
    expect(formControl.hasClass('autosuggest-choices')).to.be.true
    const items = formControl.find('li')
    expect(items).to.have.length(1)
    expect(items.hasClass('autosuggest-input-choice')).to.be.true
  })

  it('supports auto-height multiple when no toggle or add-ons', () => {
    const autosuggest = mount(<Autosuggest multiple value={['abc']}
      showToggle={false} />)
    expect(autosuggest.find('.auto-height')).to.have.length(1)
  })

  it('inherits control ID from containing form group', () => {
    const controlId = 'myAutosuggest'
    const formGroup = mount(
      <FormGroup controlId={controlId}>
        <Autosuggest />
      </FormGroup>)
    const input = formGroup.find('input')
    expect(input).to.have.length(1)
    expect(input.props().id).to.equal(controlId)
  })

  it('propagates disabled', () => {
    const onChange = sinon.spy()
    const autosuggest = mount(<Autosuggest datalist={['x']} disabled
      multiple value={['y']} onChange={onChange} />)

    const dropdown = autosuggest.find('.dropdown')
    expect(dropdown).to.have.length(1)
    expect(dropdown).to.have.className('disabled')

    const toggle = autosuggest.find('DropdownToggle')
    expect(toggle).to.have.length(1)
    expect(toggle.props().disabled).to.be.true

    const input = autosuggest.find('input')
    expect(input).to.have.length(1)
    expect(input.props().disabled).to.be.true

    const choices = autosuggest.find('.autosuggest-choices')
    expect(choices).to.have.length(1)
    expect(choices.props().disabled).to.be.true

    const listItems = choices.find('li')
    expect(listItems).to.have.length(2)
    listItems.forEach(li => expect(li.props().tabIndex).to.be.undefined)

    const choiceCloses = choices.find('.autosuggest-choice-close')
    expect(choiceCloses).to.have.length(1)
    choiceCloses.simulate('click')
    expect(onChange).to.not.have.been.called
  })

  it('propagates required (unless multiple with selections)', () => {
    const autosuggest = mount(<Autosuggest datalist={['x']} required />)

    let input = autosuggest.find('input')
    expect(input).to.have.length(1)
    expect(input.props().required).to.be.true

    autosuggest.setProps({ multiple: true })
    input = autosuggest.find('input')
    expect(input.props().required).to.be.true

    inputType(input, 'x')
    simulateKeyDown(input, enterKey)
    expectSelected(autosuggest, ['x'])
    expect(input.props().required).to.be.false
  })

  it('propagates unrecognized properties to input element', () => {
    const autosuggest = mount(<Autosuggest data-foo="bar" />)
    const input = autosuggest.find('input')
    expect(input).to.have.length(1)
    expect(input.props()['data-foo']).to.equal('bar')
  })

  it('throws with unexpected datalist type', () => {
    expect(() => shallow(<Autosuggest datalist={1} />)).to.throw(Error)
  })

  it('completes string items ignoring case', () => {
    const autosuggest = mount(<Autosuggest datalist={['foo', 'bar']} datalistOnly />)
    const input = autosuggest.find('input')
    expect(input).to.have.length(1)
    inputType(input, 'F')
    expect(autosuggest.state().inputValue).to.equal('foo')
    expect(isDropdownOpen(autosuggest)).to.be.true
  })

  it('supports valueIsItem for array datalist', () => {
    const item1 = { key: '1', value: 'foo' }
    const item2 = { key: '2', value: 'bar' }
    const items = [item1, item2]
    const onChange = sinon.spy()
    const autosuggest = shallow(<Autosuggest
        datalist={items} valueIsItem defaultValue={item1} onChange={onChange} />)
    expect(autosuggest.state().inputValue).to.equal('foo')
    const input = autosuggest.find('input')
    expect(input).to.have.length(1)
    input.simulate('change', { target: { value: 'bar' } })
    expect(onChange).to.have.been.calledWith(item2)
  })

  it('supports changing valueIsItem', () => {
    const item1 = { key: '1', value: 'foo' }
    const item2 = { key: '2', value: 'bar' }
    const items = [item1, item2]
    const autosuggest = mount(<Autosuggest
        datalist={items} value="foo" />)
    expect(autosuggest.state().inputValue).to.equal('foo')
    autosuggest.setProps({ value: item1, valueIsItem: true })
    expect(autosuggest.state().inputValue).to.equal('foo')
    autosuggest.setProps({ value: item2 })
    expect(autosuggest.state().inputValue).to.equal('bar')
    autosuggest.setProps({ value: { value: 'baz' } })
    expect(autosuggest.state().inputValue).to.equal('baz')
    autosuggest.setProps({ valueIsItem: false })
    expect(autosuggest.state().inputValue).to.equal('baz')
  })

  it('supports object map datalist', () => {
    const items = { '1': 'foo', '2': 'bar' }
    const autosuggest = mount(<Autosuggest datalist={items} datalistOnly />)
    const input = autosuggest.find('input')
    expect(input).to.have.length(1)
    inputType(input, 'F')
    expect(autosuggest.state().inputValue).to.equal('foo')
    expect(isDropdownOpen(autosuggest)).to.be.true
    expectItems(autosuggest, ['foo', SHOW_ALL])
    inputType(input, 'x')
    expectItems(autosuggest, [SHOW_ALL])
    autosuggest.setState({ disableFilter: true })
    expectItems(autosuggest, ['bar', 'foo'])
  })

  it('supports object map datalist with unwrapped values', () => {
    const items = { '1': { value: 'foo'}, '2': { value: 'bar' } }
    const autosuggest = mount(<Autosuggest datalist={items} datalistOnly />)
    const input = autosuggest.find('input')
    expect(input).to.have.length(1)
    inputType(input, 'F')
    expect(autosuggest.state().inputValue).to.equal('foo')
    expect(isDropdownOpen(autosuggest)).to.be.true
  })

  it('supports object map datalist with keyed values', () => {
    const item1 = { key: '1', value: 'foo'}
    const items = { [item1.key]: item1 }
    const onChange = sinon.spy()
    const autosuggest = mount(<Autosuggest datalist={items} datalistOnly
      valueIsItem onChange={onChange} />)
    const input = autosuggest.find('input')
    expect(input).to.have.length(1)
    inputType(input, 'F')
    expect(autosuggest.state().inputValue).to.equal('foo')
    expect(isDropdownOpen(autosuggest)).to.be.true
    expect(onChange).to.have.been.calledWithExactly(item1)
  })

  it('supports valueIsItem for object map datalist', () => {
    const items = { '1': 'foo', '2': 'bar' }
    const onChange = sinon.spy()
    const autosuggest = shallow(<Autosuggest datalist={items} valueIsItem
      defaultValue={{ value: 'foo' }} onChange={onChange} />)
    expect(autosuggest.state().inputValue).to.equal('foo')
    const input = autosuggest.find('input')
    expect(input).to.have.length(1)
    input.simulate('change', { target: { value: 'bar' } })
    expect(onChange).to.have.been.calledWith({ key: '2', value: 'bar' })
  })

  it('supports custom key property name for object map datalist', () => {
    const items = { '1': 'foo', '2': 'bar' }
    const onChange = sinon.spy()
    const autosuggest = shallow(<Autosuggest datalist={items} valueIsItem
      defaultValue={{ value: 'foo' }} onChange={onChange}
      datalistAdapter={new ObjectListAdapter('myKey')} />)
    expect(autosuggest.state().inputValue).to.equal('foo')
    const input = autosuggest.find('input')
    expect(input).to.have.length(1)
    input.simulate('change', { target: { value: 'bar' } })
    expect(onChange).to.have.been.calledWith({ myKey: '2', value: 'bar' })
  })

  it('supports Map datalist', () => {
    const items = new Map([['1', 'foo'], ['2', 'bar']])
    const autosuggest = mount(<Autosuggest datalist={items} datalistOnly />)
    const input = autosuggest.find('input')
    expect(input).to.have.length(1)
    inputType(input, 'F')
    expect(autosuggest.state().inputValue).to.equal('foo')
    expect(isDropdownOpen(autosuggest)).to.be.true
    expectItems(autosuggest, ['foo', SHOW_ALL])
    inputType(input, 'x')
    expectItems(autosuggest, [SHOW_ALL])
    autosuggest.setState({ disableFilter: true })
    expectItems(autosuggest, ['bar', 'foo'])
  })

  it('supports valueIsItem for Map datalist', () => {
    const items = new Map([['1', 'foo'], ['2', 'bar']])
    const onChange = sinon.spy()
    const autosuggest = shallow(<Autosuggest datalist={items} valueIsItem
      defaultValue={{ value: 'foo' }} onChange={onChange} />)
    expect(autosuggest.state().inputValue).to.equal('foo')
    const input = autosuggest.find('input')
    expect(input).to.have.length(1)
    input.simulate('change', { target: { value: 'bar' } })
    expect(onChange).to.have.been.calledWith({ key: '2', value: 'bar' })
  })

  it('allows (and ignores) valueIsItem for multiple', () => {
    const items = new Map([['1', 'foo'], ['2', 'bar']])
    const autosuggest = mount(<Autosuggest
        datalist={items} multiple valueIsItem defaultValue={[{ value: 'foo' }]} />)
    expectSelected(autosuggest, ['foo'])
  })

  it('supports valueIsItem without datalist', () => {
    const onChange = sinon.spy()
    const autosuggest = shallow(<Autosuggest valueIsItem
      defaultValue={{ value: 'foo' }} onChange={onChange}
      itemAdapter={new KeyAndValueItemAdapter()} />)
    expect(autosuggest.state().inputValue).to.equal('foo')
    const input = autosuggest.find('input')
    expect(input).to.have.length(1)
    input.simulate('change', { target: { value: 'bar' } })
    expect(onChange).to.have.been.calledWith({ value: 'bar' })
  })

  it('supports custom datalist adapter', () => {
    const items = 'abcdefg'
    const autosuggest = mount(<Autosuggest
        datalist={items} datalistAdapter={new StringListAdapter()} datalistOnly />)
    const input = autosuggest.find('input')
    expect(input).to.have.length(1)
    inputType(input, 'F')
    expect(autosuggest.state().inputValue).to.equal('f')
    expect(isDropdownOpen(autosuggest)).to.be.true
  })

  it('supports changing datalist adapter', () => {
    class SingletonListAdapter extends ListAdapter {
      getLength(s) {
        return s != null ? 1 : 0
      }
      toArray(s) {
        return s != null ? [s] : []
      }
    }
    const items = 'abcdefg'
    const autosuggest = mount(<Autosuggest
        datalist={items} datalistAdapter={new StringListAdapter()} datalistOnly />)
    const input = autosuggest.find('input')
    expect(input).to.have.length(1)
    inputType(input, 'F')
    expect(autosuggest.state().inputValue).to.equal('f')
    expect(isDropdownOpen(autosuggest)).to.be.true
    expectItems(autosuggest, ['f', SHOW_ALL])
    autosuggest.setProps({ datalistAdapter: new SingletonListAdapter() })
    expectItems(autosuggest, [items])
  })

  it('supports changing datalist', () => {
    const items = ['aa', 'ab', 'c']
    const autosuggest = mount(<Autosuggest datalist={items} />)
    const input = autosuggest.find('input')
    expect(input).to.have.length(1)
    inputType(input, 'a')
    expect(isDropdownOpen(autosuggest)).to.be.true
    expectItems(autosuggest, ['aa', 'ab', SHOW_ALL])
    const newItems = { ax: 'ax', ay: 'ay', z: 'z' }
    autosuggest.setProps({ datalist: newItems })
    expectItems(autosuggest, ['ax', 'ay', SHOW_ALL])
  })

  it('attempts to autocomplete when focused and datalist changes', () => {
    const div = createBodyDiv()
    const autosuggest = mount(<Autosuggest datalistOnly />, { attachTo: div })
    try {
      const input = autosuggest.find('input')
      const inputDOM = ReactDOM.findDOMNode(input.node)
      inputDOM.focus()
      inputType(input, 'a')
      expect(isDropdownOpen(autosuggest)).to.be.false
      autosuggest.setProps({ datalist: ['abc', 'xyz'] })
      expect(autosuggest.state().inputValue).to.equal('abc')
      expect(isDropdownOpen(autosuggest)).to.be.true
      expectItems(autosuggest, ['abc', SHOW_ALL])
    } finally {
      autosuggest.detach()
      deleteBodyDiv(div)
    }
  })

  it('overrides state value when focused and props value changes', () => {
    const div = createBodyDiv()
    const autosuggest = mount(<Autosuggest datalist={['a', 'b']} datalistOnly />,
      { attachTo: div })
    try {
      const input = autosuggest.find('input')
      const inputDOM = ReactDOM.findDOMNode(input.node)
      inputDOM.focus()
      inputType(input, 'a')
      expect(autosuggest.state().inputValue).to.equal('a')
      autosuggest.setProps({ value: 'b' })
      expect(autosuggest.state().inputValue).to.equal('b')
    } finally {
      autosuggest.detach()
      deleteBodyDiv(div)
    }
  })

  it('keeps state value when focused and props value changes to equivalent', () => {
    const item = { key: '111', value: 'AAA' }
    const onChange = sinon.spy()
    const div = createBodyDiv()
    const autosuggest = mount(<Autosuggest datalist={[item]} datalistOnly
      itemAdapter={new KeyAndValueItemAdapter()} onChange={onChange} valueIsItem />,
      { attachTo: div })
    try {
      const input = autosuggest.find('input')
      const inputDOM = ReactDOM.findDOMNode(input.node)
      inputDOM.focus()
      inputType(input, 'a')
      expect(autosuggest.state().inputValue).to.equal('AAA')
      expect(onChange).to.have.been.calledWith(item)
      autosuggest.setProps({ value: 'aaa' })
      expect(autosuggest.state().inputValue).to.equal('AAA')
      expect(onChange).to.have.been.calledOnce
    } finally {
      autosuggest.detach()
      deleteBodyDiv(div)
    }
  })

  it('keeps existing selection when partial datalist changes and datalistOnly', () => {
    const item1 = { value: 'foo' }
    const autosuggest = mount(<Autosuggest datalist={[item1]} value={item1}
      valueIsItem datalistOnly datalistPartial />)
    expect(autosuggest.state().inputValue).to.equal('foo')
    const item2 = { value: 'bar' }
    autosuggest.setProps({ datalist: [item2] })
    expect(autosuggest.state().inputValue).to.equal('foo')
  })

  it('drops down when when datalist message changes', () => {
    const div = createBodyDiv()
    const autosuggest = mount(<Autosuggest />, { attachTo: div })
    try {
      const input = autosuggest.find('input')
      const inputDOM = ReactDOM.findDOMNode(input.node)
      inputDOM.focus()
      expect(isDropdownOpen(autosuggest)).to.be.false
      const datalistMessage = 'hello'
      autosuggest.setProps({ datalistMessage })
      expect(isDropdownOpen(autosuggest)).to.be.true
      expectItems(autosuggest, [datalistMessage])
    } finally {
      autosuggest.detach()
      deleteBodyDiv(div)
    }
  })

  const states = [
    { key: 'AL', value: 'Alabama' },
    { key: 'AK', value: 'Alaska' },
    { key: 'AZ', value: 'Arizona' },
    { key: 'AR', value: 'Arkansas' },
    { key: 'CA', value: 'California' },
    { key: 'CO', value: 'Colorado' },
    { key: 'CT', value: 'Connecticut' },
    { key: 'DE', value: 'Delaware' },
    { key: 'FL', value: 'Florida' },
    { key: 'GA', value: 'Georgia' },
    { key: 'HI', value: 'Hawaii' },
    { key: 'ID', value: 'Idaho' },
    { key: 'IL', value: 'Illinois' },
    { key: 'IN', value: 'Indiana' },
    { key: 'IA', value: 'Iowa' },
    { key: 'KS', value: 'Kansas' },
    { key: 'KY', value: 'Kentucky' },
    { key: 'LA', value: 'Louisiana' },
    { key: 'ME', value: 'Maine' },
    { key: 'MD', value: 'Maryland' },
    { key: 'MA', value: 'Massachusetts' },
    { key: 'MI', value: 'Michigan' },
    { key: 'MN', value: 'Minnesota' },
    { key: 'MS', value: 'Mississippi' },
    { key: 'MO', value: 'Missouri' },
    { key: 'MT', value: 'Montana' },
    { key: 'NE', value: 'Nebraska' },
    { key: 'NV', value: 'Nevada' },
    { key: 'NH', value: 'New Hampshire' },
    { key: 'NJ', value: 'New Jersey' },
    { key: 'NM', value: 'New Mexico' },
    { key: 'NY', value: 'New York' },
    { key: 'NC', value: 'North Carolina' },
    { key: 'ND', value: 'North Dakota' },
    { key: 'OH', value: 'Ohio' },
    { key: 'OK', value: 'Oklahoma' },
    { key: 'OR', value: 'Oregon' },
    { key: 'PA', value: 'Pennsylvania' },
    { key: 'RI', value: 'Rhode Island' },
    { key: 'SC', value: 'South Carolina' },
    { key: 'SD', value: 'South Dakota' },
    { key: 'TN', value: 'Tennessee' },
    { key: 'TX', value: 'Texas' },
    { key: 'UT', value: 'Utah' },
    { key: 'VT', value: 'Vermont' },
    { key: 'VA', value: 'Virginia' },
    { key: 'WA', value: 'Washington' },
    { key: 'WV', value: 'West Virginia' },
    { key: 'WI', value: 'Wisconsin' },
    { key: 'WY', value: 'Wyoming' }
  ]

  it('supports custom item adapter and multiple text representations', () => {
    const autosuggest = mount(<Autosuggest
        datalist={states} itemAdapter={new KeyAndValueItemAdapter()} datalistOnly />)
    const input = autosuggest.find('input')
    expect(input).to.have.length(1)
    inputType(input, 't')
    expect(autosuggest.state().inputValue).to.equal('t')
    expect(isDropdownOpen(autosuggest)).to.be.true
    expect(getItems(autosuggest)).to.have.length(16)
    inputType(input, 'x')
    expect(autosuggest.state().inputValue).to.equal('Texas')
    expectItems(autosuggest, ['Texas', SHOW_ALL])
  })

  it('supports changing item adapter', () => {
    const autosuggest = mount(<Autosuggest datalist={states} datalistOnly />)
    const input = autosuggest.find('input')
    expect(input).to.have.length(1)
    inputType(input, 't')
    expect(autosuggest.state().inputValue).to.equal('t')
    expect(isDropdownOpen(autosuggest)).to.be.true
    expect(getItems(autosuggest)).to.have.length(16)
    inputType(input, 'x')
    expect(autosuggest.state().inputValue).to.equal('tx')
    expectItems(autosuggest, [SHOW_ALL])
    autosuggest.setProps({ itemAdapter: new KeyAndValueItemAdapter() })
    expect(autosuggest.state().inputValue).to.equal('tx')
    inputBsDel(input, backspaceKey)
    expect(autosuggest.state().inputValue).to.equal('t')
    inputType(input, 'x')
    expect(autosuggest.state().inputValue).to.equal('Texas')
    expectItems(autosuggest, ['Texas', SHOW_ALL])
    autosuggest.setProps({ itemAdapter: null })
    input.simulate('change', { target: { value: 't' } })
    expect(autosuggest.state().inputValue).to.equal('t')
    inputType(input, 'x')
    expect(autosuggest.state().inputValue).to.equal('tx')
    expectItems(autosuggest, [SHOW_ALL])
  })

  it('selects without completion if match with additional options', () => {
    const onChange = sinon.spy()
    const onSelect = sinon.spy()
    const div = createBodyDiv()
    const autosuggest = mount(<Autosuggest datalist={states} datalistOnly
        itemAdapter={new KeyAndValueItemAdapter()} onChange={onChange}
        onSelect={onSelect} />,
      { attachTo: div })
    try {
      const input = autosuggest.find('input')
      expect(input).to.have.length(1)
      const inputDOM = ReactDOM.findDOMNode(input.node)
      inputDOM.focus()

      inputType(input, 'n')
      expect(autosuggest.state().inputValue).to.equal('n')
      expect(isDropdownOpen(autosuggest)).to.be.true
      let items = getItems(autosuggest)
      expect(items).to.have.length(34)
      expect(items[0]).to.equal('Nebraska')
      expect(onChange).to.not.have.been.called
      expect(onSelect).to.not.have.been.called

      inputType(input, 'd')
      expect(autosuggest.state().inputValue).to.equal('nd')
      expectItems(autosuggest, ['North Dakota', 'Indiana', 'Maryland',
        'Rhode Island', SHOW_ALL])
      expect(onChange).to.have.been.calledWith('nd')
      expect(onSelect).to.have.been.calledWith({ key: 'ND', value: 'North Dakota' })

      // also test Enter key selecting first option
      simulateKeyDownUp(input, enterKey)
      expect(autosuggest.state().inputValue).to.equal('North Dakota')
      expect(isDropdownOpen(autosuggest)).to.be.false
      expect(onChange).to.have.been.calledWith('North Dakota')
      expect(onSelect).to.have.been.calledOnce
    } finally {
      autosuggest.detach()
      deleteBodyDiv(div)
    }
  })

  it('selects without completion if match with additional options and valueIsItem', () => {
    const onChange = sinon.spy()
    const onSelect = sinon.spy()
    const autosuggest = mount(<Autosuggest datalist={states} datalistOnly
        itemAdapter={new KeyAndValueItemAdapter()} onChange={onChange}
        onSelect={onSelect} valueIsItem />)
    const input = autosuggest.find('input')
    expect(input).to.have.length(1)

    inputType(input, 'n')
    expect(autosuggest.state().inputValue).to.equal('n')
    expect(isDropdownOpen(autosuggest)).to.be.true
    let items = getItems(autosuggest)
    expect(items).to.have.length(34)
    expect(items[0]).to.equal('Nebraska')
    expect(onChange).to.not.have.been.called
    expect(onSelect).to.not.have.been.called

    inputType(input, 'd')
    expect(autosuggest.state().inputValue).to.equal('nd')
    expectItems(autosuggest, ['North Dakota', 'Indiana', 'Maryland',
      'Rhode Island', SHOW_ALL])
    const ndItem = { key: 'ND', value: 'North Dakota' }
    expect(onChange).to.have.been.calledWith(ndItem)
    expect(onSelect).to.have.been.calledWith(ndItem)

    // simulate onChange/onSelect being used to feed new value back to props
    autosuggest.setProps({ value: ndItem })
    expect(autosuggest.state().inputValue).to.equal('North Dakota')
    expect(onChange).to.have.been.calledOnce
    expect(onSelect).to.have.been.calledOnce
  })

  it('closes dropdown if enter pressed with input focused and no matches', () => {
    const div = createBodyDiv()
    const autosuggest = mount(<Autosuggest datalist={['ab']} />,
      { attachTo: div })
    try {
      const input = autosuggest.find('input')
      expect(input).to.have.length(1)
      const inputDOM = ReactDOM.findDOMNode(input.node)
      inputDOM.focus()

      inputType(input, 'a')
      expect(autosuggest.state().inputValue).to.equal('a')
      expect(isDropdownOpen(autosuggest)).to.be.true
      expectItems(autosuggest, ['ab'])

      inputType(input, 'c')
      expect(autosuggest.state().inputValue).to.equal('ac')
      expectItems(autosuggest, [SHOW_ALL])

      simulateKeyDownUp(input, enterKey)
      expect(autosuggest.state().inputValue).to.equal('ac')
      expect(isDropdownOpen(autosuggest)).to.be.false
    } finally {
      autosuggest.detach()
      deleteBodyDiv(div)
    }
  })

  it('completes after rendering (for IE8)', () => {
    const autosuggest = mount(<Autosuggest datalist={['foo']} datalistOnly />)
    autosuggest.node._autoCompleteAfterRender = true
    const input = autosuggest.find('input')
    expect(input).to.have.length(1)
    inputType(input, 'F')
    expect(autosuggest.state().inputValue).to.equal('foo')
    expect(isDropdownOpen(autosuggest)).to.be.true
  })

  it('completes using item value', () => {
    const item = { value: 'foo' }
    const autosuggest = mount(<Autosuggest datalist={[item]} datalistOnly />)
    const input = autosuggest.find('input')
    expect(input).to.have.length(1)
    inputType(input, 'F')
    expect(autosuggest.state().inputValue).to.equal('foo')
    expect(isDropdownOpen(autosuggest)).to.be.true
  })

  it('supports item property names', () => {
    const item1 = { id: 0, sort: 'b', name: 'x' }
    const item2 = { id: 1, sort: 'a', name: 'y' }
    const autosuggest = mount(<Autosuggest datalist={[item1, item2]}
      itemReactKeyPropName="id" itemSortKeyPropName="sort"
      itemValuePropName="name" />)
    openMenu(autosuggest)
    expectItems(autosuggest, ['y', 'x'])
  })

  it('allows null item property names', () => {
    const autosuggest = mount(<Autosuggest datalist={['a', 'b']}
      itemReactKeyPropName={null} itemSortKeyPropName={null}
      itemValuePropName={null} />)
    openMenu(autosuggest)
    expectItems(autosuggest, ['a', 'b'])
  })

  it('includes string items ignoring case', () => {
    const items = ['foo', 'bar']
    const autosuggest = mount(<Autosuggest datalist={items} value="F" />)
    openMenu(autosuggest)
    expectItems(autosuggest, ['foo', SHOW_ALL])
  })

  it('includes using item value', () => {
    const items = [{ value: 'foo' }, { value: 'bar' }]
    const autosuggest = mount(<Autosuggest datalist={items} value="F" />)
    openMenu(autosuggest)
    expectItems(autosuggest, ['foo', SHOW_ALL])
  })

  it('renders using item value', () => {
    const item = { value: 'y' }
    const autosuggest = mount(<Autosuggest datalist={[item]} />)
    openMenu(autosuggest)
    expectItems(autosuggest, ['y'])
  })

  it('updates value state from props', () => {
    const autosuggest = mount(<Autosuggest value={'x'} />)
    expect(autosuggest.state().inputValue).to.equal('x')
    autosuggest.setProps({ value: 'y' })
    expect(autosuggest.state().inputValue).to.equal('y')
    autosuggest.setProps({ value: 123 })
    expect(autosuggest.state().inputValue).to.equal('123')
    autosuggest.setProps({ multiple: true, value: ['abc', 123] })
    expect(autosuggest.state().inputValue).to.equal('')
    expectSelected(autosuggest, ['abc', '123'])
  })

  it('supports datalist prop change', () => {
    const datalist1 = ['c', 'b', 'a']
    const autosuggest = mount(<Autosuggest datalist={datalist1} />)
    openMenu(autosuggest)
    expectItems(autosuggest, datalist1.slice().sort())
    const datalist2 = ['z', 'y', 'x']
    autosuggest.setProps({ datalist: datalist2 })
    expectItems(autosuggest, datalist2.slice().sort())
  })

  it('fires onChange when value changes in state', () => {
    const onChange = sinon.spy()
    const autosuggest = mount(<Autosuggest onChange={onChange} />)
    const input = autosuggest.find('input')
    expect(input).to.have.length(1)

    expect(autosuggest.state().inputValue).to.equal('')
    inputType(input, 'x')
    expect(autosuggest.state().inputValue).to.equal('x')
    expect(onChange).to.have.been.calledWith('x')
  })

  it('fires onChange with item argument when valueIsItem', () => {
    const items = { '1': 'foo', '2': 'bar' }
    const onChange = sinon.spy()
    const autosuggest = mount(
      <Autosuggest datalist={items} datalistOnly onChange={onChange} valueIsItem />)
    const input = autosuggest.find('input')
    expect(input).to.have.length(1)

    inputType(input, 'x')
    expect(autosuggest.state().inputValue).to.equal('x')
    expect(onChange).to.not.have.been.called

    inputBsDel(input, backspaceKey)
    expect(autosuggest.state().inputValue).to.equal('')
    expect(onChange).to.not.have.been.called

    inputType(input, 'f')
    expect(autosuggest.state().inputValue).to.equal('foo')
    expect(onChange).to.have.been.calledWith({ key: '1', value: 'foo' })

    inputBsDel(input, backspaceKey)
    expect(autosuggest.state().inputValue).to.equal('f')
    expect(onChange).to.have.been.calledOnce
    inputBsDel(input, backspaceKey)
    expect(autosuggest.state().inputValue).to.equal('')
    expect(onChange).to.have.been.calledWith(null)
  })

  it('fires onChange when selections change for multiple', () => {
    const onChange = sinon.spy()
    const autosuggest = mount(<Autosuggest multiple onChange={onChange} />)
    const input = autosuggest.find('input')
    expect(input).to.have.length(1)

    simulateKeyDown(input, enterKey)
    expect(onChange).to.not.have.been.called
    expectSelected(autosuggest, [])
    inputType(input, 'a')
    inputType(input, 'b')
    inputType(input, 'c')
    expect(autosuggest.state().inputValue).to.equal('abc')
    expect(onChange).to.not.have.been.called
    simulateKeyDown(input, enterKey)
    expectSelected(autosuggest, ['abc'])
    expect(onChange).to.have.been.calledWith(['abc'])
    expect(autosuggest.state().inputValue).to.equal('')
  })

  it('fires onAdd when item selected for multiple', () => {
    const onAdd = sinon.spy()
    const autosuggest = mount(<Autosuggest multiple onAdd={onAdd} />)
    const input = autosuggest.find('input')
    expect(input).to.have.length(1)

    inputType(input, 'a')
    inputType(input, 'b')
    inputType(input, 'c')
    expect(autosuggest.state().inputValue).to.equal('abc')
    expect(onAdd).to.not.have.been.called
    simulateKeyDown(input, enterKey)
    expectSelected(autosuggest, ['abc'])
    expect(onAdd).to.have.been.calledWith('abc')
    expect(autosuggest.state().inputValue).to.equal('')
  })

  it('disallows duplicates by default for multiple', () => {
    const onAdd = sinon.spy()
    const autosuggest = mount(<Autosuggest multiple onAdd={onAdd} />)
    const input = autosuggest.find('input')
    expect(input).to.have.length(1)

    inputType(input, 'a')
    inputType(input, 'b')
    inputType(input, 'c')
    simulateKeyDown(input, enterKey)
    inputType(input, 'a')
    inputType(input, 'b')
    inputType(input, 'c')
    simulateKeyDown(input, enterKey)
    expectSelected(autosuggest, ['abc'])
    expect(onAdd).to.have.been.calledOnce
    expect(autosuggest.state().inputValue).to.equal('')
  })

  it('fires onChange/onRemove when item removed for multiple', () => {
    const onChange = sinon.spy()
    const onRemove = sinon.spy()
    const autosuggest = mount(<Autosuggest multiple defaultValue={[1, 2, 3]}
      onChange={onChange} onRemove={onRemove} />)
    expectSelected(autosuggest, ['1', '2', '3'])

    const choices = autosuggest.find('.autosuggest-choices')
    const listItems = choices.find('li')
    let close = listItems.at(1).find('.autosuggest-choice-close')
    close.simulate('click')
    expectSelected(autosuggest, ['1', '3'])
    expect(onChange).to.have.been.calledWith([1, 3])
    expect(onRemove).to.have.been.calledWith(1)

    autosuggest.setProps({ onChange: undefined, onRemove: undefined })
    close = listItems.at(0).find('.autosuggest-choice-close')
    close.simulate('click')
    expectSelected(autosuggest, ['3'])
    expect(onChange).to.have.been.calledOnce
    expect(onRemove).to.have.been.calledOnce
  })

  it('fires onSearch when input value changes', (done) => {
    const onSearch = sinon.spy()
    const autosuggest = mount(<Autosuggest onSearch={onSearch} searchDebounce={1} />)
    const input = autosuggest.find('input')
    expect(input).to.have.length(1)

    inputType(input, 'x')
    expect(onSearch).not.to.have.been.called
    inputType(input, 'y')
    expect(onSearch).not.to.have.been.called
    setTimeout(() => {
      expect(onSearch).to.have.been.calledWith('xy')
      inputBsDel(input, backspaceKey)
      expect(onSearch).to.have.been.calledOnce
      expect(autosuggest.state().inputValue).to.equal('x')
      inputType(input, 'y')
      expect(onSearch).to.have.been.calledOnce
      expect(autosuggest.state().inputValue).to.equal('xy')
      setTimeout(() => {
        expect(onSearch).to.have.been.calledOnce
        done()
      }, 1)
    }, 1)
  })

  it('opens and closes with toggle click', () => {
    const onToggle = sinon.spy()
    const div = createBodyDiv()
    const autosuggest = mount(
      <Autosuggest datalist={['x']} onToggle={onToggle} />,
      { attachTo: div })
    try {
      expect(isDropdownOpen(autosuggest)).to.be.false

      const toggle = autosuggest.find('DropdownToggle')
      expect(toggle).to.have.length(1)
      toggle.simulate('click')
      expect(isDropdownOpen(autosuggest)).to.be.true
      expect(onToggle).to.have.been.calledWith(true)
      expect(document.activeElement).to.equal(document.body)

      toggle.simulate('click')
      expect(isDropdownOpen(autosuggest)).to.be.false
      expect(onToggle).to.have.been.calledWith(false)
      expect(document.activeElement).to.equal(document.body)
    } finally {
      autosuggest.detach()
      deleteBodyDiv(div)
    }
  })

  function itClosesOnKeydown(keyCode, targetSelector) {
    const div = createBodyDiv()
    const autosuggest = mount(<Autosuggest datalist={['x']} />, { attachTo: div })
    try {
      expect(isDropdownOpen(autosuggest)).to.be.false

      const target = autosuggest.find(targetSelector)
      expect(target).to.have.length(1)
      target.simulate('keydown', { keyCode: arrowDownKey })
      expect(isDropdownOpen(autosuggest)).to.be.true

      const firstMenuItem = autosuggest.find('a').first()
      const firstMenuItemDOM = ReactDOM.findDOMNode(firstMenuItem.node)
      expect(document.activeElement).to.equal(firstMenuItemDOM)

      const input = autosuggest.find('input')
      const inputDOM = ReactDOM.findDOMNode(input.node)
      const inputFocus = sinon.spy(inputDOM, 'focus')
      target.simulate('keydown', { keyCode })
      expect(isDropdownOpen(autosuggest)).to.be.false
      expect(inputFocus).to.have.been.calledOnce
      expect(document.activeElement).to.equal(inputDOM)

      // ensure redundant close is ignored
      target.simulate('keydown', { keyCode })
      expect(isDropdownOpen(autosuggest)).to.be.false
      expect(inputFocus).to.have.been.calledOnce
      expect(document.activeElement).to.equal(inputDOM)

      inputFocus.restore()
    } finally {
      autosuggest.detach()
      deleteBodyDiv(div)
    }
  }

  it('opens with down and closes with escape in toggle',
    () => itClosesOnKeydown(27, 'DropdownToggle'))
  it('opens with down and closes with tab in toggle',
    () => itClosesOnKeydown(9, 'DropdownToggle'))

  it('opens with down and closes with escape in input',
    () => itClosesOnKeydown(27, 'input'))
  it('opens with down and closes with tab in input',
    () => itClosesOnKeydown(9, 'input'))

  it('focuses next item on down keydown when open', () => {
    const div = createBodyDiv()
    const autosuggest = mount(<Autosuggest datalist={['a', 'b']} />, { attachTo: div })
    try {
      expect(isDropdownOpen(autosuggest)).to.be.false

      const input = autosuggest.find('input')
      expect(input).to.have.length(1)
      input.simulate('keydown', { keyCode: arrowDownKey })
      expect(isDropdownOpen(autosuggest)).to.be.true
      const menuItems = autosuggest.find('a')
      const firstItemDOM = ReactDOM.findDOMNode(menuItems.first().node)
      expect(document.activeElement).to.equal(firstItemDOM)

      input.simulate('keydown', { keyCode: arrowDownKey })
      const lastItemDOM = ReactDOM.findDOMNode(menuItems.last().node)
      expect(document.activeElement).to.equal(lastItemDOM)

      input.simulate('keydown', { keyCode: arrowDownKey })
      expect(document.activeElement).to.equal(firstItemDOM)
    } finally {
      autosuggest.detach()
      deleteBodyDiv(div)
    }
  })

  it('hides toggle with empty list', () => {
    const autosuggest = mount(<Autosuggest datalist={[]} />)
    expect(isDropdownOpen(autosuggest)).to.be.false

    const toggle = autosuggest.find('DropdownToggle')
    expect(toggle).to.have.length(0)

    const input = autosuggest.find('input')
    expect(input).to.have.length(1)
    input.simulate('keydown', { keyCode: arrowDownKey })
    expect(isDropdownOpen(autosuggest)).to.be.false
  })

  it('stays closed with empty list and forced toggle', () => {
    const autosuggest = mount(<Autosuggest datalist={[]} showToggle />)
    expect(isDropdownOpen(autosuggest)).to.be.false

    const toggle = autosuggest.find('DropdownToggle')
    expect(toggle).to.have.length(1)
    expect(toggle.props().disabled).to.be.true
    toggle.simulate('click')
    expect(isDropdownOpen(autosuggest)).to.be.false

    const input = autosuggest.find('input')
    expect(input).to.have.length(1)
    input.simulate('keydown', { keyCode: arrowDownKey })
    expect(isDropdownOpen(autosuggest)).to.be.false
  })

  it('enables toggle with undefined list and onSearch', () => {
    const onSearch = sinon.spy()
    const autosuggest = mount(<Autosuggest onSearch={onSearch} />)
    expect(isDropdownOpen(autosuggest)).to.be.false

    const toggle = autosuggest.find('DropdownToggle')
    expect(toggle).to.have.length(1)
    expect(toggle.props().disabled).to.be.false
    toggle.simulate('click')
    expect(isDropdownOpen(autosuggest)).to.be.true
    expect(onSearch).to.have.been.calledWith('')

    toggle.simulate('click')
    expect(isDropdownOpen(autosuggest)).to.be.false

    toggle.simulate('click')
    expect(isDropdownOpen(autosuggest)).to.be.true
    expect(onSearch).to.have.been.calledOnce
  })

  it('stays closed when disabled', () => {
    const autosuggest = mount(<Autosuggest datalist={['foo']} disabled />)
    expect(isDropdownOpen(autosuggest)).to.be.false

    const toggle = autosuggest.find('DropdownToggle')
    expect(toggle).to.have.length(1)
    expect(toggle.props().disabled).to.be.true
    toggle.simulate('click')
    expect(isDropdownOpen(autosuggest)).to.be.false

    const input = autosuggest.find('input')
    expect(input).to.have.length(1)
    input.simulate('keydown', { keyCode: arrowDownKey })
    expect(isDropdownOpen(autosuggest)).to.be.false
  })

  it('opens on change if possible completions', () => {
    const autosuggest = mount(<Autosuggest datalist={['foo', 'bar', 'baz']} />)
    const input = autosuggest.find('input')
    expect(input).to.have.length(1)

    inputType(input, 'a')
    expect(autosuggest.state().inputValue).to.equal('a')
    expect(isDropdownOpen(autosuggest)).to.be.true
    expectItems(autosuggest, ['bar', 'baz', SHOW_ALL])
  })

  it('stays closed on change if no possible completions', () => {
    const autosuggest = mount(<Autosuggest datalist={['foo', 'bar', 'baz']} />)
    const input = autosuggest.find('input')
    expect(input).to.have.length(1)

    inputType(input, 'x')
    expect(autosuggest.state().inputValue).to.equal('x')
    expect(isDropdownOpen(autosuggest)).to.be.false
  })

  it('fires onSelect on completion', () => {
    const onSelect = sinon.spy()
    const autosuggest = mount(
      <Autosuggest datalist={['aaa', 'aba']} datalistOnly onSelect={onSelect} />)
    const input = autosuggest.find('input')
    expect(input).to.have.length(1)
    const inputDOM = ReactDOM.findDOMNode(input.node)

    inputType(input, 'a')
    expect(autosuggest.state().inputValue).to.equal('a')
    expect(onSelect).to.not.have.been.called
    expect(isDropdownOpen(autosuggest)).to.be.true
    expectItems(autosuggest, ['aaa', 'aba'])

    inputType(input, 'b')
    expect(autosuggest.state().inputValue).to.equal('aba')
    expect(onSelect).to.have.been.calledWith('aba')
    expect(inputDOM.selectionStart).to.equal(2)
    expect(inputDOM.selectionEnd).to.equal(3)
    expect(isDropdownOpen(autosuggest)).to.be.true
    expectItems(autosuggest, ['aba', SHOW_ALL])

    // onSelect should not fire redundantly
    inputType(input, 'a')
    expect(onSelect).to.have.been.calledOnce

    inputBsDel(input, backspaceKey)
    expect(autosuggest.state().inputValue).to.equal('ab')
    expect(onSelect).to.have.been.calledOnce

    inputBsDel(input, backspaceKey)
    expect(autosuggest.state().inputValue).to.equal('a')
    expect(onSelect).to.have.been.calledOnce

    inputType(input, 'A')
    expect(autosuggest.state().inputValue).to.equal('aaa')
    expect(onSelect).to.have.been.calledWith('aaa')
    expect(onSelect).to.have.been.calledTwice
  })

  it('fires onSelect when prop value changes selected item', () => {
    const item = { value: 'aaa', special: true }
    const onSelect = sinon.spy()
    const autosuggest = mount(<Autosuggest datalist={[item]} onSelect={onSelect} />)
    autosuggest.setProps({ value: 'aaa' })
    expect(onSelect).to.have.been.calledWith(item)
  })

  function itSelectsItemOnClick(onSelect) {
    const autosuggest = mount(
      <Autosuggest datalist={['foo', 'bar']} onSelect={onSelect} />)
    const toggle = autosuggest.find('DropdownToggle')
    expect(toggle).to.have.length(1)

    toggle.simulate('click')
    expect(isDropdownOpen(autosuggest)).to.be.true

    const menuItems = autosuggest.find('SafeAnchor')
    expect(menuItems).to.have.length(2)
    menuItems.last().simulate('click')
    expect(autosuggest.state().inputValue).to.equal('foo')
    expect(isDropdownOpen(autosuggest)).to.be.false
  }

  it('fires onSelect on item click', () => {
    const onSelect = sinon.spy()
    itSelectsItemOnClick(onSelect)
    expect(onSelect).to.have.been.calledWith('foo')
  })

  it('allows null onSelect on item click', () => {
    itSelectsItemOnClick(null)
  })

  it('fires onAdd on item click for multiple', () => {
    const onAdd = sinon.spy()
    const autosuggest = mount(
      <Autosuggest datalist={['foo', 'bar']} multiple onAdd={onAdd} />)
    const toggle = autosuggest.find('DropdownToggle')
    expect(toggle).to.have.length(1)

    toggle.simulate('click')
    expect(isDropdownOpen(autosuggest)).to.be.true
    expectSelected(autosuggest, [])

    const menuItems = autosuggest.find('SafeAnchor')
    expect(menuItems).to.have.length(2)
    menuItems.last().simulate('click')
    expect(isDropdownOpen(autosuggest)).to.be.false
    expect(onAdd).to.have.been.calledWith('foo')
    expectSelected(autosuggest, ['foo'])
    expect(autosuggest.state().inputValue).to.equal('')
  })

  function itDoesNotRecompleteOn(keyCode) {
    const autosuggest = mount(<Autosuggest datalist={['foo']} datalistOnly />)
    const input = autosuggest.find('input')
    expect(input).to.have.length(1)
    const inputDOM = ReactDOM.findDOMNode(input.node)

    inputType(input, 'f')
    expect(autosuggest.state().inputValue).to.equal('foo')
    expect(inputDOM.selectionStart).to.equal(1)
    expect(inputDOM.selectionEnd).to.equal(3)
    expect(isDropdownOpen(autosuggest)).to.be.true

    inputBsDel(input, keyCode)
    expect(autosuggest.state().inputValue).to.equal('f')
    expect(inputDOM.selectionStart).to.equal(1)
    expect(inputDOM.selectionEnd).to.equal(1)

    inputBsDel(input, backspaceKey)
    expect(autosuggest.state().inputValue).to.equal('')
    expect(inputDOM.selectionStart).to.equal(0)
    expect(inputDOM.selectionEnd).to.equal(0)
  }

  it('does not recomplete on backspace', () => itDoesNotRecompleteOn(backspaceKey))
  it('does not recomplete on delete', () => itDoesNotRecompleteOn(deleteKey))

  it('supports custom inputSelect', () => {
    const inputSelect = (i, v, f) => { i.setSelectionRange(0, f.length) }
    const autosuggest = mount(
      <Autosuggest datalist={['foo', 'bar']} datalistOnly inputSelect={inputSelect} />)
    const input = autosuggest.find('input')
    expect(input).to.have.length(1)
    const inputDOM = ReactDOM.findDOMNode(input.node)

    inputType(input, 'f')
    expect(autosuggest.state().inputValue).to.equal('foo')
    expect(inputDOM.selectionStart).to.equal(0)
    expect(inputDOM.selectionEnd).to.equal(3)
  })

  it('supports null inputSelect', () => {
    const autosuggest = mount(
      <Autosuggest datalist={['foo', 'bar']} datalistOnly inputSelect={null} />)
    const input = autosuggest.find('input')
    expect(input).to.have.length(1)
    const inputDOM = ReactDOM.findDOMNode(input.node)

    inputType(input, 'f')
    expect(autosuggest.state().inputValue).to.equal('foo')
    expect(inputDOM.selectionStart).to.equal(3)
    expect(inputDOM.selectionEnd).to.equal(3)
  })

  it('sorts using item value by default', () => {
    const item1 = { value: 'C' }
    const item2 = { value: 'A' }
    const item3 = { value: 'B' }
    const autosuggest = mount(<Autosuggest datalist={[item1, item2, item3]} />)
    openMenu(autosuggest)
    expectItems(autosuggest, ['A', 'B', 'C'])
  })

  it('sorts string items', () => {
    const items = ['XYZ', 'ABC', 'GHI', 'DEF']
    const autosuggest = mount(<Autosuggest datalist={items} />)
    openMenu(autosuggest)
    expectItems(autosuggest, items.slice().sort())
  })

  it('sorts numeric items', () => {
    const items = [3, 10, 1, 7, 4]
    const autosuggest = mount(<Autosuggest datalist={items} />)
    openMenu(autosuggest)
    expectItems(autosuggest, ['1', '3', '4', '7', '10'])
  })

  it('sorts using the sort key', () => {
    // use same sort key value for coverage, although that should be avoided
    // in practice because Array.sort is not guaranteed to be stable
    const item1 = { value: 'A', sortKey: 2 }
    const item2 = { value: 'B', sortKey: 1 }
    const item3 = { value: 'C', sortKey: 0 }
    const item4 = { value: 'D', sortKey: 1 }
    const items = [item1, item2, item3, item4]
    const autosuggest = mount(<Autosuggest datalist={items} />)
    openMenu(autosuggest)
    // although sort need not be stable, we do expect it to be deterministic
    expectItems(autosuggest,
      items.slice().sort((a, b) => a.sortKey - b.sortKey).map(i => i.value))
  })

  it('supports custom item comparison', () => {
    class MyItemAdapter extends ItemAdapter {
      compareItems(a, b) {
        return this.getSortKey(a).localeCompare(
          this.getSortKey(b), undefined, { numeric: true })
      }
    }
    const items = ['Item 3', 'Item 10', 'Item 1']
    const autosuggest = mount(<Autosuggest datalist={items}
      itemAdapter={new MyItemAdapter()} />)
    openMenu(autosuggest)
    expectItems(autosuggest, ['Item 1', 'Item 3', 'Item 10'])
  })

  it('sorts using ranks: matching, starts-with, containing, others', () => {
    const items = ['AAB', 'BAA', 'AAA', 'ABA', 'ABB', 'XABB']
    const autosuggest = mount(<Autosuggest datalist={items} value="B" />)
    openMenu(autosuggest)
    expectItems(autosuggest, ['BAA', 'AAB', 'ABA', 'ABB', 'XABB', SHOW_ALL])
    autosuggest.setState({ disableFilter: true })
    expectItems(autosuggest, ['BAA', 'AAB', 'ABA', 'ABB', 'XABB', 'AAA'])
    autosuggest.setProps({ value: 'ABB' })
    expectItems(autosuggest, ['ABB', 'XABB', 'AAA', 'AAB', 'ABA', 'BAA'])
  })

  it('displays show all option when no matches while typing', () => {
    const items = ['xy', 'y']
    const autosuggest = mount(<Autosuggest datalist={items} />)
    const input = autosuggest.find('input')
    expect(input).to.have.length(1)

    inputType(input, 'x')
    expect(isDropdownOpen(autosuggest)).to.be.true
    inputType(input, 'x')
    expect(autosuggest.find('.show-all')).to.have.length(1)
    expect(autosuggest.find('.no-matches')).to.have.length(1)
  })

  it('displays all items when exact match on toggle click', () => {
    const items = ['x', 'y']
    const autosuggest = mount(<Autosuggest datalist={items} defaultValue="x" />)
    openMenu(autosuggest)
    expectItems(autosuggest, ['x', 'y'])
  })

  it('displays all items when no matches on toggle click', () => {
    const items = ['x', 'y']
    const autosuggest = mount(<Autosuggest datalist={items} defaultValue="z" />)
    openMenu(autosuggest)
    expectItems(autosuggest, ['x', 'y'])
  })

  it('displays show all option when subset matches', () => {
    const items = ['xy', 'y']
    const autosuggest = mount(<Autosuggest datalist={items} defaultValue="x" />)
    openMenu(autosuggest)
    expect(autosuggest.find('.show-all')).to.have.length(1)
    expect(autosuggest.find('.no-matches')).to.have.length(0)
  })

  it('show all disables filter', () => {
    const items = ['aaa', 'baa', 'bbb']
    const autosuggest = mount(<Autosuggest datalist={items} />)
    expect(autosuggest.state().disableFilter).to.be.false
    const input = autosuggest.find('input')
    expect(input).to.have.length(1)

    inputType(input, 'b')
    expect(isDropdownOpen(autosuggest)).to.be.true
    expectItems(autosuggest, ['baa', 'bbb', SHOW_ALL])

    const menuItems = autosuggest.find('SafeAnchor')
    expect(menuItems).to.have.length(3)
    menuItems.last().simulate('click')
    expect(autosuggest.state().disableFilter).to.be.true
    expect(isDropdownOpen(autosuggest)).to.be.true
    expectItems(autosuggest, ['baa', 'bbb', 'aaa'])
  })

  it('ignores empty string value if datalistOnly', () => {
    const items = ['aaa']
    const autosuggest = shallow(<Autosuggest datalist={items} datalistOnly
      defaultValue="" />)
    expect(autosuggest.state().inputValue).to.equal('')
  })

  it('clears initial value if not matching and datalistOnly', () => {
    const items = ['aaa']
    const autosuggest = shallow(<Autosuggest datalist={items} datalistOnly
      value="aa" />)
    expect(autosuggest.state().inputValue).to.equal('')
  })

  it('clears initial value if not matching and datalistOnly and valueIsItem', () => {
    const items = ['aaa']
    const autosuggest = shallow(<Autosuggest datalist={items} datalistOnly
      value="aa" valueIsItem />)
    expect(autosuggest.state().inputValue).to.equal('')
  })

  it('drops non-matching initial values if multiple and datalistOnly set', () => {
    const items = { '111': 'aaa', '222': 'bbb' }
    const autosuggest = mount(<Autosuggest datalist={items} datalistOnly
      multiple value={['aaa', 'ccc']} />)
    expectSelected(autosuggest, ['aaa'])
  })

  it('ignores enter on non-matching value if multiple and datalistOnly set', () => {
    const items = ['a']
    const autosuggest = mount(<Autosuggest datalist={items} datalistOnly multiple />)
    const input = autosuggest.find('input')
    inputType(input, 'b')
    expect(autosuggest.state().inputValue).to.equal('b')
    simulateKeyDown(input, enterKey)
    expect(autosuggest.state().inputValue).to.equal('b')
    expectSelected(autosuggest, [])
  })

  it('clears value if not matching and datalistOnly set', () => {
    const items = { '111': 'aaa' }
    const autosuggest = mount(<Autosuggest datalist={items} value="aa" />)
    expect(autosuggest.state().inputValue).to.equal('aa')
    autosuggest.setProps({ datalistOnly: true })
    expect(autosuggest.state().inputValue).to.equal('')
    autosuggest.setProps({ value: 'aaa' })
    expect(autosuggest.state().inputValue).to.equal('aaa')
  })

  it('clears value if datalistOnly and datalist changed', () => {
    const items = new Map([['11', 'aa']])
    const autosuggest = mount(<Autosuggest datalist={items} datalistOnly value="aa" />)
    expect(autosuggest.state().inputValue).to.equal('aa')
    autosuggest.setProps({ datalist: new Map([['22', 'bb']]) })
    expect(autosuggest.state().inputValue).to.equal('')
  })

  it('drops non-matching selections if multiple, datalistOnly, and datalist changes', () => {
    const items = ['aaa', 'bbb', 'ccc']
    const autosuggest = mount(<Autosuggest datalist={items} datalistOnly
      multiple value={items} />)
    expectSelected(autosuggest, items)
    const newItems = ['aaa', 'ccc']
    autosuggest.setProps({ datalist: newItems })
    expectSelected(autosuggest, newItems)
  })

  it('resets value if not matching, datalistOnly, and blurred', (done) => {
    const div = createBodyDiv()
    const onFocus = sinon.spy()
    const onBlur = sinon.spy()
    const autosuggest = mount(
      <Autosuggest datalist={['aaa']} datalistOnly
        onFocus={onFocus} onBlur={onBlur} />,
      { attachTo: div })
    const input = autosuggest.find('input')
    expect(input).to.have.length(1)
    const inputDOM = ReactDOM.findDOMNode(input.node)

    inputDOM.focus()
    expect(onFocus).to.have.been.calledWith('')
    inputType(input, 'b')
    expect(autosuggest.state().inputValue).to.equal('b')
    inputDOM.blur()
    setTimeout(() => {
      expect(autosuggest.state().inputValue).to.equal('')
      expect(onBlur).to.have.been.calledWith('')
      expect(onFocus).to.have.been.calledOnce
      expect(onBlur).to.have.been.calledOnce

      inputDOM.focus()
      expect(onFocus).to.have.been.calledWith('')
      inputType(input, 'a')
      expect(autosuggest.state().inputValue).to.equal('aaa')
      inputDOM.blur()
      setTimeout(() => {
        expect(autosuggest.state().inputValue).to.equal('aaa')
        expect(onBlur).to.have.been.calledWith('aaa')
        expect(onFocus).to.have.been.calledTwice
        expect(onBlur).to.have.been.calledTwice
        autosuggest.detach()
        deleteBodyDiv(div)
        done()
      }, 1)
    }, 1)
  })

  it('resets value if not matching, datalistOnly, and blurred for multiple', (done) => {
    const div = createBodyDiv()
    const onFocus = sinon.spy()
    const onBlur = sinon.spy()
    const autosuggest = mount(
      <Autosuggest datalist={['aaa']} datalistOnly multiple
        onFocus={onFocus} onBlur={onBlur} />,
      { attachTo: div })
    const input = autosuggest.find('input')
    expect(input).to.have.length(1)
    const inputDOM = ReactDOM.findDOMNode(input.node)

    inputDOM.focus()
    expect(onFocus).to.have.been.calledWith([])
    inputType(input, 'b')
    expect(autosuggest.state().inputValue).to.equal('b')
    inputDOM.blur()
    setTimeout(() => {
      expect(autosuggest.state().inputValue).to.equal('')
      expect(onBlur).to.have.been.calledWith([])
      expect(onFocus).to.have.been.calledOnce
      expect(onBlur).to.have.been.calledOnce

      inputDOM.focus()
      expect(onFocus).to.have.been.calledWith([])
      inputType(input, 'a')
      expect(autosuggest.state().inputValue).to.equal('aaa')
      inputDOM.blur()
      setTimeout(() => {
        expectSelected(autosuggest, ['aaa'])
        expect(autosuggest.state().inputValue).to.equal('')
        expect(onBlur).to.have.been.calledWith(['aaa'])
        expect(onFocus).to.have.been.calledTwice
        expect(onBlur).to.have.been.calledTwice
        autosuggest.detach()
        deleteBodyDiv(div)
        done()
      }, 1)
    }, 1)
  })

  it('provides items to onFocus/onBlur if multiple and valueIsItem', (done) => {
    const div = createBodyDiv()
    const onFocus = sinon.spy()
    const onBlur = sinon.spy()
    const item1 = { key: '111', value: 'aaa' }
    const item2 = { key: '222', value: 'bbb' }
    const items = { '111': 'aaa', '222': 'bbb' }
    const autosuggest = mount(
      <Autosuggest datalist={items} datalistOnly valueIsItem multiple
        defaultValue={[{ value: 'aaa' }]} onFocus={onFocus} onBlur={onBlur} />,
      { attachTo: div })
    expectSelected(autosuggest, ['aaa'])
    const input = autosuggest.find('input')
    expect(input).to.have.length(1)
    const inputDOM = ReactDOM.findDOMNode(input.node)

    inputDOM.focus()
    expect(onFocus).to.have.been.calledWith([item1])
    inputType(input, 'b')
    expect(autosuggest.state().inputValue).to.equal('bbb')
    inputDOM.blur()
    setTimeout(() => {
      expect(autosuggest.state().inputValue).to.equal('')
      expect(onBlur).to.have.been.calledWith([item1, item2])
      expect(onFocus).to.have.been.calledOnce
      expect(onBlur).to.have.been.calledOnce

      inputDOM.focus()
      expect(onFocus).to.have.been.calledWith([item1, item2])
      autosuggest.detach()
      deleteBodyDiv(div)
      done()
    }, 1)
  })

  it('resets value if blank but required on blur', (done) => {
    const div = createBodyDiv()
    const value = 'a'
    const autosuggest = mount(
      <Autosuggest datalist={[value]} required defaultValue={value} />, { attachTo: div })
    const input = autosuggest.find('input')
    expect(input).to.have.length(1)
    const inputDOM = ReactDOM.findDOMNode(input.node)

    inputDOM.focus()
    input.simulate('change', { target: { value: '' } })
    expect(autosuggest.state().inputValue).to.equal('')
    inputDOM.blur()
    setTimeout(() => {
      expect(autosuggest.state().inputValue).to.equal('a')
      // coverage: blur occurs with valid value and onBlur undefined
      inputDOM.focus()
      inputDOM.blur()
      setTimeout(() => {
        expect(autosuggest.state().inputValue).to.equal('a')
        autosuggest.detach()
        deleteBodyDiv(div)
        done()
      }, 1)
    }, 1)
  })

  it('does not reset value if not matching, datalistOnly, and focus changes within component', (done) => {
    const div = createBodyDiv()
    const onFocus = sinon.spy()
    const onBlur = sinon.spy()
    const autosuggest = mount(
      <Autosuggest datalist={['aaa']} datalistOnly onFocus={onFocus} onBlur={onBlur} />,
      { attachTo: div })
    const input = autosuggest.find('input')
    expect(input).to.have.length(1)
    const inputDOM = ReactDOM.findDOMNode(input.node)

    inputDOM.focus()
    expect(onFocus).to.have.been.calledWith('')
    inputType(input, 'b')
    expect(autosuggest.state().inputValue).to.equal('b')
    input.simulate('keydown', { keyCode: arrowDownKey })
    expect(isDropdownOpen(autosuggest)).to.be.true
    setTimeout(() => {
      expect(autosuggest.state().inputValue).to.equal('b')
      // coverage: blur occurs with valid value and onBlur defined
      inputDOM.focus()
      inputDOM.blur()
      setTimeout(() => {
        expect(autosuggest.state().inputValue).to.equal('')
        expect(onBlur).to.have.been.calledWith('')
        expect(onFocus).to.have.been.calledOnce
        expect(onBlur).to.have.been.calledOnce
        autosuggest.detach()
        deleteBodyDiv(div)
        done()
      }, 1)
    }, 1)
  })

  it('adds value for multiple on blur', (done) => {
    const div = createBodyDiv()
    const autosuggest = mount(
      <Autosuggest multiple />, { attachTo: div })
    const input = autosuggest.find('input')
    expect(input).to.have.length(1)
    const inputDOM = ReactDOM.findDOMNode(input.node)

    inputDOM.focus()
    input.simulate('change', { target: { value: 'abc' } })
    expect(autosuggest.state().inputValue).to.equal('abc')
    inputDOM.blur()
    setTimeout(() => {
      expectSelected(autosuggest, ['abc'])
      expect(autosuggest.state().inputValue).to.equal('')
      autosuggest.detach()
      deleteBodyDiv(div)
      done()
    }, 1)
  })

  it('updated selected items from values property while focused', () => {
    const div = createBodyDiv()
    const autosuggest = mount(
      <Autosuggest multiple value={['abc']} />, { attachTo: div })
    try {
      const input = autosuggest.find('input')
      expect(input).to.have.length(1)
      const inputDOM = ReactDOM.findDOMNode(input.node)

      inputDOM.focus()
      expectSelected(autosuggest, ['abc'])
      autosuggest.setProps({ value: ['xyz'] } )
      expectSelected(autosuggest, ['xyz'])
    } finally {
      autosuggest.detach()
      deleteBodyDiv(div)
    }
  })

  it('navigates among multiple selections and input element', () => {
    const onRemove = sinon.spy()
    const div = createBodyDiv()
    const autosuggest = mount(
      <Autosuggest multiple value={['a', 'b']} onRemove={onRemove} />,
      { attachTo: div })
    try {
      expectSelected(autosuggest, ['a', 'b'])
      const input = autosuggest.find('input')
      expect(input).to.have.length(1)
      const inputDOM = ReactDOM.findDOMNode(input.node)

      const choices = autosuggest.find('.autosuggest-choices')
      let listItems = choices.find('li')
      expect(listItems).to.have.length(3)
      const aChoice = listItems.at(0)
      let bChoice = listItems.at(1)
      const aDOM = ReactDOM.findDOMNode(aChoice.node)
      let bDOM = ReactDOM.findDOMNode(bChoice.node)

      inputDOM.focus()
      expect(document.activeElement).to.equal(inputDOM)
      expect(inputDOM.selectionStart).to.equal(0)
      inputType(input, 'b')
      expect(document.activeElement).to.equal(inputDOM)
      expect(inputDOM.selectionStart).to.equal(1)
      simulateKeyDownUp(input, arrowLeftKey)
      expect(document.activeElement).to.equal(inputDOM)
      expect(inputDOM.selectionStart).to.equal(1)
      inputDOM.selectionStart = 0
      simulateKeyDownUp(input, arrowLeftKey)
      expect(document.activeElement).to.equal(bDOM)
      simulateKeyDownUp(bChoice, arrowLeftKey)
      expect(document.activeElement).to.equal(aDOM)
      simulateKeyDownUp(aChoice, arrowLeftKey)
      expect(document.activeElement).to.equal(inputDOM)
      expect(inputDOM.selectionStart).to.equal(0)
      simulateKeyDownUp(input, arrowRightKey)
      expect(document.activeElement).to.equal(inputDOM)
      expect(inputDOM.selectionStart).to.equal(0)
      inputDOM.selectionStart = 1
      simulateKeyDownUp(input, arrowRightKey)
      expect(document.activeElement).to.equal(aDOM)
      simulateKeyDownUp(aChoice, arrowRightKey)
      expect(document.activeElement).to.equal(bDOM)
      simulateKeyDownUp(bChoice, arrowRightKey)
      expect(document.activeElement).to.equal(inputDOM)
      simulateKeyDownUp(input, backspaceKey)
      expect(document.activeElement).to.equal(inputDOM)
      inputDOM.selectionStart = 0
      simulateKeyDownUp(input, backspaceKey)
      expect(document.activeElement).to.equal(bDOM)
      simulateKeyDownUp(bChoice, backspaceKey)
      expect(onRemove).to.have.been.calledWith(1)
      expectSelected(autosuggest, ['a'])
      expect(document.activeElement).to.equal(aDOM)
      simulateKeyPress(aChoice, 'c')
      expect(document.activeElement).to.equal(inputDOM)
      simulateKeyDownUp(input, enterKey)
      expectSelected(autosuggest, ['a', 'b'])
      simulateKeyDownUp(input, arrowRightKey)
      expect(document.activeElement).to.equal(aDOM)
      simulateKeyDownUp(aChoice, deleteKey)
      expect(onRemove).to.have.been.calledWith(0)
      expectSelected(autosuggest, ['b'])
      listItems = choices.find('li')
      bChoice = listItems.at(0)
      bDOM = ReactDOM.findDOMNode(bChoice.node)
      expect(document.activeElement).to.equal(bDOM)
      simulateKeyDownUp(bChoice, deleteKey)
      expect(onRemove).to.have.been.calledWith(0)
      expectSelected(autosuggest, [])
      expect(document.activeElement).to.equal(inputDOM)
      simulateKeyDownUp(input, arrowLeftKey)
      expect(document.activeElement).to.equal(inputDOM)
      simulateKeyDownUp(input, arrowRightKey)
      expect(document.activeElement).to.equal(inputDOM)
    } finally {
      autosuggest.detach()
      deleteBodyDiv(div)
    }
  })

  it('allows click focus of multiple selections and input element', () => {
    const div = createBodyDiv()
    const autosuggest = mount(
      <Autosuggest multiple value={['a', 'b']} />,
      { attachTo: div })
    try {
      expectSelected(autosuggest, ['a', 'b'])
      const input = autosuggest.find('input')
      expect(input).to.have.length(1)
      const inputDOM = ReactDOM.findDOMNode(input.node)

      const choices = autosuggest.find('.autosuggest-choices')
      choices.simulate('click')
      expect(document.activeElement).to.equal(inputDOM)

      let listItems = choices.find('li')
      expect(listItems).to.have.length(3)
      const aChoice = listItems.at(0)
      const aDOM = ReactDOM.findDOMNode(aChoice.node)

      const aChoiceLabel = aChoice.find('.autosuggest-choice-label')
      aDOM.focus() // simulated clicks don't move focus automatically
      aChoiceLabel.simulate('click')
      expect(document.activeElement).to.equal(aDOM)

      const aChoiceClose = aChoice.find('.autosuggest-choice-close')
      aChoiceClose.simulate('click')
      expectSelected(autosuggest, ['b'])
      listItems = choices.find('li')
      const bChoice = listItems.at(0)
      const bDOM = ReactDOM.findDOMNode(bChoice.node)
      expect(document.activeElement).to.equal(bDOM)

      input.simulate('click')
      expect(document.activeElement).to.equal(inputDOM)
    } finally {
      autosuggest.detach()
      deleteBodyDiv(div)
    }
  })

  it('does not change input value on validation change while focused', (done) => {
    const div = createBodyDiv()
    const autosuggest = mount(<Autosuggest datalist={['a']} datalistOnly />,
      { attachTo: div })
    const input = autosuggest.find('input')
    expect(input).to.have.length(1)
    const inputDOM = ReactDOM.findDOMNode(input.node)

    inputDOM.focus()
    inputType(input, 'a')
    expect(autosuggest.state().inputValue).to.equal('a')
    autosuggest.setProps({ datalist: ['b'] })
    expect(autosuggest.state().inputValue).to.equal('a')
    // test reset to blank if previously valid value is no longer valid
    inputDOM.blur()
    setTimeout(() => {
      expect(autosuggest.state().inputValue).to.equal('')
      // coverage: validation change with datalistOnly and empty input value
      autosuggest.setProps({ datalist: ['a'] })
      expect(autosuggest.state().inputValue).to.equal('')
      autosuggest.detach()
      deleteBodyDiv(div)
      done()
    }, 1)
  })

  it('restores previous valid value on blur after validation change', (done) => {
    const div = createBodyDiv()
    const autosuggest = mount(<Autosuggest datalist={['a']} datalistOnly />,
      { attachTo: div })
    const input = autosuggest.find('input')
    expect(input).to.have.length(1)
    const inputDOM = ReactDOM.findDOMNode(input.node)

    inputDOM.focus()
    inputType(input, 'a')
    expect(autosuggest.state().inputValue).to.equal('a')
    inputType(input, 'a')
    expect(autosuggest.state().inputValue).to.equal('aa')
    autosuggest.setProps({ datalist: ['a', 'b'] })
    expect(autosuggest.state().inputValue).to.equal('aa')
    inputDOM.blur()
    setTimeout(() => {
      expect(autosuggest.state().inputValue).to.equal('a')
      autosuggest.detach()
      deleteBodyDiv(div)
      done()
    }, 1)
  })

  it('supports custom suggestions component', () => {
    class DivSuggestions extends React.Component {
      render() {
        return <div className="my-dropdown">
          {this.props.items.map(item => <div key={this.props.getItemKey(item)}>
            {this.props.renderItem(item)}
          </div>)}
        </div>
      }
    }
    const items = ['a', 'b', 'c']
    const autosuggest = mount(<Autosuggest datalist={items}
        suggestionsClass={DivSuggestions} />)
    const toggle = autosuggest.find('DropdownToggle')
    expect(toggle).to.have.length(1)
    toggle.simulate('click')
    expect(isDropdownOpen(autosuggest)).to.be.true
    const dropdown = autosuggest.find('div.my-dropdown')
    const itemText = dropdown.children().map(div => div.text())
    expect(itemText).to.eql(items)
  })

  it('supports custom choices component', () => {
    class DivChoices extends React.Component {
      render() {
        return <div className="my-choices">
          {this.props.items.map((item, index) => <div key={index}>
            {this.props.renderItem(item)}
          </div>)}
          {this.props.children}
        </div>
      }
    }
    const values = ['a', 'b', 'c']
    const autosuggest = mount(<Autosuggest multiple value={values}
        choicesClass={DivChoices} />)
    const choices = autosuggest.find('div.my-choices')
    const itemText = choices.children().find('div').map(div => div.text())
    expect(itemText).to.eql(values)
  })
})
