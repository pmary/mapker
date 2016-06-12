import { Meteor } from 'meteor/meteor';
import React, { PropTypes } from 'react';
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
      modalTitle: 'Upload your avatar'
    }
  }
  modalOnClose() {
    this.refs.avatarCropper.reset();
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
          Meteor.call('user.avatar.update', dataURL, function (err, res) {
            if (err) { console.log(err); }
            console.log(res);
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
  render() {
    let className = "avatar-container no-avatar " + this.props.type;
    return (
      <div>
        <div className={className}>
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
          ref="avatarUploadModal"
          title={this.state.modalTitle}
        >
          <Cropper
            className="avatar"
            ref="avatarCropper"
            options={this.state.avatarCropperOptions}
            cropBoxData={{left: 30, top: 30,width: 160, height: 160}}
          />
        </Modal>
      </div>
    )
  }
}

ProfileAvatar.propTypes = {
  type: PropTypes.oneOf(['user', 'place'])
}

ProfileAvatar.defaultProps = {
  type: null
}

export default ProfileAvatar;
