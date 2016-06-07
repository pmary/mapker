import { Elastic } from './config.js';
import { Taxons } from '/imports/api/taxons/taxons.js';

const _indexName = 'taxon';
const _indexBody = {
  settings: {
    analysis: {
      analyzer: {
        autocomplete: {
          type: "custom",
          tokenizer: "keyword",
          filter: ["lowercase", "substring"]
        }
      },
      filter: {
        substring: {
          type: "nGram",
          min_gram: 1,
          max_gram : 10
        },
        autocomplete_filter: {
          type: 'edge_ngram',
          min_gram: 1,
          max_gram: 10
        }
      }
    }
  },
  mappings: {
    skill: {
      properties: {
        name: {
          type: 'string',
          analyzer: 'english'
        },
        skill_suggest: {
          type: 'completion',
          payloads: true
        },
        name_fr: { type: 'string', analyzer: 'french' },
        name_zh: { type: 'string', analyzer: 'french' }
      }
    }
  }
};

/**
 * @description
 * Check if the an index exist by its name
 *
 * @param {String} indexName
 */
function indexExists (indexName) {
  return new Promise(function (resolve, reject) {
    Elastic.indices.exists({ index: indexName }, function (err, res) {
      if (err) { reject(err); }
      else { resolve(res); }
    });
  });
}

/**
 * Delete an index by its name
 *
 * @param {String} indexName
 */
function deleteIndex(indexName) {
  return new Promise(function (resolve, reject) {
    Elastic.indices.delete({index: indexName}, function (err, res) {
      if (err) { reject(err); }
      else { resolve(res); }
    });
  });
}

/**
 * @description
 * Create a new index
 *
 * @param {String} indexName
 * @param {Object} body
 */
function createIndex (indexName, body) {
  return new Promise(function (resolve, reject) {
    Elastic.indices.create({
      index: indexName,
      body: body
    }, function (err, res) {
      if (err) { reject(err); }
      else { resolve(res); }
    });
  });
}

/**
 * @description
 *
 * @param {Object} taxons - An array of taxons from the Taxons MongoDB
 * @return The result of the ES bulk query
 */
function bulkIndex (taxons) {
  console.log('Enter in bulkIndex');
  return new Promise(function (resolve, reject) {
    var bulkArray = [];
    taxons.map(function (doc) {
      // Format the data
      bulkArray.push({
        index: {
          _index: _indexName,
          _type: doc.type,
          _id: doc._id
        }
      });
      bulkArray.push({
        name: doc.name,
        name_fr: doc.i18n.fr.name,
        name_zh: doc.i18n.zh.name,
        skill_suggest: { input: [doc.name], payload: { _id: doc._id } }
      });
    });

    Elastic.bulk({body: bulkArray}, function (err, res) {
      if (err) { console.log('Err: ',err); reject(err); }
      else { /*console.log('All right');*/ ;resolve(true); }
    })
  });
}

/**
 * @description
 * Used by the collection hooks to update or insert a document after its
 * creation or modification in the collection
 */
function indexDoc (userId, doc, fieldNames, modifier, options) {
  // If the taxon is verified
  if (doc.verified === true) {
    return bulkIndex([doc]);
  }
}

Meteor.methods({
  /**
   * @description
   * Delete the index if exist and re-create and map it, then insert the
   * data from the DB
   */
  'elastic.taxons.reset': function () {
    // Check if the user is an admin
    if (!Roles.userIsInRole(Meteor.userId(), 'admin')) {
      return;
    }

    return indexExists(_indexName)
    .then(function (exists) {
      if (!exists) { return; }
      else {
        return deleteIndex(_indexName);
      }
    })
    .then(function () {
      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          resolve( createIndex(_indexName, _indexBody) );
        }, 2000);
      });
    })
    .then(function () {
      return bulkIndex(Taxons.find({}));
    });
  },
  /**
   * @description
   * Execute a suggest query against the ES taxon index and return the result
   *
   * @return {
   *          suggester: [
   *            {
   *              text: String,
   *              offset: Number,
   *              length: Number,
   *              options: [
   *                text: String, score: Number, payload: { _id: String }
   *              ]
   *            }
   *          ]
   *         }
   * @see https://www.elastic.co/guide/en/elasticsearch/reference/current/search-suggesters-completion.html
   */
  'elastic.taxon.search': function (query) {
    return new Promise(function (resolve, reject) {
      Elastic.suggest({
        index: _indexName,
        type: 'skill',
        body: {
					suggester: {
						text: query,
						completion: {
							field: 'skill_suggest',
							fuzzy : {
								fuzziness : 1
							}
						}
					}
				}
      }, function (err, res) {
        if (err) { console.log(err); reject(err); }
        else { resolve(res); }
      });
    });
  }
});

Taxons.after.update(indexDoc);
Taxons.after.insert(indexDoc);
