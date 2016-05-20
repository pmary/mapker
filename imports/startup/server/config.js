/**
 * Customize the email validation system
 * By default, the email is sent from no-reply@meteor.com.
 * If you wish to receive email from users asking for help with their account,
 * be sure to set this to an email address that you can receive email at.
 */
Accounts.emailTemplates.from = 'Mapker <no-reply@mapker.co>';
// The public name of your application.
// Defaults to the DNS name of the application (eg: awesome.meteor.com).
Accounts.emailTemplates.siteName = 'Mapker';
// A Function that takes a user object and returns a String for the subject line of the email.
Accounts.emailTemplates.verifyEmail.subject = function(user) {
  return 'Confirm Your Email Address';
};
// A Function that takes a user object and a url, and returns the body text for the email.
// Note: if you need to return HTML instead, use Accounts.emailTemplates.verifyEmail.html
Accounts.emailTemplates.verifyEmail.text = function(user, url) {
  url = url.replace('#/', ''); // Remove the # from the url.
  return 'Please, click on the following link to verify your email address: ' + url;
};
Accounts.emailTemplates.verifyEmail.html = function(user, url) {
  url = url.replace('#/', ''); // Remove the # from the url.
  return `Please, click on the following link to verify your email address:
  <a href="${url}" al>${url}</a>`;
};

/**
 * Customize the password reset system
 */
 Accounts.emailTemplates.resetPassword.subject = function(user) {
   return 'Reset your password';
 };
Accounts.emailTemplates.resetPassword.text = function (user, url) {
  url = url.replace('#/', ''); // Remove the # from the url.
  // Customize the email template
  return `Hello,
  \n\n
  To reset your password, simply click the link below:
  \n\n
  ${url}
  \n\n
  Thanks.`;
};
Accounts.emailTemplates.resetPassword.html = function (user, url) {
  url = url.replace('#/', ''); // Remove the # from the url.
  // Customize the email template
  return `Hello,
  <p>To reset your password, simply click the link below:</p>
  <a href="${url}" al>${url}</a>
  <br>
  Thanks.`;
};

/**
 * Transactional email configuration. You can use MailGun service or Mandrill
 * for exemple
 * @doc: http://blog.ploki.info/send-email-with-meteor-mailgun/
 * @doc: http://docs.meteor.com/#/full/email
 */
Accounts.emailTemplates.from = 'Mapker <no-reply@mapker.co>';
