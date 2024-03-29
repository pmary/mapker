// This defines a starting set of data to be loaded if the app is loaded with an empty db.
import '/imports/startup/server/fixtures.js';

// Set up some rate limiting and other important security settings.
import '/imports/startup/server/security.js';

// This defines all the collections, publications and methods that the
// application provides as an API to the client.
import '/imports/api/api.js';

import '/imports/startup/server/config.js';
