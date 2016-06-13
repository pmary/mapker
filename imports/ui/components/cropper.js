import React, { Component, PropTypes } from 'react';
import Alert from 'react-s-alert';
import Cropper from 'cropperjs'; // @see https://github.com/fengyuanchen/cropperjs
//import Range from '/imports/ui/components/range.js';
import Range from 'range-input-react';
import 'range-input-react/style.css';

class CropperComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      uploadedImage: null,
      rangeValue: 0,
      cropper: null // A Cropper instance
    };
  }

  /**
   * Open the file browser by triggering the file input
   */
  openFileBrowser() {
    // Open the upload file browser
		this.refs.inputFile.click();
  }

  /**
   * Handle the file change
   */
  onChangeFile(e) {
    // Get the file
    var file = e.target.files[0];
    console.log('file: ', file);

    // If there is a file but its size is too large
    if (file && file.size >= 2097152) {
      // Display an error
      Alert.warning('The file size is too large to upload (max 2MB)', {
        position: 'top-right',
        effect: 'jelly'
      });
    }
    // If the file type is not authorized
    else if (
      file &&
      (file.type !== "image/jpeg" && file.type !== "image/png")
    ) {
      // Display an error
      Alert.warning('Only jpeg and png images are authorized', {
        position: 'top-right',
        effect: 'jelly'
      });
    }
    else {
      // Read the image
      var reader = new FileReader();
      reader.onload = (e) => {
        // Display the image into the preview
        this.setState({uploadedImage: e.target.result});
        this.refs.previewImg.src = e.target.result;

        // Init an cropper instance
        this.setState({cropper: new Cropper(this.refs.previewImg, this.props.options) });

        // When the cropper instance has built completely
        this.refs.previewImg.addEventListener('built', () => {
          if  (this.props.cropBoxData) {
            this.state.cropper.setCropBoxData(this.props.cropBoxData);
            this.state.cropper.setCanvasData({height: 160, width: 160});
          }
          this.state.cropper.zoomTo(0);
        });
      }
      reader.readAsDataURL(file);
    }
  }
  rangeChange(e){
    this.setState({rangeValue: parseInt(e.target.value)});
    // If there is a cropper instance
    if (this.state.cropper) {
      this.state.cropper.zoomTo(e.target.value/100);
    }
  }

  /**
   * Reset the cropper state
   */
  reset() {
    // Destroy the cropper instance
    if (this.state.cropper) { this.state.cropper.destroy(); }
    // Clear the file input
    this.refs.inputFile.value = null;
    // Reset the component state
    this.setState({
      uploadedImage: null,
      rangeValue: 0,
      cropper: null // A Cropper instance
    });
  }

  /**
   * Crop the image
   * @return {Object} A promise, then an image blob
   */
  getCroppedDataUrl() {
    if (!this.state.cropper) { return; }

    let dataURL = this.state.cropper.getCroppedCanvas({
      width: 160, height: 160, fillColor: "#ffffff"
    }).toDataURL();

    return dataURL;
  }

  render() {
    return (
      <div className={this.props.className + ' cropper-component'}>
        <input
          type="file"
          className="input-file"
          ref="inputFile"
          onChange={this.onChangeFile.bind(this)}
        />

        {/* Display the upload zone only if no image has been uploaded */}
        { !this.state.uploadedImage &&
          (<div
            className="upload-area"
            onClick={this.openFileBrowser.bind(this)}
          >
            Click to browse your files
          </div>)
        }

        {/* Display the preview only if an image has been uploaded */}
        { this.state.uploadedImage &&
          (<div>
            <div className="cropper-wrapper">
              <img ref="previewImg" className="cropper-img" src="#" alt="Your image" />
            </div>
            <div className="slider-container">
              <i className="fa fa-picture-o" aria-hidden="true"></i>
              <Range
                className='slider material'
                onChange={this.rangeChange.bind(this)}
                type='range'
                value={this.state.rangeValue}
                min={0}
                max={300}
              />
              <i className="fa fa-picture-o" aria-hidden="true"></i>
            </div>
          </div>)
        }
      </div>
    )
  }
}

export default CropperComponent;
