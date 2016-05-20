import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

// The user collection is provided by the Meteor official account package

if (Meteor.isServer) {
  // Ensuring every user has an email address
}

// Shema definition
Schema = {};

Schema.userProfile = new SimpleSchema({
  firstname: {
    type: String,
    min: 2,
    max: 50,
    optional: true
  },
  fullname: {
    type: String,
    optional: true
  },
  language: {
    type: String,
    max: 2,
    allowedValues: [
      'en', 'zh', 'fr'
    ]
  },
  lastname: {
    type: String,
    min: 2,
    max: 50,
    optional: true
  },
  username: {
    type: String,
    regEx: /^[a-z0-9A-Z_]{3,15}$/,
    unique: true,
    max: 15
  }
});

Schema.User = new SimpleSchema({
  emails: {
    type: Array,
    optional: true
  },
  "emails.$": {
    type: Object
  },
  "emails.$.address": {
    type: String,
    regEx: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  },
  "emails.$.verified": {
    type: Boolean
  },
  createdAt: {
    type: Date
  },
  profile: {
    type: Schema.userProfile,
    optional: true
  },
  services: {
    type: Object,
    optional: true,
    blackbox: true
  },
  roles: {
    type: [String],
    optional: true
  }
});

Meteor.users.attachSchema(Schema.User);
