import { Meteor } from 'meteor/meteor';
import { s3 } from './config.js';

Meteor.methods({
  /**
   * @description
   * Uploads an arbitrarily sized buffer, blob, or stream, using intelligent
   * concurrent handling of parts if the payload is large enough.
   *
   * @param {Object} params
   * @param {Object} options
   * @see http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#upload-property
   */
  'aws.s3.upload': function (params, options) {
    var userId = Meteor.userId(); if (!userId) { return; }

    
  }
});
