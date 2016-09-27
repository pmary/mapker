import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import Followers from './followers.js';

/**
 * Creates a following connection
 * @param {string} targetId - The id of the user to follow
 */
export const follow = new ValidatedMethod({
  name: 'Followers.methods.follow',
  validate: Followers.schema.validator(),
  run({targetId}) {
    return Followers.insert({
      userId: Meteor.userId(),
      targetId: targetId,
      createdAt: new Date()
    });
  }
});

/**
 * Remove a following connection
 * @param {string} targetId - The id of the user to unfollow
 */
export const unfollow = new ValidatedMethod({
  name: 'Followers.methods.unfollow',
  validate: Followers.schema.validator(),
  run({targetId}) {
    return Followers.remove({
      userId: Meteor.userId(),
      targetId: targetId
    });
  }
});
