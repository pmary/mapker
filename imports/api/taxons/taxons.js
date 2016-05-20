import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

// Shema definition
Schema = {};

/**
 * @description
 * Define the collection hooks and data cleaning functions
 *
 * @see http://guide.meteor.com/collections.html#hooks
 */
class TaxonsCollection extends Mongo.Collection {
  /*
  insert (shop, callback) {
    const ourShop = shop;

    // Add some logic

    return super.insert(ourShop, callback);
  }
  */
}

/**
 * @description
 * The taxons collection from a Mongo collection
 */
export const Taxons = new TaxonsCollection('taxons');

/**
 * Design the taxons data schema
 * @see https://github.com/aldeed/meteor-simple-schema
 */
Taxons.schema = new SimpleSchema({
  _id: {
    type: String,
    optional: true
  },
  name: {
    type: String,
    unique: true
  },
  type: {
    type: String,
    allowedValues: [
      'skill'
    ]
  },
  i18n: {
    type: Object,
    optional: true
  },
  'i18n.zh': {
    type: Object,
    optional: true
  },
  'i18n.zh.name': {
    type: String,
    optional: true
  },
  'i18n.fr': {
    type: Object,
    optional: true
  },
  'i18n.fr.name': {
    type: String,
    optional: true
  }
});

Taxons.attachSchema(Taxons.schema);
