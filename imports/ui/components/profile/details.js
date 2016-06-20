import { Meteor } from 'meteor/meteor';
import React, { PropTypes } from 'react';
import Modal from '/imports/ui/components/modal.js';
import Alert from 'react-s-alert';
import MapComponent from '/imports/ui/components/map.js';
import Geocoder from '/imports/ui/components/geocoder.js';
import Schema from '/imports/api/users/users.js';

// Define a validation context from the users SimpleSchema
var formValidation = Schema.User.newContext();

class ProfileDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state ={
      name: props.name,
      firstname: props.firstname,
      firstnameState: {isValid: false, hasError: false},
      lastname: props.lastname,
      lastnameState: {isValid: false, hasError: false},
      headline: props.headline,
      headlineState: {isValid: false, hasError: false},
      confirmedPlace: null
    };
  }

  /**
   * Component events
   */

  onFocus(e) {
    $(e.currentTarget).parent().addClass('on-focus');
  }
  onBlur(e) {
    $(e.currentTarget).parent().removeClass('on-focus');
  }
  handleClickEditDetails(e) {
    this.refs.detailsEditionModal.show();
    // Re-render the map to be sur that it will fit to the modal size
    setTimeout( () => {
      this.refs.mapComponent.invalidateSize();
      this.refs.mapComponent.disableZoom();

      // Set the map view to the given bounding box
      if (this.props.bboxSouthWest && this.props.bboxNorthEast) {
        this.refs.mapComponent.setView(
          this.props.coordinate.lat,
          this.props.coordinate.lon,
          17
        );
      }

      // Clear the map layers
      this.refs.mapComponent.clearLayers();

      // Add the marker to the coordinate
      this.refs.mapComponent.addMarker(
        this.props.coordinate.lat,
        this.props.coordinate.lon,
        true,
        'Drag me to adjust the location'
      );
    }, 300);

    // Set the geocoder input value
    this.refs.modalGeocoder.updateInputValue(this.props.location);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      name: nextProps.name,
      firstname: nextProps.firstname,
      lastname: nextProps.lastname,
      headline: nextProps.headline
    });
  }

  onChangeName(e) {
    this.setState({name: e.target.value});
  }
  onChangeFirstname(e) {
    this.setState({firstname: e.target.value});
    this.setState({firstnameState: {
      isValid: formValidation.validateOne({
        'profile.firstname': e.target.value
      },'profile.firstname'),
      hasError: !formValidation.validateOne({
        'profile.firstname': e.target.value
      },'profile.firstname')
    }});
  }
  onChangeLastname(e) {
    this.setState({lastname: e.target.value});
    this.setState({lastnameState: {
      isValid: formValidation.validateOne({
        'profile.lastname': e.target.value
      },'profile.lastname'),
      hasError: !formValidation.validateOne({
        'profile.lastname': e.target.value
      },'profile.lastname')
    }});
  }
  onChangeHeadline(e) {
    this.setState({headline: e.target.value});
    this.setState({headlineState: {
      isValid: formValidation.validateOne({
        'profile.headline': e.target.value
      },'profile.headline'),
      hasError: !formValidation.validateOne({
        'profile.headline': e.target.value
      },'profile.headline')
    }});
  }

  /**
   * Edit details modal methods
   */
  // On modal confirm
  modalEditDetailsOnConfirm(btnPointer) {
    Meteor.call(
      'user.profileDetails.update',
      this.state.firstname,
      this.state.lastname,
      this.state.headline,
      this.state.confirmedPlace,
      (err, res) => {
        btnPointer.button('reset');
        if (err) {
          Alert.warning(`Incomplete address. \n
            The address must contain at least a
            country, a region and a postcode`, {
            position: 'top-right',
            effect: 'jelly'
          });
        }
        else {
          // Close the modal and reset the confirm btn
          this.refs.detailsEditionModal.hide();
        }
      }
    );
  }

  /**
   * Map methods
   */
  // Called by the MapComponent when a revese geocoding request is a success
  mapReverseGeocoding(place) {
    // Pass the place to the geocoder param
    this.refs.modalGeocoder.updateInputValue(place.place_name);
    // Set the confirmedPlace
    this.setState({confirmedPlace: place});
  }

  /**
   * Geocoder methods
   */
  modalGeocoderSelect(place) {
    this.setState({confirmedPlace: place});
    // Update the geocoder component input value
    this.refs.modalGeocoder.updateInputValue(place.place_name);
    // Pass the coordinates to the map component
    this.refs.mapComponent.onSelect(place);
  }
  geocoderSuggest() {

  }

  render() {
    return (
      <div className="col-xs-12 profile-details-container">
        <div
          className="
          col-xs-12
          col-sm-12
          col-md-8 col-md-offset-2
          col-lg-8 col-lg-offset-2
          personal-infos-container"
        >
          <div className="pull-left personal-infos">
            <div>
              <span className={`picto-sprite-${this.props.type}-no-legend`}></span>
              <span className="profile-details-container__username">
                {this.props.name}
                <span className="profile-details-container__alias">
                  @{this.props.alias}
                </span>
              </span>
            </div>
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
          <form
            onSubmit={function (e) { e.preventDefault(); }}
            autocomplete="off"
          >
            {
              this.props.type === 'user' &&
              (<div className={
                "form-group" +
                (this.state.firstnameState.isValid ? ' valid' : '') +
                (this.state.firstnameState.hasError ? ' error' : '') +
                (this.state.firstnameState.onFocus ? ' on-focus' : '')
               }>
                <label for="details-input-firstname">Firstname</label>
                <input
                  type="text"
                  className="form-control"
                  id="details-input-firstname"
                  placeholder="John"
                  value={this.state.firstname}
                  onChange={this.onChangeFirstname.bind(this)}
                  onFocus={ this.onFocus }
                  onBlur={ this.onBlur }
                />
                <p className="message error">
                  {
                    this.state.firstnameState.hasError ?
                    'Must contain at least 2 characters and no digit' : null
                  }
                </p>
              </div>)
            }
            {
              this.props.type === 'user' &&
              (<div className={
                "form-group" +
                (this.state.lastnameState.isValid ? ' valid' : '') +
                (this.state.lastnameState.hasError ? ' error' : '') +
                (this.state.lastnameState.onFocus ? ' on-focus' : '')
               }>
                <label for="details-input-lastname">Lastname</label>
                <input
                  type="text"
                  className="form-control"
                  id="details-input-lastname"
                  placeholder="Doe"
                  value={this.state.lastname}
                  onChange={this.onChangeLastname.bind(this)}
                  onFocus={ this.onFocus }
                  onBlur={ this.onBlur }
                />
                <p className="message error">
                  {
                    this.state.lastnameState.hasError ?
                    'Must contain at least 2 characters and no digit' : null
                  }
                </p>
              </div>)
            }
            {
              this.props.type === 'user' &&
              (<div className={
                "form-group" +
                (this.state.headlineState.isValid ? ' valid' : '') +
                (this.state.headlineState.hasError ? ' error' : '') +
                (this.state.headlineState.onFocus ? ' on-focus' : '')
               }>
                <label for="details-input-headline">Professional headline</label>
                <input
                  type="text"
                  className="form-control"
                  id="details-input-headline"
                  placeholder="Ex: Fab Manager"
                  value={this.state.headline}
                  onChange={this.onChangeHeadline.bind(this)}
                  onFocus={ this.onFocus }
                  onBlur={ this.onBlur }
                />
                <p className="message error">
                  {
                    this.state.headlineState.hasError ?
                    'Must contain at least 2 characters' : null
                  }
                </p>
              </div>)
            }
            {
              this.props.type !== 'user' &&
              (<div className="form-group">
                <label for="details-input-name">Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="details-input-name"
                  placeholder=""
                  value={this.state.name}
                  onChange={this.onChangeName.bind(this)}
                />
              </div>)
            }
            <div className="form-group">
              <label for="">Location</label>
              <Geocoder
                ref="modalGeocoder"
                accessToken="pk.eyJ1Ijoic2hlY2twYXIiLCJhIjoiMTNzTlE1OCJ9.wY4R3ybKOIbLiBEjQMXBpw"
                onSelect={this.modalGeocoderSelect.bind(this)}
                onSuggest={this.geocoderSuggest.bind(this)}
                source="mapbox.places"
                inputClass="form-control"
                inputPlaceholder="Ex: 42, Broadway, Sleepy Hollow, New York"
                resultClass="placesSuggest_suggest"
                resultsClass="placesSuggest_suggests"
                resultFocusClass="placesSuggest_suggest-active"
                showLoader={true}
                inputPosition="top"
                proximity=""
                focusOnMount={false}
              />
            </div>
            <MapComponent
              ref="mapComponent"
              accessToken="pk.eyJ1Ijoic2hlY2twYXIiLCJhIjoiMTNzTlE1OCJ9.wY4R3ybKOIbLiBEjQMXBpw"
              mapId="mapbox.run-bike-hike"
              source="mapbox.places"
              onReverseGeocoding={this.mapReverseGeocoding.bind(this)}
            />
          </form>
        </Modal>
      </div>
    )
  }
}

ProfileDetails.propTypes = {
  type: PropTypes.oneOf(['user', 'place']).isRequired,
  name: PropTypes.string.isRequired,
  firstname: PropTypes.string, // Only for 'user' type
  lastname: PropTypes.string, // Only for 'user' type
  headline: PropTypes.string, // Only for 'user' type
  alias: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  coordinate: PropTypes.object.isRequired,
  bboxSouthWest: PropTypes.array,
  bboxNorthEast: PropTypes.array
}

ProfileDetails.defaultProps = {
  type: null,
  bboxSouthWest: null,
  bboxNorthEast: null,
  name: '',
  firstname: '',
  lastname: '',
  headline: ''
}

export default ProfileDetails;
