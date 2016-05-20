import { Meteor } from 'meteor/meteor';
import '/imports/startup/server';

Meteor.startup(() => {
  process.env.MAIL_URL = Meteor.settings.private.mandrill.mail_url;
});
