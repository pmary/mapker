import { browserHistory, Link } from 'react-router';

/**
 * @description
 * After a login attempt succeed
 */
Accounts.onLogin(function (parameters) {
  var user = Meteor.user();
  // Check if the user has activated his profile
  if (!user.profile.activated) {
    // Redirect him to the account activation page
    browserHistory.push('/activate-account');
  }
})
