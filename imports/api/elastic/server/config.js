import elasticsearch from 'elasticsearch';

export const Elastic = new elasticsearch.Client({
  host: Meteor.settings.private.elasticsearch[process.env.NODE_ENV].host
  //log: 'trace'
});
