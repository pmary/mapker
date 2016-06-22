import { Meteor } from 'meteor/meteor';
import React, { PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { createContainer } from 'meteor/react-meteor-data';
import ProfileCover from '/imports/ui/components/profile/cover.js';
import ProfileAvatar from '/imports/ui/components/profile/avatar.js';
import ProfileDetails from '/imports/ui/components/profile/details.js';

class Profile extends React.Component {
  constructor(props) {
    super(props);

    let authProfiles = ['user', 'place'];
    if (authProfiles.indexOf(props.params.type) == -1) {
      // Redirect the user to the 404 page
      browserHistory.push('/404');
    }

    this.state = {
      name: ''
    }
  }
  render() {
    var name = '';
    var firstname = '';
    var lastname = '';
    var alias = '';
    var headline = '';
    var coverUrl = null;
    var avatarUrl = null;
    var location = '';
    var coordinate = {};
    var bboxSouthWest = null;
    var bboxNorthEast = null;

    if (
      this.props.user &&
      this.props.user.profile
    ) {
      if (this.props.user.profile.fullname) {
        name = this.props.user.profile.fullname;
      }
      if (this.props.user.profile.firstname) {
        firstname = this.props.user.profile.firstname;
      }
      if (this.props.user.profile.lastname) {
        lastname = this.props.user.profile.lastname;
      }
      if (this.props.user.profile.username) {
        alias = this.props.user.profile.username;
      }
      if (this.props.user.profile.headline) {
        headline = this.props.user.profile.headline;
      }
      if (this.props.user.profile.cover && this.props.user.profile.cover.url) {
        coverUrl = this.props.user.profile.cover.url;
      }
      if (this.props.user.profile.avatar && this.props.user.profile.avatar.url){
        avatarUrl = this.props.user.profile.avatar.url;
      }
      if (this.props.user.profile.location) {
        let country = this.props.user.profile.location.country;
        let postcode = this.props.user.profile.location.postcode;
        let region = this.props.user.profile.location.region;
        location = `${postcode} ${region}, ${country}`;

        if (this.props.user.profile.location.coordinate) {
          coordinate = this.props.user.profile.location.coordinate;
        }

        if (this.props.user.profile.location.bbox) {
          bboxSouthWest = [
            this.props.user.profile.location.bbox[3],
            this.props.user.profile.location.bbox[2]
          ];
          bboxNorthEast = [
            this.props.user.profile.location.bbox[1],
            this.props.user.profile.location.bbox[0]
          ];
        }
      }
    }

    return (
      <div className="profile-page">
        <div className="">
          <ProfileCover type={this.props.params.type} coverUrl={coverUrl}>
            <ProfileAvatar type={this.props.params.type} avatarUrl={avatarUrl}/>
          </ProfileCover>
          <ProfileDetails
            type={this.props.params.type}
            name={name}
            firstname={firstname}
            lastname={lastname}
            headline={headline}
            alias={alias}
            location={location}
            coordinate={coordinate}
            bboxSouthWest={bboxSouthWest}
            bboxNorthEast={bboxNorthEast}
          />
        </div>
      </div>
    )
  }
}

ProfileCover.propTypes = {
  user: PropTypes.object,
  loading: PropTypes.bool
}

ProfileCover.defaultProps = {
  user: null
}

/**
 * Create a container component to reactively render the wrapped component in
 * response to any changes to reactive data sources accessed from inside the
 * function proded to it.
 *
 * @see http://guide.meteor.com/react.html#data
 */
export default createContainer (({ params }) => {
  const userHandler = Meteor.subscribe(
    'users.find',
    {'profile.username': params.username}
  );
  const loading = !userHandler.ready();

  return {
    user: Meteor.users.findOne({'profile.username': params.username})
  }

}, Profile);
