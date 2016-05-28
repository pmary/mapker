import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Link, browserHistory } from 'react-router';
import Alert from 'react-s-alert';
import '/imports/api/users/users.js';

// Define a validation context from the users SimpleSchema
var formValidation = Schema.User.newContext();

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.render = this.render.bind(this);
    this.state = {
      email: { value: '', isValid: false, hasError: false, onFocus: false },
      password: { value: '', isValid: false, hasError: false, onFocus: false }
    };
  }
  componentWillMount() {
    var user = Meteor.user();
    // If there is a user
    if (user) {
      // Redirect the user to his profile
      browserHistory.push('/users/' + user.profile.username);
    }
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
  handlePasswordChange(event) {
    this.setState({
      password:{
        value     : event.target.value,
        isValid   : event.target.value.match(/^(?=.*\d)[0-9a-zA-Z]{6,}$/),
        hasError  : !event.target.value.match(/^(?=.*\d)[0-9a-zA-Z]{6,}$/),
        onFocus   : true
      }
    });
  }
  handleSubmit(event) {
    event.preventDefault();

    // Set the submit btn state to loading
    var target = $('.btn-submit');
    target.button('loading');

    var email = this.state.email.value;
    var password = this.state.password.value;

    if (!email || !password) {
      return target.button('reset');;
    }
    else {
      Meteor.loginWithPassword(email, password, (err, res) => {
        target.button('reset');
        if (err) {
          console.log('Err: ', err);
          Alert.error(err.reason, {
            position: 'top',
            timeout: 5000
          });
        }
        else {
          var user = Meteor.user();
          // Redirect the user to his profile
          browserHistory.push('/users/' + user.profile.username);
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
            className="row form-inline sign-in-form"
            onSubmit={this.handleSubmit.bind(this)}
          >
            <h2>Sign In</h2>
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
              <div className={
                  "input-group password-input-group" +
                  (this.state.password.isValid ? ' valid' : '') +
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
                  id="login-password"
                  placeholder="Password"
                  required
                  onFocus={ this.onFocus }
                  onBlur={ this.onBlur }
                  value={this.state.password.value}
                  onChange={this.handlePasswordChange.bind(this)}
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
                  Sign In
                </button>

                <Link
                  to={`/sign-up`}
                  type="button"
                  className="btn btn-transparent"
                >
                  Create an account
                </Link>
              </div>

              <p><Link to={`/forgot-password`}>Forgot Password?</Link></p>
            </div>

          </form>

        </div>
      </div>
    );
  }
}

export default SignIn;
