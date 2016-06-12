import { Meteor } from 'meteor/meteor';
import { s3 } from './config.js';

export const aws = {
  s3: {
    /**
     * @description
     * This method can only be called server side.
     * Uploads an arbitrarily sized buffer, blob, or stream, using intelligent
     * concurrent handling of parts if the payload is large enough.
     *
     * @param {Object} params
     * @param {Object} options
     * @see http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#upload-property
     */
    upload: function (params, options = {}) {
      return new Promise((resolve, reject) => {
        var userId = Meteor.userId();
        if (!userId || this.connection != null) { reject(); }
        check(params, Object);
        check(options, Match.Optional(Object));

        s3.upload(params, options, function(err, data) {
      		if (err) { reject(err); }
      		else { resolve(data.Location); }
      	});
      });
    },
    /**
     * @description
     * This method can only be called server side.
     * Removes the null version (if there is one) of an object and inserts a
     * delete marker, which becomes the latest version of the object.
     * If there isn't a null version, Amazon S3 does not remove any objects.
     *
     * @param {String} key - The key of the object to delete
     * @see http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#deleteObject-property
     */
    deleteObject: function (key) {
      console.log('Will delete ', key);
      return new Promise((resolve, reject) => {
        s3.deleteObject({Key: key}, function(err, data) {
          if (err) { console.log('err: ', err);reject(err); }
          else { resolve(data) }
        });
      });
    }
  }
};
