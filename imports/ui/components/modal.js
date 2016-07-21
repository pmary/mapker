import React, { Component, PropTypes } from 'react';

class ModalComponent extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    $(this.refs.modal).on('hidden.bs.modal', () => {
      this.onClose();
    });
  }

  /**
   * Methods
   */
  // Method to show the modal
  show () {
    $('#'+this.props.id).modal('show');
  }
  // Method to hide the modal
  hide () {
    $('#'+this.props.id).modal('hide');
  }

  /**
   * Events
   */
  // On modal close event
  onClose() {
    this.props.onClose();
    $(this.refs.confirmBtn).button('reset');
  }
  // On modal confirm event
  onConfirm() {
    $(this.refs.confirmBtn).button('loading');
    // Return the button selector
    this.props.onConfirm($(this.refs.confirmBtn));
  }

  render() {
    var childrens = null;
    if (this.props.children && this.props.children.constructor === Array) {
      childrens  = this.props.children.map(function (child) {
        return (child);
      });
    }
    else if (typeof this.props.children === 'object')  {
      childrens = this.props.children;
    }

    return (
      <div
        className={this.props.className + " modal fade" }
        id={this.props.id}
        ref="modal"
        tabindex="-1"
        role="dialog"
      >
        <div className={this.props.size + " modal-dialog"}>
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
                {this.props.showConfirmBtn && (
                  <button
                    type="button"
                    ref="confirmBtn"
                    className="btn btn-primary"
                    onClick={this.onConfirm.bind(this)}
                    data-loading-text="<i class='fa fa-circle-o-notch fa-spin'></i>"
                  >
                    {
                      (this.props.btnConfirmText) ?
                        this.props.btnConfirmText :
                        'Confirm'
                    }
                  </button>
                )}
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
  onConfirm: PropTypes.func,
  onClose: PropTypes.func,
  id: PropTypes.string.isRequired,
  title: PropTypes.string,
  showConfirmBtn: PropTypes.bool,
  size: PropTypes.string
};

ModalComponent.defaultProps = {
  onConfirm(){},
  onClose(){},
  title: '',
  showConfirmBtn: true,
  size: ''
};

export default ModalComponent;
