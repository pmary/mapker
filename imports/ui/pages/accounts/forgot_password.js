import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Link } from 'react-router';
import Alert from 'react-s-alert';
import '/imports/api/users/users.js';

// Define a validation context from the users SimpleSchema
var formValidation = Schema.User.newContext();

class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);
    this.render = this.render.bind(this);
    this.state = {
      email: { value: '', isValid: false, hasError: false, onFocus: false }
    };
  }
  onFocus(event) {
    $(event.currentTarget).parent().addClass('on-focus');
  }
  onBlur(event) {
    $(event.currentTarget).parent().removeClass('on-focus');
  }
  handleEmailChange(event) {
    this.setState({
      email:{
        value: event.target.value,
        isValid: formValidation.validateOne({
          'emails.$.address': event.target.value
        },'emails.$.address'),
        hasError: !formValidation.validateOne({
          'emails.$.address': event.target.value
        },'emails.$.address'),
        onFocus: true
      }
    });
  }
  handleSubmit(event) {
    event.preventDefault();

    // Set the submit btn state to loading
    var target = $('.btn-submit');
    target.button('loading');

    var email = this.state.email.value;

    if (!email) {
      return target.button('reset');
    }
    else {
      Accounts.forgotPassword({email: email}, function (err, res) {
        target.button('reset');
        if (err) {
          console.log('Err: ', err);
          Alert.error(err.reason, {
            position: 'top',
            timeout: 5000
          });
        }
        else {
          Alert.info(`The instructions to reset your password has been sent to
            you by email`, {
            position: 'top',
            timeout: 5000
          });
        }
      });
    }
  }
  render() {
    return (
      <div>
        <div
          className="
          col-xs-12
          col-sm-12
          col-md-12
          col-lg-12
          vcenter"
        >
          <form
            className="row form-inline forgot-password-form"
            onSubmit={this.handleSubmit.bind(this)}
          >
            <h2>Forgot password</h2>
            <div
              className="
              form-group
              col-xs-10 col-xs-offset-1
              col-sm-10 col-sm-offset-1
              col-md-12 col-md-offset-0
              col-lg-12"
            >
              <div className={
                  "input-group email-input-group" +
                  (this.state.email.isValid ? ' valid' : '') +
                  (this.state.email.onFocus ? ' on-focus' : '')
                }
              >
                <div className="input-group-addon">@</div>
                <input
                  type="email"
                  className="form-control"
                  id="login-email"
                  placeholder="Email"
                  required
                  onFocus={ this.onFocus }
                  onBlur={ this.onBlur }
                  value={this.state.email.value}
                  onChange={this.handleEmailChange.bind(this)}
                />
              </div>
            </div>

            <div
              className="
              form-group
              col-xs-10 col-xs-offset-1
              col-sm-10 col-sm-offset-1
              col-md-12 col-md-offset-0
              col-lg-12"
            >
              <div className="input-group submit-input-group">
                <button
                  type="submit"
                  className="btn btn-default btn-submit"
                  data-loading-text="<i class='fa fa-circle-o-notch fa-spin'></i>"
                >
                  Send instructions
                </button>

                <Link
                  to={`/sign-in`}
                  type="button"
                  className="btn btn-transparent"
                >
                  Login to an existing account
                </Link>

                <Link
                  to={`/sign-up`}
                  type="button"
                  className="btn btn-transparent"
                >
                  Create an account
                </Link>
              </div>
            </div>

          </form>

        </div>
      </div>
    );
  }
}

export default ForgotPassword;
