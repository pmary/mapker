import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Taxons } from '/imports/api/taxons/taxons.js';

Meteor.methods({
  /**
   * @description
   * Activate the user profile by providing the at least 3 skills,
   * a professional headline and a place
   *
   * @param {String} healine - The user professional healine
   * @param {Array} skillIds - The ids of existing skills
   * @param {Array} customSkills - The labels of new skills
   # @param {Object} place - The user place informations
   */
  'users.profile.activate': function (
    healine,
    skillsIds = [],
    customSkills = [],
    place
  ) {
    var userId = Meteor.userId();
    if (!userId) { return; }

    // Insert the skills
    //Meteor.call('users.skills.add', skillsIds, customSkills);

    // Insert the headline and the place details
    Meteor.users.insert({})
  },
  /**
   * @description
   * Add skills to a user profile
   *
   * @param {Array} skillIds - The ids of existing skills
   * @param {Array} customSkills - The labels of new skills
   */
  'users.skills.add': function (skillsIds = [], customSkills = []) {
    var userId = Meteor.userId();
    if (!userId) {
      return;
    }
    return;
    // Check if the custom skills labels already exist in the DB
    for (var i = 0; i < customSkills.length; i++) {
      var taxon = Taxons.findOne({canonicalName: customSkills[i]});
      // If the skill doesn't already exist
      if (!taxon) {
        // Insert the new skill into the DB
        Taxons.insert({
          verified: false,
          name: customSkills[i],
          type: 'skill',
          i18n: { zh: { name: '' }, fr: { name: '' } }
        });
      }
      // If the skill already exist
      else {
        // Put its id into the skillsIds array
        console.log('taxon: ', taxon);
        skillsIds.push(taxon._id);
      }
      //console.log('taxon: ', taxon);
    }
  }
});
