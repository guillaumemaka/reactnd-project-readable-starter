import React, { Component } from 'react'
import { Input, Dropdown, NavItem, Button } from 'react-materialize'
import PropTypes from 'prop-types'
import './SortControl.css'

class SortControl extends Component {
  static defaultProps = {
    direction: 'asc'
  }

  static propTypes = {
    onSortChange: PropTypes.func.isRequired,
    defaultSortKey: PropTypes.string,
    sortKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
    sortLabels: (props, propName, componentName) => {
      if (!Array.isArray(props[propName])) {
        return new Error(`
          ${componentName} property '${propName}' should be an array.
        `)
      }

      if (props['sortKeys'].length !== props[propName].length) {
        return new Error(`
        ${componentName} properties 'sortKeys' and '${propName}' should have the same number of items.
        `)
      }
    }
  }

  state = {
    sortKey: '',
    direction: ''
  }

  componentWillMount() {
    this.setState({
      sortKey: this.props.defaultSortKey || this.sortKeys[0],
      direction: this.props.direction
    })
  }

  _onSortKeyChange(e) {
    this.setState({
      sortKey: e.target.value
    })

    this.props.onSortChange({
      sortKey: e.target.value,
      direction: this.state.direction
    })
  }
  _onSortDirectionChange(e) {
    this.setState({ direction: e.target.value })
    this.props.onSortChange({
      sortKey: this.state.sortKey,
      direction: e.target.value
    })
  }

  render() {
    const { sortKeys, sortLabels } = this.props
    return (
      <Dropdown
        className="SortControl"
        trigger={
          <Button
            className="SortControl__Trigger cyan darken-3"
            icon="swap_vert"
            floating
          />
        }
      >
        <span>Sort By</span>
        {sortKeys.map((k, i) => {
          return (
            <NavItem key={k}>
              <Input
                name="sortBy"
                type="radio"
                label={sortLabels[i]}
                value={k}
                checked={this.state.sortKey === k}
                onChange={this._onSortKeyChange.bind(this)}
              />
            </NavItem>
          )
        })}
        <span>Direction</span>
        <NavItem>
          <Input
            type="radio"
            label="Asc"
            name="direction"
            value="asc"
            onChange={this._onSortDirectionChange.bind(this)}
            checked={this.state.direction === 'asc'}
          />
        </NavItem>
        <NavItem>
          <Input
            type="radio"
            label="Desc"
            name="direction"
            value="desc"
            onChange={this._onSortDirectionChange.bind(this)}
            checked={this.state.direction === 'desc'}
          />
        </NavItem>
      </Dropdown>
    )
  }
}

export default SortControl
