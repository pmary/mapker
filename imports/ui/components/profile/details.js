import { Meteor } from 'meteor/meteor';
import React, { PropTypes } from 'react';
import Modal from '/imports/ui/components/modal.js';
//import ProfileDetailsEdition from '/imports/ui/components/profile/details_edition.js';
import MapComponent from '/imports/ui/components/map.js';

class ProfileDetails extends React.Component {
  constructor(props) {
    super(props);
  }

  handleClickEditDetails(e) {
    console.log('handleClickEditDetails');
    this.refs.detailsEditionModal.show();
    // Re-render the map to be sur that it will fit to the modal size
    setTimeout( () => {
      this.refs.mapComponent.invalidateSize();
      this.refs.mapComponent.disableZoom();
    }, 300);
  }

  /**
   * Edit details modal methods
   */
  // On modal confirm
  modalEditDetailsOnConfirm() {

  }
  // Called by the MapComponent when a revese geocoding request is a success
  mapReverseGeocoding(place) {
    // Pass the place to the geocoder param
    //this.refs.modalGeocoder.updateInputValue(place.place_name);
    // Set the confirmedPlace
    //this.setState({confirmedPlace: place});
  }

  render() {
    return (
      <div className="col-xs-12 profile-details-container">
        <div
          className="
          col-xs-12
          col-sm-12
          col-md-8 col-md-offset-2
          col-lg-8 col-lg-offset-2"
        >
          <div className="pull-left">
            <span className={`picto-sprite-${this.props.type}-no-legend`}></span>

            <span className="profile-details-container__username">
              {this.props.name}
              <span className="profile-details-container__alias">
                @{this.props.alias}
              </span>
            </span>
            <span className="profile-details-container__main-activity">
              {this.props.headline}
            </span>
            <span className="profile-details-container__location">
              {this.props.location}
            </span>
          </div>

          <div
            className="pull-left details-edit-btn"
            onClick={this.handleClickEditDetails.bind(this)}
          >
            <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
          </div>

          <div className="pull-right social-links-container">
            <a href="#" target="_blank" className="social-icon social-icon-30-facebook">
              <span>Facebook</span>
            </a>
            <a href="#" target="_blank" className="social-icon social-icon-30-twitter">
              <span>Twitter</span>
            </a>
            <a href="#" target="_blank" className="social-icon social-icon-30-flickr">
              <span>Flickr</span>
            </a>
            <a href="#" target="_blank" className="social-icon social-icon-30-website"><span>
              Personal website</span>
            </a>
          </div>
        </div>

        <Modal
          className="profile-details-edition-modal"
          id={"profile-details-edition-modal"}
          btnConfirmText="Save"
          btnCancelText="Cancel"
          onConfirm={this.modalEditDetailsOnConfirm.bind(this)}
          ref="detailsEditionModal"
          title="Edit your details"
        >
          <MapComponent
            ref="mapComponent"
            accessToken="pk.eyJ1Ijoic2hlY2twYXIiLCJhIjoiMTNzTlE1OCJ9.wY4R3ybKOIbLiBEjQMXBpw"
            mapId="mapbox.run-bike-hike"
            source="mapbox.places"
            onReverseGeocoding={this.mapReverseGeocoding.bind(this)}
          />
        </Modal>
      </div>
    )
  }
}

ProfileDetails.propTypes = {
  type: PropTypes.oneOf(['user', 'place']).isRequired,
  name: PropTypes.string.isRequired,
  alias: PropTypes.string.isRequired,
  headline: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired
}

ProfileDetails.defaultProps = {
  type: null
}

export default ProfileDetails;
