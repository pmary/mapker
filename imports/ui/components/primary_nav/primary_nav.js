import React, { Component, PropTypes } from 'react';
import { IndexLink, Link, browserHistory } from 'react-router';
import { Glyphicon, Button, Navbar, Nav, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { createContainer } from 'meteor/react-meteor-data';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import MediaQuery from 'react-responsive';

class PrimaryNav extends React.Component {
  constructor(props) {
    super(props);
  }
  handleNavClick() {
    if ( $('.primary-nav .navbar-collapse').hasClass('in') ) {
      $(".primary-nav .navbar-toggle").click();
    }
  }
  logout() {
    Meteor.logout(function(err) {
      browserHistory.push('/');
    })
  }
  render() {
    var pullRight;
    if (this.props.user) {
      pullRight= (
        <Nav pullRight>
          <LinkContainer
            to={{ pathname: '/users/'+this.props.user.profile.username}}
          >
            <NavItem>
              {this.props.user.profile.fullname}
            </NavItem>
          </LinkContainer>
          <NavItem onClick={ this.logout }>Logout</NavItem>
        </Nav>
      );
    }
    else {
      pullRight = (
        <Nav pullRight>
          <LinkContainer to={{ pathname: '/sign-in'}}>
            <NavItem onClick={ this.handleNavClick }>Login</NavItem>
          </LinkContainer>
        </Nav>
      );
    }

    return (
      <div>
        <Navbar className="primary-nav navbar-inverse navbar-fixed-top">
          <Navbar.Header>
            <Navbar.Brand>
              <ReactCSSTransitionGroup transitionName="example"
                transitionAppear = {true} transitionAppearTimeout = {500}
                transitionEnter = {false} transitionLeave = {false}>
                <IndexLink to="#" activeClassName="active">
                  <img
                    onClick={ this.handleNavClick }
                    src="/images/logo-mapker-light.png" alt="Mapker"
                  />
                </IndexLink>
              </ReactCSSTransitionGroup>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <NavItem eventKey={1} href="/">Places</NavItem>
              <NavItem eventKey={2} href="/">Skills</NavItem>
              <NavItem eventKey={3} href="/">Communities</NavItem>
              <NavItem eventKey={4} href="/">Events</NavItem>
            </Nav>
            {pullRight}
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
}

// Define the type of the given properties
PrimaryNav.propTypes = {
  user: PropTypes.object
}

/**
 * Create a container component to reactively render the wrapped component in
 * response to any changes to reactive data sources accessed from inside the
 * function proded to it.
 *
 * @see http://guide.meteor.com/react.html#data
 */
export default createContainer (({ params }) => {
  const user = Meteor.user();

  return {
    user
  }

}, PrimaryNav);
