import AWS from 'aws-sdk';

AWS.config.update({
  accessKeyId: Meteor.settings.private.aws[process.env.NODE_ENV].accessKeyId,
  secretAccessKey: Meteor.settings.private.aws[process.env.NODE_ENV].secretAccessKey,
  region: Meteor.settings.private.aws[process.env.NODE_ENV].region // Like "eu-central-1"
});

export const s3 = new AWS.S3({
  params: {Bucket: Meteor.settings.private.aws[process.env.NODE_ENV].bucket}
});
