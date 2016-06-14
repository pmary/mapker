import { Meteor } from 'meteor/meteor';
import React from 'react';
import { browserHistory, Link } from 'react-router';
import Alert from 'react-s-alert';
import Modal from '/imports/ui/components/modal.js';
import ElasticTypeahead from '/imports/ui/components/elastic/typeahead.js';
import TaxonTag from '/imports/ui/components/taxon_tag.js';
import Geocoder from '/imports/ui/components/geocoder.js';
import MapComponent from '/imports/ui/components/map.js';

class AccountActivation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      professionalHeadline: '',
      location: '',
      place: null, // A location returned by the geocoder
      lastSuggestedPlace: null,
      coordinate: {},
      confirmedPlace: null // The confirmed place object
    };

    if (props.routeParams.token) {
      // Activate the user account
      Accounts.verifyEmail(props.routeParams.token, function (err) {
        if (err) {
          // Redirect the user to the forget password page to allow him to
          // activate his account
          browserHistory.push('/forgot-password');
        }
      })
    }

    this.state = {skills: {}, skillsIds: [], skillInput: ''};
  }

  componentDidMount() {
    // Set focus on the headline input
    this.refs.professionalHeadline.focus();
  }

  handleprofessionalHeadlineChange (e) {
    this.setState({professionalHeadline: e.target.value});
  }

  handleSkillChange(label) {
    this.setState({skillInput: label});
  }
  handleSkillSelect(suggestion) {
    // Check if the given skill is already selected
    // Check if the skill is not already selected
    var keys = Object.keys(this.state.skills);
    for (var i = 0; i < keys.length; i++) {
      let skill = this.state.skills[keys[i]].toLowerCase();
      if (skill == suggestion.text.toLowerCase()) {
        return;
      }
    }

    // Add the skill to the skills array, used to display the taxons tags
    this.state.skills[suggestion.payload._id] = suggestion.text;
    this.setState({ skills: this.state.skills });
  }
  handleClickRemoveSkill(skillId) {
    // Remove the skill from the selected skills list
    delete this.state.skills[skillId];
    this.setState({ skills: this.state.skills });
  }
  /**
   * Add a custom skill to the user profile
   */
  handleSkillSubmit(value) {
    // Check if the skill is not already selected
    var keys = Object.keys(this.state.skills);
    for (var i = 0; i < keys.length; i++) {
      let skill = this.state.skills[keys[i]].toLowerCase();
      if (skill == value.toLowerCase()) {
        return;
      }
    }

    // Add the custom skill to the skills array, used to display the taxons tags
    this.state.skills['custom-' + value] = value;
    this.setState({ skills: this.state.skills });
  }

  /**
   * Validate the form and activate the user account
   */
  handleConfirmActivation() {
    // Hide the location confirmation modal by default
    this.refs.locationConfirmModal.hide();

    // Set the submit btn state to loading
    var target = $('.btn-submit');
    target.button('loading');

    // Check if the user has an professional headline
    if (!this.state.professionalHeadline) {
      Alert.warning('You must set a professional headline', {
        position: 'top-right',
        effect: 'jelly'
      });
      target.button('reset');

      // Focus on the input
      this.refs.professionalHeadline.focus();
      return;
    }

    // Check if there is at least 3 skills
    if (Object.keys(this.state.skills).length < 3) {
      // Display a warning
      Alert.warning('You must choose at least 3 skills', {
        position: 'top-right',
        effect: 'jelly'
      });
      target.button('reset');

      // Focus on the input
      this.refs.accountActivationSkillInput.focusInput();
      return;
    }

    console.log('this.state.location:', this.state.location);
    console.log('this.state.confirmedPlace:', this.state.confirmedPlace);
    // Check if there is a location value
    if (this.state.location) {
      // If the place hasn't been confirmed
      if (!this.state.confirmedPlace) {
        // Open the location confirmation modal
        this.openLocationConfirmationModal();
        return;
      }
    }
    else {
      Alert.warning('You must set a location', {
        position: 'top-right',
        effect: 'jelly'
      });
      // Focus on the input
      this.refs.activationGeocoder.setInputFocus();
      return;
    }

    // Get the ids of the selected skills
    var skills = Object.keys(this.state.skills);
    var skillsIds = [], customSkills = [];
    for (var i = 0; i < skills.length; i++) {
      // Check if this is a custom skill
      if (skills[i].indexOf('custom-') > -1) {
        // Push it in the customSkills array
        customSkills.push(this.state.skills[skills[i]]);
      }
      // If it's an existing skill
      else {
        // Push it in the skillsIds array
        skillsIds.push(skills[i]);
      }
    }

    // Update the user profile with his new skills
    Meteor.call(
      'users.profile.activate',
      this.state.professionalHeadline,
      skillsIds,
      customSkills,
      this.state.confirmedPlace,
      (err, res) => {
        target.button('reset');
        if (err) {
          if (err.reason == 'Incomplete location') {
            // Unset the confirmedPlace
            this.setState({confirmedPlace: null});

            Alert.warning(`Incomplete address. \n
              The address must contain at least a
              country, a region and a postcode`, {
              position: 'top-right',
              effect: 'jelly'
            });
          }
        }
        else {
          let user = Meteor.user();
          // Redirect the user to his profile page
          browserHistory.push('/users/' + user.profile.username);
        }
    });

  }

  /**
   * @param {String} label
   */
  selectLocation(label, coordinate) {
    this.setState({location: label});
    // Update the geocoder component input value
    this.refs.modalGeocoder.updateInputValue(label);
  }
  changeLocation(label) {
    this.setState({location: label});
    // Update the geocoder component input value
    this.refs.modalGeocoder.updateInputValue(label);
  }

  /**
   * Geocoder handler functions
   */
  // Handle the new input value
  geocoderChange(label) {
    this.setState({location: label, place: null, confirmedPlace: null});
    // Update the geocoder component input value
    this.refs.modalGeocoder.updateInputValue(label);
  }
  // Handle the selected place object from the activation geocoder
  geocoderSelect(place) {
    this.setState({location: place.place_name, place: place, confirmedPlace: null});
    // Update the geocoder component input value
    this.refs.modalGeocoder.updateInputValue(place.place_name);
  }
  // Handle the selected place object from the modal geocoder
  modalGeocoderSelect(place) {
    this.setState({location: place.place_name, place: place, confirmedPlace: place});
    // Update the geocoder component input value
    this.refs.modalGeocoder.updateInputValue(place.place_name);
    // Pass the coordinates to the map component
    this.refs.mapComponent.onSelect(place);
  }
  // Handle the suggestion list
  geocoderSuggest(suggests) {
    this.setState({lastSuggestedPlace: suggests[0]});
  }

  /**
   * MapComponent callback functions
   */
  // Called by the MapComponent when a revese geocoding request is a success
  mapReverseGeocoding(place) {
    // Pass the place to the geocoder param
    this.refs.modalGeocoder.updateInputValue(place.place_name);
    // Set the confirmedPlace
    this.setState({confirmedPlace: place});
  }

  /**
   * Modal component callback functions
   */
  modalOnConfirm() {
    // Check if there is a confirmed location
    if (this.state.confirmedPlace) {
      this.handleConfirmActivation();
    }
    else {
      Alert.warning('You must select a place', {
        position: 'top-right',
        effect: 'jelly'
      });
    }
  }

  openLocationConfirmationModal() {
    this.refs.locationConfirmModal.show();

    // Re-render the map to be sur that it will fit to the modal size
    setTimeout( () => {
      this.refs.mapComponent.invalidateSize();
      this.refs.mapComponent.disableZoom();

      // If there is no selected place
      if (this.state.place) {
        // Pass the coordinates to the map component
        this.refs.mapComponent.onSelect(this.state.place);
        this.setState({confirmedPlace: this.state.place});
      }
      // If there is a location text and a place object
      else if (
        this.state.location &&
        this.state.lastSuggestedPlace
      ) {
        // Pass the coordinates to the map component
        this.refs.mapComponent.onSelect(this.state.lastSuggestedPlace);
        this.setState({confirmedPlace: this.state.lastSuggestedPlace});
      }

      // Set focus to the input
      this.refs.modalGeocoder.setInputFocus();
    }, 300);
  }

  render() {
    // Display the selected skills
    var selectedSkills = null;
		if (this.state.skills) {
      selectedSkills = Object.keys(this.state.skills).map( (key) => {
        let skill = {text: this.state.skills[key], id: key};
        return (
          <TaxonTag
            onClick={this.handleClickRemoveSkill.bind(this)}
            key={'skill-item-'+key}
            skill={skill}
          />
        )
      });
    }

    return(
      <div>
        <div className="activate-account">
          <div className="vcenter">
            <div className="
              panel
              panel-default
              col-xs-11
              col-sm-11
              col-md-8
              col-lg-6
            ">
              <div className="panel-heading">
                <h1>Activate your account</h1>
              </div>

              <div className="panel-body">
                <span className="picto-sprite-user-no-legend"></span>

                <form onSubmit={function (e) { e.preventDefault(); }}>
                  <h2>What is your professional headline?</h2>

                  <div className="form-group professional-headline-container">
                    <input
                      ref="professionalHeadline"
                      type="text"
                      className="form-control input-professional-headline"
                      placeholder="Ex: Fab Manager"
                      value={this.state.professionalHeadline || ''}
                      onChange={this.handleprofessionalHeadlineChange.bind(this)}
                      required
                    />
                  </div>

                  <h2>Add your skills</h2>

                  <div className="form-group">
                    <ElasticTypeahead
                      className="input-add-skill"
                      onChange={this.handleSkillChange.bind(this)}
                      onSelect={this.handleSkillSelect.bind(this)}
                      onSubmit={this.handleSkillSubmit.bind(this)}
                      placeholder="Ex: Wood Working, Yoga..."
                      ref="accountActivationSkillInput"
                      required={false}
                    />
                    <i>You must choose at least 3 skills</i>
                  </div>

                  {selectedSkills}

                  <h2>Where are you located?</h2>

                  <div className="form-group">
                    <Geocoder
                      ref="activationGeocoder"
                      inputPlaceholder="Ex: 42, Broadway, Sleepy Hollow, New York"
                      accessToken="pk.eyJ1Ijoic2hlY2twYXIiLCJhIjoiMTNzTlE1OCJ9.wY4R3ybKOIbLiBEjQMXBpw"
                      onSelect={this.geocoderSelect.bind(this)}
                      onSuggest={this.geocoderSuggest.bind(this)}
                      onChange={this.geocoderChange.bind(this)}
                      source="mapbox.places"
                      inputClass="input-address form-control"
                      inputPlaceholder="Ex: 42, Broadway, Sleepy Hollow, New York"
                      resultClass="placesSuggest_suggest"
                      resultsClass="placesSuggest_suggests"
                      resultFocusClass="placesSuggest_suggest-active"
                      showLoader={true}
                      inputPosition="top"
                      proximity=""
                      focusOnMount={false}
                    />
                    <p><i>
                      Only your address cordinate, country and city will be
                      saved in your profile.
                    </i></p>
                    <i> The complete address will never hit our servers.</i>
                  </div>

                  {/*
                  <h3>Featured Skills</h3>

                  <div className="form-inline">
                    <div className="checkbox">
                      <label>
                        <input type="checkbox" /> Web design
                      </label>
                    </div>
                    <div className="checkbox">
                      <label>
                        <input type="checkbox" /> Wood working
                      </label>
                    </div>
                    <div className="checkbox">
                      <label>
                        <input type="checkbox" /> 3D
                      </label>
                    </div>
                    <div className="checkbox">
                      <label>
                        <input type="checkbox" /> Arduino
                      </label>
                    </div>
                    <div className="checkbox">
                      <label>
                        <input type="checkbox" /> Electronic
                      </label>
                    </div>
                  </div>
                    */}
                    <div className="pull-right">
                      <button
                        type="button"
                        className="btn btn-primary btn-submit"
                        data-loading-text="<i class='fa fa-circle-o-notch fa-spin'></i>"
                        onClick={this.handleConfirmActivation.bind(this)}
                      >
                        Confirm
                      </button>
                    </div>
                </form>
              </div>
            </div>
          </div>
          <Modal
            className="confirm-location-modal"
            id="location-confirm-modal"
            btnConfirmText="Confirm"
            btnCancelText="Cancel"
            onConfirm={this.modalOnConfirm.bind(this)}
            ref="locationConfirmModal"
            title="Confirm your address"
          >
            <MapComponent
              ref="mapComponent"
              accessToken="pk.eyJ1Ijoic2hlY2twYXIiLCJhIjoiMTNzTlE1OCJ9.wY4R3ybKOIbLiBEjQMXBpw"
              mapId="mapbox.run-bike-hike"
              source="mapbox.places"
              onReverseGeocoding={this.mapReverseGeocoding.bind(this)}
            />
            <Geocoder
              ref="modalGeocoder"
              accessToken="pk.eyJ1Ijoic2hlY2twYXIiLCJhIjoiMTNzTlE1OCJ9.wY4R3ybKOIbLiBEjQMXBpw"
              onSelect={this.modalGeocoderSelect.bind(this)}
              onSuggest={this.geocoderSuggest.bind(this)}
              source="mapbox.places"
              inputClass=""
              inputPlaceholder="Ex: 42, Broadway, Sleepy Hollow, New York"
              resultClass="placesSuggest_suggest"
              resultsClass="placesSuggest_suggests"
              resultFocusClass="placesSuggest_suggest-active"
              showLoader={true}
              inputPosition="top"
              proximity=""
              focusOnMount={false}
            />
          </Modal>
        </div>
      </div>
    )
  }
}

export default AccountActivation;
