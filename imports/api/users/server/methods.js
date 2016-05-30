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
    check(healine, String);
    check(skillsIds, Array);
    check(customSkills, Array);
    check(place, Object);

    var userId = Meteor.userId(); if (!userId) { return; }

    // Insert the user location
    Meteor.call('user.location.update', place);

    // Insert the skills
    Meteor.call('users.skills.add', skillsIds, customSkills);

    // Insert the headline and activate the account
    Meteor.users.upsert(userId, { $set: {
      'profile.headline': healine,
      'profile.activated': true
    } });
  },
  /**
   * @description
   * Update the user location
   *
   * @param {Object} place - A place object from Mapbox geocoding
   * @see https://www.mapbox.com/api-documentation/#response-format
   */
  'user.location.update': function (place) {
    check(place, Object);

    var userId = Meteor.userId(); if (!userId) { return; }
    var postcode = '';
    var country;
    var countryCode;
    var region;

    // Extract the postcode, country and region from the place context
    if (
      place.context &&
      place.context.constructor === Array &&
      place.context.length
    ) {
      for (let i = 0; i < place.context.length; i++) {
        var type = place.context[i].id.split('.')[0];
        switch (type) {
          case 'postcode':
            postcode = place.context[i].text;
            break;

          case 'region':
            region = place.context[i].text;
            break;

          case 'country':
            country = place.context[i].text;
            countryCode = place.context[i].short_code
            break;
        }
      }
    }

    // Get the feature type
    switch (place.id.split('.')[0]) {
      case 'postcode':
        postcode = place.text;
        break;
      case 'region':
        region = place.text;
        break;
      default:

    }

    // If we get the 3 mandatory data
    if (postcode && region && country && countryCode) {
      return Meteor.users.upsert(userId, {
        $set: {
          'profile.location': {
            country: country,
            countryCode: countryCode,
            postcode: postcode,
            region: region,
            coordinate: {
              lat: place.center[1],
              lon: place.center[0]
            },
            bbox: place.bbox ? place.bbox : null
          }
        }
      });
    }
    else {
      // Incomplete address, throw an error
      throw new Meteor.Error(400, 'Incomplete location');
    }
  },
  /**
   * @description
   * Add skills to a user profile
   *
   * @param {Array} skillIds - The ids of existing skills
   * @param {Array} customSkills - The labels of new skills
   */
  'users.skills.add': function (skillsIds = [], customSkills = []) {
    var userId = Meteor.userId(); if (!userId) { return; }
    var user = Meteor.user();

    // Check if the custom skills labels already exist in the DB
    for (var i = 0; i < customSkills.length; i++) {
      var taxon = Taxons.findOne({canonicalName: customSkills[i].toLowerCase()});
      // If the skill doesn't already exist
      if (!taxon) {
        // Insert the new skill into the DB
        let taxonId = Taxons.insert({
          verified: false,
          name: customSkills[i],
          canonicalName: customSkills[i].toLowerCase(),
          type: 'skill',
          i18n: { zh: { name: '' }, fr: { name: '' } }
        });
        // Put the id of the new taxon into the skillsIds array
        skillsIds.push(taxonId);
      }
      // If the skill already exist
      else {
        if (skillsIds.indexOf(taxon._id) == -1) {
          // Put its id into the skillsIds array
          skillsIds.push(taxon._id);
        }
      }
    }

    if (user.profile.skills && user.profile.skills.length) {
      // Get the user skills
      var userSkills = user.profile.skills.map(function(skill) {
        return skill.id;
      });
    }

    // Deduplicate and format the skills
    var skillsToAdd = [];
    for (var i = 0; i < skillsIds.length; i++) {
      if (userSkills == undefined || userSkills.indexOf(skillsIds[i]) == -1) {
        skillsToAdd.push({ id: skillsIds[i] });
      }
    }

    // Insert the skills into the user profile
    Meteor.users.upsert(userId, {
      $addToSet: { 'profile.skills': { $each: skillsToAdd }}
    });
  }
});
