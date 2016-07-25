import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { streamClient } from '/imports/api/stream/server/config.js';

Meteor.methods({
  'stream.user.getToken': function () {
    var userId = Meteor.userId();
    if (userId) {
      var token = streamClient.feed('user', Meteor.userId()).token;
      var user = Meteor.user();
      // Instantiate a feed for the client
      var streamUser = streamClient.feed('user', user._id, token);
      // Create an activity
      var activity = {
        actor: 'chris',
  verb: 'add',
  object: 'picture:10',
  message: 'Working on improving the user experience of the Stream Dashboard...'
      };
      // Add the activity to the user
      streamUser.addActivity(activity)
      .then(function(data) {
        console.log('data: ', data);
      })
      .catch(function(reason) {
        console.log('reason: ', reason);
      });
    }
    else {
      return false;
    }
  }
});
