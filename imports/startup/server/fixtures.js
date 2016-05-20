import { Meteor } from 'meteor/meteor';

/**
 * Roles fixtures
 */
// Get all the roles
var roles = Roles.getAllRoles().fetch();

// If there is no role
if (!roles || !roles.length) {
  // Create an admin role
  Roles.createRole('admin');
}
