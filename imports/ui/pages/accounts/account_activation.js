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
      coordinate: {}
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

  handleprofessionalHeadlineChange (e) {
    this.setState({professionalHeadline: e.target.value});
  }

  handleSkillChange(label) {
    console.log('handleSkillChange label: ', label);
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
  handleSkillSubmit(e) {
    console.log('Enter in handleSkillSubmit: ', e.target.value);

    // Check if the skill is not already selected
    var keys = Object.keys(this.state.skills);
    for (var i = 0; i < keys.length; i++) {
      let skill = this.state.skills[keys[i]].toLowerCase();
      if (skill == e.target.value.toLowerCase()) {
        return;
      }
    }

    // Add the custom skill to the skills array, used to display the taxons tags
    this.state.skills['custom-' + e.target.value] = e.target.value;
    this.setState({ skills: this.state.skills });
  }

  /**
   * Validate the form and activate the user account
   */
  handleConfirmActivation() {
    // Set the submit btn state to loading
    var target = $('.btn-submit');
    target.button('loading');

    // To remove
    target.button('reset');

    // Check if the user has an professional headline
    if (!this.state.professionalHeadline) {
      console.log('No professional headline');
      Alert.warning('You must set a professional headline', {
        position: 'top-right',
        effect: 'jelly'
      });
      target.button('reset');
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
      return;
    }

    // Check if there is a location value
    if (this.state.location) {
      // Geocode it
      this.refs.locationInputComponent.geocodeSuggest(this.state.location, (label, coordinate) => {
        console.log('label:', label);
        console.log('coordinate:', coordinate);
        this.setState({location: label});
        this.setState({coordinate: coordinate});

        // Open the location confirmation component in a modal
        //this.refs.locationConfirmModal.show();
      });
    }
    else {
      Alert.warning('You must set a location', {
        position: 'top-right',
        effect: 'jelly'
      });
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
    /*Meteor.call(
      'users.skills.add',
      skillsIds,
      customSkills, function (err, res) {
        target.button('reset');
        if (err) { console.log(err); }
        else { console.log(res); }
    });*/

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
    this.setState({location: label, place: null});
    // Update the geocoder component input value
    this.refs.modalGeocoder.updateInputValue(label);
  }
  // Handle the selected place object
  geocoderSelect(place) {
    this.setState({location: place.place_name, place: place});
    // Update the geocoder component input value
    this.refs.modalGeocoder.updateInputValue(place.place_name);
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
  }

  /**
   * Test purpose, to remove
   */
  showModal() {
    this.refs.locationConfirmModal.show();

    // Re-render the map to be sur that it will fit to the modal size
    setTimeout( () => {
      this.refs.mapComponent.invalidateSize();
      this.refs.mapComponent.disableZoom();

      // If there is no selected place
      if (this.state.place) {
        // Pass the coordinates to the map component
        this.refs.mapComponent.onSelect(this.state.place);
      }
      // If there is a location text and a place object
      else if (
        this.state.location &&
        this.state.lastSuggestedPlace
      ) {
        // Pass the coordinates to the map component
        this.refs.mapComponent.onSelect(this.state.lastSuggestedPlace);
      }
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

              <div className="panel-body"
              >
                <button className="btn" onClick={this.showModal.bind(this)}>
                  Show modal
                </button>

                <span className="picto-sprite-skill-no-legend"></span>

                <form onSubmit={function (e) { e.preventDefault(); }}>
                  <h2>What is your professional headline?</h2>

                  <div className="form-group professional-headline-container">
                    <input
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
                      refKey="accountActivationSkillInput"
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
                      inputPlaceholder="Search"
                      resultClass="placesSuggest_suggest"
                      resultsClass="placesSuggest_suggests"
                      resultFocusClass="placesSuggest_suggest-active"
                      showLoader={true}
                      inputPosition="top"
                      proximity=""
                      focusOnMount={true}
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
              onSelect={this.geocoderSelect.bind(this)}
              onSuggest={this.geocoderSuggest.bind(this)}
              source="mapbox.places"
              inputClass=""
              inputPlaceholder="Search"
              resultClass="placesSuggest_suggest"
              resultsClass="placesSuggest_suggests"
              resultFocusClass="placesSuggest_suggest-active"
              showLoader={true}
              inputPosition="top"
              proximity=""
              focusOnMount={true}
            />
          </Modal>
        </div>
      </div>
    )
  }
}

export default AccountActivation;
