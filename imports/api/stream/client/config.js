// @see https://getstream.io/docs/?language=js
import stream from 'getstream';

export const streamClient = stream.connect(
  Meteor.settings.public.steam.key,
  null,
  '10020'
);
