import { Meteor } from 'meteor/meteor';
import React from 'react';
import Modal from '/imports/ui/components/modal.js';
import Cropper from '/imports/ui/components/cropper.js';

class Profile extends React.Component {
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
      modalTitle: ''
    }
  }
  upload(type) {
    console.log('type: ', type);
    // Update the modal title
    this.setState({modalTitle: 'Upload your ' + type});
    // Open the modal
    this.refs.uploadModal.show();
  }

  /**
   * Modal component control
   */
  modalOnConfirm() {
    console.log('Confirm');
  }

  render() {
    return (
      <div className="profile-page">
        <div className="row">
          <div className="col-xs-12 cover-container no-cover">
            <a
              className="edit-cover-btn"
              onClick={this.upload.bind(this, 'cover')}
            >
              <i className="fa fa-camera" aria-hidden="true"></i>
            </a>
          </div>
        </div>

        <Modal
          className="upload-modal"
          id="location-confirm-modal"
          btnConfirmText="Confirm"
          btnCancelText="Cancel"
          onConfirm={this.modalOnConfirm.bind(this)}
          ref="uploadModal"
          title={this.state.modalTitle}
        >
          <Cropper
            className="avatar"
            options={this.state.avatarCropperOptions}
            cropBoxData={{left: 30, top: 30,width: 160, height: 160}}
          />
        </Modal>
      </div>
    )
  }
}

export default Profile;
