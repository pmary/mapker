import { Meteor } from 'meteor/meteor';
import React from 'react';
import { browserHistory, Link } from 'react-router';
import Alert from 'react-s-alert';
import ElasticTypeahead from '/imports/ui/components/elastic/typeahead.js';
import TaxonTag from '/imports/ui/components/taxon_tag.js';

class AccountActivation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {skills: {}, skillsIds: []};
  }
  handleSkillChange(label) {
    console.log('handleSkillChange label: ', label);
  }
  handleSkillSelect(suggestion) {
    // Check if the given skill is already selected
    if (!this.state.skills[suggestion.payload._id]) {
      // Add the skill to the skills array, used to display te taxons tags
      this.state.skills[suggestion.payload._id] = suggestion.text;
      this.setState({ skills: this.state.skills });
    }
    console.log(this.state.skills);
  }
  handleClickRemoveSkill(skillId) {
    console.log('handleClickRemoveSkill: ', skillId);
    // Remove the skill from the selected skills list
    delete this.state.skills[skillId];
  }
  render() {
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
        console.log('key: ', key);
        console.log('selectedSkills[key]: ', this.state.skills[key]);
      });
			/*selectedSkills = this.state.skills.map( (skill) => {
        return (
          <TaxonTag
            onClick={this.handleClickRemoveSkill.bind(this)}
            key={'skill-item-'+skill.id}
            skill={skill}
          />
        )
      });*/
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
                <span className="picto-sprite-skill-no-legend"></span>

                <form>
                  <h2>Add your skills</h2>

                  <div className="form-group">
                    <ElasticTypeahead
                      className="input-add-skill"
                      onChange={this.handleSkillChange.bind(this)}
                      onSelect={this.handleSkillSelect.bind(this)}
                      placeholder="What are you good at?"
                      refKey="accountActivationSkillInput"
                      required={true}
                    />
                  </div>

                  {selectedSkills}

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

                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default AccountActivation;
