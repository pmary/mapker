import { Meteor } from 'meteor/meteor';
import { Taxons } from '../taxons.js';

/**
 * @description
 * Publish all the documents of the Taxon's collection
 * Only admins can use this publication
 *
 * @param {Object} query
 * @param {Object} options
 */
Meteor.publish('taxons.admin.find', function (query = {}, options = {}) {
  // If the user is authorized
  if (Roles.userIsInRole(this.userId, 'admin')) {
    return Taxons.find(query, options);
  }
  else {
    // User not authorized. Do not publish the taxons
    this.stop();
    return;
  }
});

/**
 * @description
 * Publish the required documents of the Taxon's collection
 * and transform the published object server side according to the user language
 *
 * @param {Object} query
 * @param {Object} options
 */
Meteor.publish('taxons.find', function (query = {}, options = {}) {
  var self = this;
  var handler = null;
  // Get the ISO 639-1 user language code
  var user = Meteor.users.findOne(
    {_id: self.userId},
    {fields: {_id: 0, 'profile.language': 1}}
  );

  // We use observeChanges, thus, the pub/sub remains reactive
  handler = Taxons.find(query, options).observeChanges({
    added: function (id, doc) {
      if (
        self.userId &&
        user.profile.language != 'en' &&
        doc.i18n[user.profile.language]
      ) {
        // Traverse through the i18n sub-object properties
        for (var prop in doc.i18n[user.profile.language]) {
          // Override the translated document properties
          doc[prop] = doc.i18n[user.profile.language][prop];
        }

        // Delete the i18n sub-object
        delete doc.i18n;
      }
      else {
        // Use the default language (en)
        delete doc.i18n;
      }
      self.added('taxons', id, doc);
    },
    changed: function (id, fields) {
      self.changed('taxons', id, fields);
    },
    removed: function (id) {
      self.removed('taxons', id);
    }
  });

  self.ready();
  self.onStop(function () {
    if (handler) { handler.stop(); }
  })
});
