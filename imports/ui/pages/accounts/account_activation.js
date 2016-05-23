import { Meteor } from 'meteor/meteor';
import React from 'react';
import { browserHistory, Link } from 'react-router';
import Alert from 'react-s-alert';
import Modal from '/imports/ui/components/modal.js';
import ElasticTypeahead from '/imports/ui/components/elastic/typeahead.js';
import TaxonTag from '/imports/ui/components/taxon_tag.js';
import LocationForm from '/imports/ui/components/location_form.js';

class AccountActivation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      professionalHeadline: '',
      location: '',
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
        this.refs.locationConfirmModal.show();
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
  }

  changeLocation(label) {
    this.setState({location: label});
  }

  showModal() {
    console.log('Enter in showModal');
    this.refs.locationConfirmModal.show();
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
                    <LocationForm
                      className="input-address"
                      placeholder="Ex: 42, Broadway, Sleepy Hollow, New York"
                      ref="locationInputComponent"
                      onSelectSuggest={this.selectLocation.bind(this)}
                      onChange={this.changeLocation.bind(this)}
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
        </div>
        <Modal
          id="location-confirm-modal"
          ref="locationConfirmModal"
          title="Hello modal"
        />
      </div>
    )
  }
}

export default AccountActivation;
