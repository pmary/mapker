import React, { Component, PropTypes } from 'react';

class Range extends React.Component {
  constructor(props) {
    super(props);
  }
  onRangeChange(e) {
    e.persist();
    this.props.onMouseMove(e);
    if (e.buttons !== 1 && e.which !== 1) return;
    this.props.onChange(e);
  }
  onRangeClick(e) {
    this.props.onClick(e);
    this.props.onChange(e);
  }
  onRangeKeyDown(e) {
    this.props.onKeyDown(e);
    this.props.onChange(e);
  }
  render() {
    return (
      <input
        className={this.props.className}
        type={this.props.type}
        onChange={this.props.onChange.bind(this)}
        onClick={this.props.onClick.bind(this)}
        onKeyDown={this.props.onKeyDown.bind(this)}
        onMouseMove={this.props.onMouseMove.bind(this)}
        max={this.props.max}
        min={this.props.min}
        value={this.props.value}
      />
    )
  }
}

Range.defaultProps = {
  type: 'range',
  onChange: function(){},
  onClick: function(){},
  onKeyDown: function(){},
  onMouseMove: function(){}
}

Range.propTypes = {
  onChange: React.PropTypes.func,
  onClick: React.PropTypes.func,
  onKeyDown: React.PropTypes.func,
  onMouseMove: React.PropTypes.func
}

export default Range;
