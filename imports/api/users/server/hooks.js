import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

/**
 * @description
 * At the creation of a new user account, send him a verification email
 * and if he his the first user, grant him with admin rights
 *
 * @see http://docs.meteor.com/#/full/accounts_oncreateuser
 */
Meteor.users.after.insert(function(userId, doc) {
  // Send an email with a link the user can use to verify his or her email address.
  Accounts.sendVerificationEmail(doc._id);

  // Check if this is the first user
  if (Meteor.users.find().count() === 1) {
    // Give him the admin role
    Roles.setUserRoles(doc._id, 'admin');
  }
});


/**
 * @description
 * At every login attempt, check if the user email is verified and allow the
 * login only if it is
 *
 * @param {Object} parameters
 */
Accounts.validateLoginAttempt(function (parameters) {
  if (parameters.methodName === 'createUser') {
    // If this is an account creation, let the user log in
    return true;
  }
  else if (
    parameters.user &&
    parameters.user.emails &&
    (parameters.user.emails.length > 0)
  ) {
    // Return true if verified email, false otherwise.
    var found = _.find(
      parameters.user.emails,
      function(thisEmail) { return thisEmail.verified }
    );
    if (!found) {
      throw new Meteor.Error(500, `To activate your account, please check the
        verification email we had sent to your email address`);
    }
    return found && parameters.allowed;
  }
  else {
    return false;
  }
});
