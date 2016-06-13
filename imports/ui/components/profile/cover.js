import { Meteor } from 'meteor/meteor';
import React, { PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import Modal from '/imports/ui/components/modal.js';
import Cropper from '/imports/ui/components/cropper.js';

class ProfileCover extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      coverCropperOptions: {
        viewMode: 1,
        dragMode: 'move',
        aspectRatio: 256/75,
        guides: false,
        center: false,
        cropBoxMovable: false,
        cropBoxResizable: false,
        minCropBoxWidth: 420,
        minCropBoxHeight: 110,
        minCanvasWidth: 420,
        minCanvasHeight: 110,
        movable: true,
        toggleDragModeOnDblclick: false,
        zoomable: true,
        zoomOnTouch: false,
        zoomOnWheel: false
      },
      modalTitle: 'Upload your cover',
      modalShowConfirmBtn: false
    }
  }
  modalOnClose() {
    this.refs.coverCropper.reset();
    // Hide the modal confirm button
    this.setState({modalShowConfirmBtn: false});
  }
  /**
   * @description
   * At the modal confirm event, get the cropped image Blob data and upload it
   */
  modalOnConfirm() {
    // Get the cropped image Blob data
    var dataURL = this.refs.coverCropper.getCroppedDataUrl();
    if (dataURL && this.props.type) {
      switch (this.props.type) {
        case 'user':
          Meteor.call('user.profilePicture.update', dataURL, 'cover', (err, res) => {
            if (err) { console.log(err); }
            else {
              // Close the modal
              this.refs.coverUploadModal.hide();
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
    this.refs.coverUploadModal.show();
  }
  /**
   * Methode passed to the cropper component to get the instantiate event
   */
  onCropperInstantiate() {
    // Display the confirm btn of the modal
    this.setState({modalShowConfirmBtn: true});
  }
  render() {
    let className = "cover-container " + this.props.type;
    var style = {};
    // If the user has a cover
    if (
      this.props.user &&
      this.props.user.profile &&
      this.props.user.profile.cover &&
      this.props.user.profile.cover.url
    ) {
      style = {backgroundImage: `url(${this.props.user.profile.cover.url})`};
      className += ' has-cover'
    }
    else { className += ' no-cover'; }

    return (
      <div>
        <div className={className} style={style}>
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
          showConfirmBtn={this.state.modalShowConfirmBtn}
          ref="coverUploadModal"
          title={this.state.modalTitle}
        >
          <Cropper
            className="cover"
            ref="coverCropper"
            onInstantiate={this.onCropperInstantiate.bind(this)}
            options={this.state.coverCropperOptions}
            cropBoxData={{left: 30, top: 30, width: 110, height: 420}}
            canvasData={{height: 420, width: 110}}
          />
        </Modal>
      </div>
    )
  }
}

ProfileCover.propTypes = {
  type: PropTypes.oneOf(['user', 'place']),
  user: PropTypes.object
}

ProfileCover.defaultProps = {
  type: null
}

/**
 * Create a container component to reactively render the wrapped component in
 * response to any changes to reactive data sources accessed from inside the
 * function proded to it.
 *
 * @see http://guide.meteor.com/react.html#data
 */
export default createContainer (({ params }) => {
  const user = Meteor.user();

  return {
    user
  }

}, ProfileCover);
