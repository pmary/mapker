import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Taxons } from '/imports/api/taxons/taxons.js';
import { aws } from '/imports/api/aws/server/methods';

Meteor.methods({
  /**
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
  },
  /**
   * Get a blob image object, upload it to the aws bucket and update the user
   * profile accordingly
   *
   * @param {String} dataURL - Encoded image data in data URI scheme (RFC 2397)
   * @param {String} type - Can be 'avatar' or 'cover'. The type of profile
   * picture to update
   * @see https://developer.mozilla.org/fr/docs/Web/API/Blob
   */
  'user.profilePicture.update': function (dataURL, type) {
    var userId = Meteor.userId(); if (!userId) { return; }
    var user = Meteor.user();
    check(dataURL, String);
    check(type, String);

    // Only get the image data
    let data = dataURL.replace(/^data:image\/\w+;base64,/, "");
    // Encore it into base64 and return the image as a Buffer
    // @doc https://nodejs.org/api/buffer.html
    let buf = new Buffer(data, 'base64');
    // Create a unique name for the image. It will be the S3 object key
    var key = userId + '/' + type + '-' + Date.now();

    // Upload to S3 and get back the uploaded file url asyncronously
    let params = {
      Key: key,
      Body: buf,
      ContentType: 'image/png',
      ACL: 'public-read'
    };

    return aws.s3.upload(params)
    .then(function (imageUrl) {
      // Delete the old avatar/cover if exist
      if (user.profile[type]) {
        aws.s3.deleteObject(user.profile[type].key);
      }
      return imageUrl;
    })
    .then(function (imageUrl) {
      // Update the user document with the new avatar url
      var set = {};
      set['profile.'+type] = {url: imageUrl, key: key};

      Meteor.users.update(userId, { $set: set });
      return imageUrl;
    });
  },
  /**
   * Update the user firstname, lastname and locations profile details
   *
   * @param {String} firstname
   * @param {String} lastname
   * @param {String} headline
   # @param {Object} place - (Optional) The user place informations
   */
  'user.profileDetails.update': function (firstname, lastname, headline, place) {
    check(firstname, String);
    check(lastname, String);
    check(headline, String);

    var userId = Meteor.userId(); if (!userId) { return; }

    if (place) {
      // Insert the user location
      Meteor.call('user.location.update', place);
    }

    // Update the user firstname, lastname and fullname profile fields
    let fullname = firstname + ' ' + lastname;
    Meteor.users.update(userId, {
      $set: {
        'profile.fullname': fullname,
        'profile.firstname': firstname,
        'profile.lastname': lastname,
        'profile.headline': headline,
      }
    });
  },
  /**
   * Update the user social links of the user profile
   *
   * @param {Object} links
   * @param {String} links.facebook
   * @param {String} links.twitter
   * @param {String} links.flickr
   * @param {String} links.github
   * @param {String} links.website
   */
  'user.profileSocial.update': function (links) {
    check(links, {
      facebook: String,
      twitter: String,
      flickr: String,
      github: String,
      website: String
    });

    var userId = Meteor.userId(); if (!userId) { return; }

    Meteor.users.update(userId, { $set: { 'profile.social': links } });
  }
});
