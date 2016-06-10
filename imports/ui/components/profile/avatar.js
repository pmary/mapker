import { Meteor } from 'meteor/meteor';
import React from 'react';
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
    console.log('Close !');
    this.refs.avatarCropper.reset();
  }
  upload(type) {
    // Open the modal
    this.refs.avatarUploadModal.show();
  }
  /**
   * Modal component control
   */
  modalOnConfirm() {
    console.log('Confirm');
  }
  render() {
    return (
      <div>
        <div className="avatar-container no-avatar">
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

export default ProfileAvatar;
