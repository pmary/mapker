// @see https://getstream.io/docs/?language=js
import stream from 'getstream';

export const streamClient = stream.connect(
  Meteor.settings.private.steam.key,
  Meteor.settings.private.steam.secret,
  '10020'
);
