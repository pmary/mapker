import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

// The user collection is provided by the Meteor official account package

if (Meteor.isServer) {
  // Ensuring every user has an email address
}

// Shema definition
Schema = {};

Schema.userProfile = new SimpleSchema({
  activated: {
    type: Boolean,
    autoValue: function() {
      if (this.isInsert) {
        val = false;
        return val;
      } else if (
        this.isFromTrustedCode &&
        this.field('activated').isSet &&
        (this.isUpsert || this.isUpdate)
      ) {
        var val = this.field('activated');
        return val;
      } else {
        this.unset();  // Prevent user from supplying their own value
      }
    }
  },
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
  },
  headline: {
    type: String,
    optional: true
  },
  skills: {
    type: Array,
    optional: true
  },
  "skills.$": {
    type: String
  },
  "location": {
    type: Object,
    optional: true
  },
  "location.country": {
    type: String
  },
  "location.countryCode": {
    type: String,
    max: 2,
    optional: true
  },
  "location.postcode": {
    type: String
  },
  "location.region": {
    type: String
  },
  "location.coordinate": {
    type: Object
  },
  "location.coordinate.lat": {
    type: String
  },
  "location.coordinate.lon": {
    type: String
  },
  "location.bbox": {
    type: Array,
    optional: true
  },
  "location.bbox.$": {
    type: Number,
    decimal: true
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
    type: Date,
    optional: true
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
