import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Taxons } from '../taxons.js';

Meteor.methods({
  /**
   * @description
   * Add a taxon to the Taxons collection if the user is granted
   *
   * @param {String} en - The taxon english label
   * @param {String} cn - The taxon chinese label
   * @param {String} fr - The taxon french label
   */
  'taxons.add': function (en, cn, fr, type) {
    if (!en) {
      return;
    }

    // Check if the user is an admin
    if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
      // Insert the taxon
      Taxons.insert({
        verified: true,
        name: en,
        type: type,
        i18n: {
          zh: { name: cn },
          fr: { name: fr }
        }
      });
    }
  },
  /**
   * @description
   * Update a taxon from the Taxons collection if the user is granted
   *
   * @param {String} taxonID - The taxon id from MongoDB
   * @param {String} en - The taxon english label
   * @param {String} cn - The taxon chinese label
   * @param {String} fr - The taxon french label
   */
  'taxons.update': function (taxonId, en, cn, fr, type) {
    if (!en) {
      return;
    }

    // Check if the user is an admin
    if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
      // Update the taxon
      Taxons.update(taxonId, {
        $set: {
          name: en,
          type: type,
          i18n: {
            zh: { name: cn },
            fr: { name: fr }
          }
        },
      });
    }
  },
  'taxons.activate': function (taxonId) {
    // Check if the user is an admin
    if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
      Taxons.update(taxonId, {$set: { verified: true }});
    }
  }
});
