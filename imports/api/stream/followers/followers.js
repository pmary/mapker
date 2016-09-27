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
class FollowersCollection extends Mongo.Collection {
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
const Followers = new FollowersCollection('followers');

/**
 * Design the taxons data schema
 * @see https://github.com/aldeed/meteor-simple-schema
 * @see https://getstream.io/docs/#adding-activities
 */
Followers.schema = new SimpleSchema({
  _id: {
    type: String,
    optional: true
  },
  // The user performing the follow
  userId: {
    type: String
  },
  // The followed user
  targetId: {
    type: String
  },
  createdAt: {
    type: Date
  }
});

Followers.attachSchema(Followers.schema);

export default Followers;
