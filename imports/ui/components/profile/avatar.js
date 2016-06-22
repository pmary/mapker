import { Meteor } from 'meteor/meteor';
import React, { PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import Modal from '/imports/ui/components/modal.js';
import Cropper from '/imports/ui/components/cropper.js';

class ProfileAvatar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      avatarCropperOptions: {
        viewMode: 1,
        dragMode: 'move',
        aspectRatio: 1/1,
        guides: false,
        center: false,
        cropBoxMovable: false,
        cropBoxResizable: false,
        minCropBoxWidth: 160,
        minCropBoxHeight: 160,
        minCanvasWidth: 160,
        minCanvasHeight: 160,
        movable: true,
        toggleDragModeOnDblclick: false,
        zoomable: true,
        zoomOnTouch: false,
        zoomOnWheel: false
      },
      modalTitle: 'Upload your avatar',
      modalShowConfirmBtn: false
    }
  }
  modalOnClose() {
    this.refs.avatarCropper.reset();
    // Hide the modal confirm button
    this.setState({modalShowConfirmBtn: false});
  }
  /**
   * @description
   * At the modal confirm event, get the cropped image Blob data and upload it
   */
  modalOnConfirm() {
    // Get the cropped image Blob data
    var dataURL = this.refs.avatarCropper.getCroppedDataUrl();
    if (dataURL && this.props.type) {
      switch (this.props.type) {
        case 'user':
          Meteor.call('user.profilePicture.update', dataURL, 'avatar', (err, res) => {
            if (err) { console.log(err); }
            else {
              // Close the modal
              this.refs.avatarUploadModal.hide();
              // Hide the modal confirm button
              this.setState({modalShowConfirmBtn: false});
            }
          });
          break;

        case 'place':
          break;
      }
    }
  }
  upload(type) {
    // Open the modal
    this.refs.avatarUploadModal.show();
  }
  /**
   * Methode passed to the cropper component to get the instantiate event
   */
  onCropperInstantiate() {
    // Display the confirm btn of the modal
    this.setState({modalShowConfirmBtn: true});
  }
  render() {
    let className = "avatar-container " + this.props.type;
    var style = {};
    // If the user has a cover
    if (this.props.avatarUrl) {
      style = {backgroundImage: `url(${this.props.avatarUrl})`};
      className += ' has-avatar'
    }
    else { className += ' no-avatar'; }

    return (
      <div>
        <div className={className} style={style}>
          <a
            className="edit-avatar-btn"
            onClick={this.upload.bind(this, 'avatar')}
          >
            <i className="fa fa-camera" aria-hidden="true"></i>
          </a>
        </div>

        <Modal
          className="upload-modal"
          id="avatar-upload-modal"
          btnConfirmText="Confirm"
          btnCancelText="Cancel"
          onClose={this.modalOnClose.bind(this)}
          onConfirm={this.modalOnConfirm.bind(this)}
          showConfirmBtn={this.state.modalShowConfirmBtn}
          ref="avatarUploadModal"
          title={this.state.modalTitle}
        >
          <Cropper
            className="avatar"
            ref="avatarCropper"
            onInstantiate={this.onCropperInstantiate.bind(this)}
            options={this.state.avatarCropperOptions}
            cropBoxData={{left: 30, top: 30, width: 160, height: 160}}
            canvasData={{height: 160, width: 160}}
            outputOptions={{height: 160, width: 160}}
          />
        </Modal>
      </div>
    )
  }
}

ProfileAvatar.propTypes = {
  type: PropTypes.oneOf(['user', 'place']).isRequired,
  avatarUrl: PropTypes.string
}

ProfileAvatar.defaultProps = {
  avatarUrl: null
}

/**
 * Create a container component to reactively render the wrapped component in
 * response to any changes to reactive data sources accessed from inside the
 * function proded to it.
 *
 * @see http://guide.meteor.com/react.html#data
 */
/*export default createContainer (({ params }) => {
  const user = Meteor.user();

  return {
    user
  }

}, ProfileAvatar);*/
export default ProfileAvatar;
