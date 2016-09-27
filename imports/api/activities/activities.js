import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

// Shema definition
Schema = {};

/**
 * Define the collection hooks and data cleaning functions
 *
 * @see http://guide.meteor.com/collections.html#hooks
 */
class ActivitiesCollection extends Mongo.Collection {
  /*
  insert (shop, callback) {
    const ourShop = shop;

    // Add some logic

    return super.insert(ourShop, callback);
  }
  */
}

/**
 * The taxons collection from a Mongo collection
 */
export const Activities = new ActivitiesCollection('activities');

/**
 * Design the taxons data schema
 * @see https://github.com/aldeed/meteor-simple-schema
 * @see https://getstream.io/docs/#adding-activities
 */
Activities.schema = new SimpleSchema({
  _id: {
    type: String,
    optional: true
  },
  // The user performing the activity
  actor: {
    type: String
  },
  verb: {
    type: String
  },
  object: {
    type: String
  },
  target: {
    type: String
  },
  time: {
    type: String
  },
  to: {
    type: [String]
  }
});

Activities.attachSchema(Activities.schema);
