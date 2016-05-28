import React from 'react';
import { IndexLink, Link, browserHistory } from 'react-router';
import { Glyphicon, Button, Navbar, Nav, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
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
            <Nav pullRight>
              <MediaQuery query='(max-width: 767px)'>
                <NavItem eventKey={5} href="#">Less than 767px</NavItem>
              </MediaQuery>

              {Meteor.user() ?
                <NavItem onClick={ this.logout }>Logout</NavItem>
                :
                <LinkContainer to={{ pathname: '/sign-in'}}>
                  <NavItem onClick={ this.handleNavClick }>Login</NavItem>
                </LinkContainer>
              }
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
}

export default PrimaryNav;
