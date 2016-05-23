import React, { Component, PropTypes } from 'react';

class ModalComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  show () {
    $('#'+this.props.id).modal('show');
  }

  hide () {
    $('#'+this.props.id).modal('hide');
  }

  render() {
    return (
      <div
        className={this.props.className + " modal fade" }
        id={this.props.id}
        tabindex="-1"
        role="dialog"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
              <h4 className="modal-title">{this.props.title}</h4>
            </div>
            <div className="modal-body">
              {this.props.body}
            </div>
            <div className="modal-footer">
              {this.props.footer}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

ModalComponent.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  /*body: PropTypes.string,
  offset: PropTypes.number,
  stack: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  effect: PropTypes.string,
  beep: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.bool]),
  timeout: PropTypes.oneOfType([PropTypes.oneOf(['none']), PropTypes.number]),
  html: PropTypes.bool,
  onClose: PropTypes.func,
  onShow: PropTypes.func,
  customFields: PropTypes.object,
  contentTemplate: PropTypes.func*/
};

export default ModalComponent;
