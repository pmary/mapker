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
        name: en,
        type: type,
        i18n: {
          zh: { name: cn },
          fr: { name: fr }
        }
      });
    }
  }
});
