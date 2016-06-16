import { Meteor } from 'meteor/meteor';

/**
 * @description
 * Publish the required documents of the Meteor.users collection
 *
 * @param {Object} query
 * @param {Object} options
 */
Meteor.publish('users.find', function (query = {}, options = {}) {
  return Taxons.find(query, options);
});
