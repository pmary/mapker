import { Meteor } from 'meteor/meteor';
import React from 'react';
import { browserHistory, Link } from 'react-router';
import Alert from 'react-s-alert';
import '/imports/api/users/users.js';

// Define a validation context from the users SimpleSchema
var formValidation = Schema.User.newContext();


class SignUp extends React.Component{
  constructor(props) {
    super(props);
    this.render = this.render.bind(this);
    this.state = {
      username: { value: '', isValid: false, hasError: false, onFocus: false },
      firstname: { value: '', isValid: false, hasError: false, onFocus: false },
      lastname: { value: '', isValid: false, hasError: false, onFocus: false },
      email: { value: '', isValid: false, hasError: false, onFocus: false },
      password: { value: '', isValid: false, hasError: false, onFocus: false },
      passwordRepeat: {value: '', isValid: false, hasError: false,onFocus:false}
    };
  }
  onFocus(event) {
    $(event.currentTarget).parent().addClass('on-focus');
  }
  onBlur(event) {
    $(event.currentTarget).parent().removeClass('on-focus');
  }
  handleFirstnameChange(event) {
    this.setState({
      firstname:{
        value: event.target.value,
        isValid: formValidation.validateOne({
          'profile.firstname': event.target.value
        },'profile.firstname'),
        hasError: !formValidation.validateOne({
          'profile.firstname': event.target.value
        },'profile.firstname'),
        onFocus: true
      }
    });
  }
  handleLastnameChange(event) {
    this.setState({
      lastname:{
        value: event.target.value,
        isValid: formValidation.validateOne({
          'profile.lastname': event.target.value
        },'profile.lastname'),
        hasError: !formValidation.validateOne({
          'profile.lastname': event.target.value
        },'profile.lastname'),
        onFocus: true
      }
    });
  }
  handleUsernameChange(event) {
    this.setState({
      username:{
        value: event.target.value,
        isValid: formValidation.validateOne({
          'profile.username': event.target.value
        },'profile.username'),
        hasError: !formValidation.validateOne({
          'profile.username': event.target.value
        },'profile.username'),
        onFocus: true
      }
    });
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
  handlePasswordChange(event) {
    let passwordRepeat = this.state.passwordRepeat.value;
    this.setState({
      password:{
        value     : event.target.value,
        isValid   : event.target.value.match(/^(?=.*\d)[0-9a-zA-Z]{6,}$/),
        hasError  : !event.target.value.match(/^(?=.*\d)[0-9a-zA-Z]{6,}$/),
        onFocus   : true
      }
    });
    this.setState({
      passwordRepeat:{
        value     : passwordRepeat,
        isValid   : passwordRepeat === event.target.value,
        hasError  : passwordRepeat !== event.target.value,
        onFocus   : false
      }
    });
  }
  handlePasswordRepeatChange(event) {
    let password = this.state.password.value;
    this.setState({
      passwordRepeat:{
        value     : event.target.value,
        isValid   : event.target.value === password,
        hasError  : event.target.value !== password,
        onFocus   : true
      }
    });
  }
  handleSubmit(e) {
    e.preventDefault();

    // Set the submit btn state to loading
    var target = $('.btn-submit');
    target.button('loading');

    // Create the user account
    // @see http://docs.meteor.com/#/full/accounts_createuser
    Accounts.createUser({
      email: this.state.email.value,
      password: this.state.password.value,
      profile:{
        fullname: this.state.firstname.value + " " + this.state.lastname.value,
        firstname: this.state.firstname.value,
        lastname: this.state.lastname.value,
        username: this.state.username.value,
        language: 'en'
      }
    }, function (err, res) {
      target.button('reset');
      if (err) {
        Alert.error(err.reason, {
          position: 'top',
          effect: 'jelly'
        });
      }
      else {
        browserHistory.push('/?signedUp=true');
      }
    });
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
            className="row form-inline sign-up-form"
            onSubmit={this.handleSubmit.bind(this)}
          >
            <h2>Create an account</h2>
            <div
              className="
              form-group
              col-xs-10 col-xs-offset-1
              col-sm-10 col-sm-offset-1
              col-md-12 col-md-offset-0
              col-lg-12"
            >
              <div
                className={
                  "input-group firstname-input-group" +
                  (this.state.firstname.isValid ? ' valid' : '') +
                  (this.state.firstname.hasError ? ' error' : '') +
                  (this.state.firstname.onFocus ? ' on-focus' : '')
                }
              >
                <div className="input-group-addon">
                  <span
                    className="glyphicon glyphicon-user"
                    aria-hidden="true">
                  </span>
                </div>
                <input
                  type="text"
                  className="form-control"
                  id="username-firstname"
                  placeholder="Firstname"
                  required
                  onFocus={ this.onFocus }
                  onBlur={ this.onBlur }
                  value={this.state.firstname.value}
                  onChange={this.handleFirstnameChange.bind(this)}
                />
              </div>
              <p className="message error">
                {
                  this.state.firstname.hasError ?
                  'Must contain at least 2 characters and no digit' : null
                }
              </p>
            </div>

            <div
              className="
              form-group
              col-xs-10 col-xs-offset-1
              col-sm-10 col-sm-offset-1
              col-md-12 col-md-offset-0
              col-lg-12"
            >
              <div
                className={
                  "input-group lastname-input-group" +
                  (this.state.lastname.isValid ? ' valid' : '') +
                  (this.state.lastname.hasError ? ' error' : '') +
                  (this.state.lastname.onFocus ? ' on-focus' : '')
                }
              >
                <div className="input-group-addon">
                  <span
                    className="glyphicon glyphicon-user"
                    aria-hidden="true">
                  </span>
                </div>
                <input
                  type="text"
                  className="form-control"
                  id="username-firstname"
                  placeholder="Lastname"
                  required
                  onFocus={ this.onFocus }
                  onBlur={ this.onBlur }
                  value={this.state.lastname.value}
                  onChange={this.handleLastnameChange.bind(this)}
                />
              </div>
              <p className="message error">
                {
                  this.state.lastname.hasError ?
                  'Must contain at least 2 characters and no digit' : null
                }
              </p>
            </div>

            <div
              className="
              form-group
              col-xs-10 col-xs-offset-1
              col-sm-10 col-sm-offset-1
              col-md-12 col-md-offset-0
              col-lg-12"
            >
              <div
                className={
                  "input-group username-input-group" +
                  (this.state.username.isValid ? ' valid' : '') +
                  (this.state.username.hasError ? ' error' : '') +
                  (this.state.username.onFocus ? ' on-focus' : '')
                }
              >
                <div className="input-group-addon">
                  <span
                    className="glyphicon glyphicon-user"
                    aria-hidden="true">
                  </span>
                </div>
                <input
                  type="text"
                  className="form-control"
                  id="username-email"
                  placeholder="Username"
                  required
                  onFocus={ this.onFocus }
                  onBlur={ this.onBlur }
                  value={this.state.username.value}
                  onChange={this.handleUsernameChange.bind(this)}
                />
              </div>
              <p className="message error">
                {
                  this.state.username.hasError ?
                  'Must contain at least 3 characters and no space or special characters' : null
                }
              </p>
            </div>

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
                  (this.state.email.hasError ? ' error' : '') +
                  (this.state.email.onFocus ? ' on-focus' : '')
                }
              >
                <div className="input-group-addon">@</div>
                <input
                  type="email"
                  className="form-control"
                  id="account-email"
                  placeholder="Email"
                  required
                  onFocus={ this.onFocus }
                  onBlur={ this.onBlur }
                  value={this.state.email.value}
                  onChange={this.handleEmailChange.bind(this)}
                />
              </div>
              <p className="message error">
                {this.state.email.hasError ? 'Must be a valid email' : null}
              </p>
            </div>

            <div
              className="
              form-group
              col-xs-10 col-xs-offset-1
              col-sm-10 col-sm-offset-1
              col-md-12 col-md-offset-0
              col-lg-12"
            >
              <div className={
                  "input-group password-input-group" +
                  (this.state.password.isValid ? ' valid' : '') +
                  (this.state.password.hasError ? ' error' : '') +
                  (this.state.password.onFocus ? ' on-focus' : '')
                }
              >
                <div className="input-group-addon">
                  <span
                    className="glyphicon glyphicon-lock"
                    aria-hidden="true">
                  </span>
                </div>
                <input
                  type="password"
                  className="form-control"
                  id="account-password"
                  placeholder="Password"
                  required
                  onFocus={ this.onFocus }
                  onBlur={ this.onBlur }
                  value={this.state.password.value}
                  onChange={this.handlePasswordChange.bind(this)}
                />
              </div>
              <p className="message error">
                {
                  this.state.password.hasError ?
                  'Must contain at least 5 characters and 1 digit' : null
                }
              </p>
            </div>

            <div
              className="
              form-group
              col-xs-10 col-xs-offset-1
              col-sm-10 col-sm-offset-1
              col-md-12 col-md-offset-0
              col-lg-12"
            >
              <div className={
                  "input-group password-reset-input-group" +
                  (this.state.passwordRepeat.isValid ? ' valid' : '') +
                  (this.state.passwordRepeat.hasError ? ' error' : '') +
                  (this.state.passwordRepeat.onFocus ? ' on-focus' : '')
                }
              >
                <div className="input-group-addon">
                  <span
                    className="glyphicon glyphicon-lock"
                    aria-hidden="true">
                  </span>
                </div>
                <input
                  type="password"
                  className="form-control"
                  id="account-password-repeat"
                  placeholder="Repeat your password"
                  required
                  onFocus={ this.onFocus }
                  onBlur={ this.onBlur }
                  value={this.state.passwordRepeat.value}
                  onChange={this.handlePasswordRepeatChange.bind(this)}
                />
              </div>
              <p className="message error">
                {
                  this.state.passwordRepeat.hasError ?
                  'Password does not match the confirm password' : null
                }
              </p>
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
                  Sign Up
                </button>
                <Link
                  to={`/sign-in`}
                  type="button"
                  className="btn btn-transparent"
                >
                  Login to an existing account
                </Link>

                <p><Link to={`/forgot-password`}>Forgot Password?</Link></p>
              </div>
            </div>

          </form>

        </div>
      </div>
    );
  }
};

export default SignUp;
