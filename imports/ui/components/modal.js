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
    var childrens = this.props.children.map(function (child) {
      return (child);
    });

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
              { childrens }
            </div>
            <div className="modal-footer">
              <div className="pull-right">
                <button type="button" className="btn btn-primary">
                  {
                    this.props.btnConfirmText ?
                      this.props.btnConfirmText :
                      'Confirm'
                  }
                </button>
              </div>
              <div className="pull-left">
                <button
                  type="button"
                  className="btn btn-default"
                  data-dismiss="modal"
                >
                  {
                    this.props.btnCancelText ?
                      this.props.btnCancelText :
                      'Cancel'
                  }
                </button>
              </div>
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
