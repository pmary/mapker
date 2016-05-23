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
  verified: {
    type: Boolean
  },
  name: {
    type: String,
    unique: true
  },
  canonicalName: {
    type: String,
    unique: true,
    autoValue: function() {
      var name = this.field("name");
      if (name.isSet) {
        return name.value.toLowerCase();
      } else {
        this.unset();  // Prevent user from supplying their own value
      }
    }
  },
  submitedBy: {
    type: String,
    optional: true,
    autoValue: function() {
      var userId = Meteor.userId();
      if (userId) {
        return userId;
      } else {
        this.unset();  // Prevent user from supplying their own value
      }
    }
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
  },
  createdAt: {
    type: Date,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date()};
      } else {
        this.unset();  // Prevent user from supplying their own value
      }
    }
  },
  // Force value to be current date (on server) upon update
  // and don't allow it to be set upon insert.
  updatedAt: {
    type: Date,
    autoValue: function() {
      if (this.isUpdate) {
        return new Date();
      }
    },
    denyInsert: true,
    optional: true
  }
});

Taxons.attachSchema(Taxons.schema);
