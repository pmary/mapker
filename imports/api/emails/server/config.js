// @see https://mandrillapp.com/api/docs/index.nodejs.html
import mandrill from 'mandrill-api/mandrill';

export const mandrill_client = new mandrill.Mandrill(
  Meteor.settings.private.mandrill.api_key
);
