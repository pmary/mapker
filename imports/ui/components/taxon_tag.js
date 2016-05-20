import React from 'react';
import ReactDOM from 'react-dom';

class TaxonTag extends React.Component {
  /**
   * @param {text: String, id: String} props
   */
  constructor(props) {
    super(props);
  }
  handleClick() {
    this.props.onClick(this.props.skill.id);
  }
  render() {
    return (
      <div className="taxon-tag">
        <div className="pull-left">
          {this.props.skill.text}
        </div>
        <div
          className="pull-right"
          onClick={this.handleClick.bind(this)}
        >
          <i className="fa fa-times" aria-hidden="true"></i>
        </div>
      </div>
    )
  }
}

export default TaxonTag;
