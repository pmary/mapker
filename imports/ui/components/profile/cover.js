import { Meteor } from 'meteor/meteor';
import React, { PropTypes } from 'react';
import Modal from '/imports/ui/components/modal.js';
import Cropper from '/imports/ui/components/cropper.js';

class ProfileCover extends React.Component {
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
      coverCropperOptions: {
        movable: false,
        strict: true, // When false, image can't be smaller than the cropbox
        minCropBoxWidth: 422,
        minCropBoxHeight: 93,
        minCanvasWidth: 422,
        minCanvasHeight: 93,
        autoCrop: true,
        guides: false,
        dragCrop: false,
        resizable: false
      },
      modalTitle: 'Upload your cover'
    }
  }
  modalOnClose() {
    this.refs.coverCropper.reset();
  }
  upload(type) {
    // Open the modal
    this.refs.coverUploadModal.show();
  }
  /**
   * Modal component control
   */
  modalOnConfirm() {
    console.log('Confirm');
  }
  render() {
    let className = "cover-container no-cover " + this.props.type;
    return (
      <div>
        <div className={className}>
          <a
            className="edit-cover-btn"
            onClick={this.upload.bind(this, 'cover')}
          >
            <i className="fa fa-camera" aria-hidden="true"></i>
          </a>

          {this.props.children}

        </div>
        <Modal
          className="upload-modal"
          id="cover-upload-modal"
          btnConfirmText="Confirm"
          btnCancelText="Cancel"
          onClose={this.modalOnClose.bind(this)}
          onConfirm={this.modalOnConfirm.bind(this)}
          ref="coverUploadModal"
          title={this.state.modalTitle}
        >
          <Cropper
            className="avatar"
            ref="coverCropper"
            options={this.state.avatarCropperOptions}
            cropBoxData={{left: 30, top: 30,width: 160, height: 160}}
          />
        </Modal>
      </div>
    )
  }
}

ProfileCover.propTypes = {
  type: PropTypes.string
}

ProfileCover.defaultProps = {
  type: ''
}

export default ProfileCover;
