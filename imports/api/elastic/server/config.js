import elasticsearch from 'elasticsearch';

export const Elastic = new elasticsearch.Client({
  host: Meteor.settings.private.elasticsearch.dev.host
  //log: 'trace'
});

// Create the resource index
/*Elastic.indicies.create({
  index: 'resource',
  body: {
    settings: {
      analysis: {
        analyzer: {

        },
        filter: {

        }
      }
    },
    mapping: {
      user: {
        properties: {

        }
      }
    }
  }
});*/
