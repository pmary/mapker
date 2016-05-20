import { Meteor } from 'meteor/meteor';
import React from 'react';
import { browserHistory, Link } from 'react-router';
import Alert from 'react-s-alert';
import '/imports/api/users/users.js';

// Define a validation context from the users SimpleSchema
var formValidation = Schema.User.newContext();

class ResetPassword extends React.Component {
  constructor(props) {
    super(props);
    this.render = this.render.bind(this);
    this.state = {
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
  handleSubmit(event) {
    event.preventDefault();

    // Set the submit btn state to loading
    var target = $('.btn-submit');
    target.button('loading');

    var password = this.state.password.value;
    var passwordRepeat = this.state.password.value;
    var token = this.props.params.token;

    if (!password && passwordRepeat && password === passwordRepeat) {
      target.button('reset');
      return;
    }
    else {
      Accounts.resetPassword(token, password, function (err) {
        target.button('reset');
        if (err) {
          console.log('Err: ', err);
          Alert.error(err.reason, {
            position: 'top-right',
            timeout: 5000
          });

          // If the token was expired, redirect to /forgot-password
          if (err.reason == "Token expired") {
            browserHistory.push('/forgot-password');
          }
        }
        else {
          Alert.success(`Your password has been reset`, {
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
            className="row form-inline reset-password-form"
            onSubmit={this.handleSubmit.bind(this)}
          >
            <h2>Reset your password</h2>

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
                  placeholder="New password"
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
                  Reset my password
                </button>
              </div>
            </div>

          </form>

        </div>
      </div>
    );
  }
}

export default ResetPassword;
