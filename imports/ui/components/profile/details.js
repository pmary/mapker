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
      confirmedPlace: null,
      /*facebook: '',
      twitter: '',
      flickr: '',
      github: '',
      website: ''*/
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
  /*handleClickEditSocial(e) {
    this.refs.socialEditionModal.show();
  }*/
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
   * Edit social links modal methods
   */
  // On modal confirm
  /*modalEditSocialOnConfirm(btnPointer) {
    console.log('confirm');
    // Reset the confirm btn
    btnPointer.button('reset');
    let links = {
      facebook: this.state.facebook,
      twitter: this.state.twitter,
      flickr: this.state.flickr,
      github: this.state.github,
      website: this.state.website
    }
    Meteor.call('user.profileSocial.update', links, (err) => {
      if (err) {
        console.log('err: ', err);
      }
      else {
        // Close the modal
        this.refs.socialEditionModal.hide();
      }
    });
  }
  modalEditSocialOnAdd() {
    let service = this.refs.socialEditionModal_select.value;
    console.log('service: ', service);
  }
  // On social profile link change
  onSocialChange(service, value) {
    var obj = {};
    obj[service] = value;
    this.setState(obj);
  }
  clearSocialInput(service) {
    var obj = {};
    obj[service] = '';
    this.setState(obj);
  }*/

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
      <div className="profileDetails">
        <div
          className="personal-infos-container"
        >
          <div className="pull-left personal-infos">
            <div>
              <span className={`picto-sprite-${this.props.type}-no-legend`}></span>
              <span className="profileDetails__username">
                {this.props.name}
                <span className="profileDetails__alias">
                  @{this.props.alias}
                </span>
              </span>
            </div>
            <span className="profileDetails__main-activity">
              {this.props.headline}
            </span>
            <span className="profileDetails__location">
              {this.props.location}
            </span>
          </div>

          <div
            className="pull-left details-edit-btn"
            onClick={this.handleClickEditDetails.bind(this)}
          >
            <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
          </div>

          {/* Social interaction */}
          <div className="pull-right profileDetails__right">
            <button className="profileDetails__followBtn btn btn-default">
              Follow
            </button>
          </div>

          {/*<div className="pull-right social-links-container">
            <a href="#" target="_blank" className="social-icon social-icon-30-facebook">
              <span>Facebook</span>
            </a>
            <a href="#" target="_blank" className="social-icon social-icon-30-twitter">
              <span>Twitter</span>
            </a>
            <a href="#" target="_blank" className="social-icon social-icon-30-github">
              <span>GitHub</span>
            </a>
            <a href="#" target="_blank" className="social-icon social-icon-30-flickr">
              <span>Flickr</span>
            </a>
            <a href="#" target="_blank" className="social-icon social-icon-30-website"><span>
              Personal website</span>
            </a>
          </div>

          <div
            className="details-social-links-edit-btn"
            onClick={this.handleClickEditSocial.bind(this)}
          >
            <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
          </div>*/}
        </div>

        {/*<Modal
          className="profileDetails__socialModal"
          id={"profileDetails__socialModal"}
          btnConfirmText="Save"
          btnCancelText="Cancel"
          onConfirm={this.modalEditSocialOnConfirm.bind(this)}
          ref="socialEditionModal"
          size="modal-sm"
          title="Edit your social profiles"
        >
          <form
            onSubmit={function (e) { e.preventDefault(); }}
            autocomplete="off"
            className="form-inline"

            <div className="form-group profileDetails__socialModal__formGroup">
              <label
                htmlFor="facebook-input"
                className="profileDetails__socialModal__label"
              >
                <span className="
                  social-icon
                  social-icon-30-facebook
                  profileDetails__socialModal__icon"
                >
                  <span>Facebook</span>
                </span>
              </label>
              <input
                type="url"
                className="form-control profileDetails__socialModal__input"
                id="facebook-input"
                placeholder="http://facebook.com/..."
                value={this.state.facebook}
                onChange={(e)=>{this.onSocialChange('facebook', e.target.value)}}
              />
              <span
                className="
                glyphicon
                glyphicon-remove
                profileDetails__socialModal__removeBtn"
                aria-hidden="true"
                onClick={(e)=>{this.clearSocialInput('facebook', e.target.value)}}>
              </span>
            </div>

            <div className="form-group profileDetails__socialModal__formGroup">
              <label
                htmlFor="twitter-input"
                className="profileDetails__socialModal__label"
              >
                <span className="
                  social-icon
                  social-icon-30-twitter
                  profileDetails__socialModal__icon"
                >
                  <span>Twitter</span>
                </span>
              </label>
              <input
                type="url"
                className="form-control profileDetails__socialModal__input"
                id="twitter-input"
                placeholder="http://twitter.com/..."
                value={this.state.twitter}
                onChange={(e)=>{this.onSocialChange('twitter', e.target.value)}}
              />
              <span
                className="
                glyphicon
                glyphicon-remove
                profileDetails__socialModal__removeBtn"
                aria-hidden="true"
                onClick={(e)=>{this.clearSocialInput('twitter', e.target.value)}}>
              </span>
            </div>

            <div className="form-group profileDetails__socialModal__formGroup">
              <label
                htmlFor="flickr-input"
                className="profileDetails__socialModal__label"
              >
                <span className="
                  social-icon
                  social-icon-30-flickr
                  profileDetails__socialModal__icon"
                >
                  <span>Flickr</span>
                </span>
              </label>
              <input
                type="url"
                className="form-control profileDetails__socialModal__input"
                id="flickr-input"
                placeholder="http://flickr.com/..."
                value={this.state.flickr}
                onChange={(e)=>{this.onSocialChange('flickr', e.target.value)}}
              />
              <span
                className="
                glyphicon
                glyphicon-remove
                profileDetails__socialModal__removeBtn"
                aria-hidden="true"
                onClick={(e)=>{this.clearSocialInput('flickr')}}>
              </span>
            </div>

            <div className="form-group profileDetails__socialModal__formGroup">
              <label
                htmlFor="github-input"
                className="profileDetails__socialModal__label"
              >
                <span className="
                  social-icon
                  social-icon-30-github
                  profileDetails__socialModal__icon"
                >
                  <span>GitHub</span>
                </span>
              </label>
              <input
                type="url"
                className="form-control profileDetails__socialModal__input"
                id="github-input"
                placeholder="http://github.com/..."
                value={this.state.github}
                onChange={(e)=>{this.onSocialChange('github', e.target.value)}}
              />
              <span
                className="
                glyphicon
                glyphicon-remove
                profileDetails__socialModal__removeBtn"
                aria-hidden="true"
                onClick={(e)=>{this.clearSocialInput('github', e.target.value)}}>
              </span>
            </div>

            <div className="form-group profileDetails__socialModal__formGroup">
              <label
                htmlFor="website-input"
                className="profileDetails__socialModal__label"
              >
                <span className="
                  social-icon
                  social-icon-30-website
                  profileDetails__socialModal__icon"
                >
                  <span>Personal website</span>
                </span>
              </label>
              <input
                type="url"
                className="form-control profileDetails__socialModal__input"
                id="website-input"
                placeholder="http://mywebsite.com"
                value={this.state.website}
                onChange={(e)=>{this.onSocialChange('website', e.target.value)}}
              />
              <span
                className="
                glyphicon
                glyphicon-remove
                profileDetails__socialModal__removeBtn"
                aria-hidden="true"
                onClick={(e)=>{this.clearSocialInput('website', e.target.value)}}>
              </span>
            </div>
          </form>
        </Modal>*/}

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
  bboxSouthWest: null,
  bboxNorthEast: null,
  name: '',
  firstname: '',
  lastname: '',
  headline: ''
}

export default ProfileDetails;
