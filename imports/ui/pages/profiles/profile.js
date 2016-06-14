import { Meteor } from 'meteor/meteor';
import React, { PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import ProfileCover from '/imports/ui/components/profile/cover.js';
import ProfileAvatar from '/imports/ui/components/profile/avatar.js';
import ProfileDetails from '/imports/ui/components/profile/details.js';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'user',
      name: ''
    }
  }
  render() {
    var name = '';
    var alias = '';
    var headline = '';
    var location = '';

    if (
      this.props.user &&
      this.props.user.profile
    ) {
      if (this.props.user.profile.fullname) {
        name = this.props.user.profile.fullname;
      }
      if (this.props.user.profile.username) {
        alias = this.props.user.profile.username;
      }
      if (this.props.user.profile.headline) {
        headline = this.props.user.profile.headline;
      }
      if (this.props.user.profile.location) {
        let country = this.props.user.profile.location.country;
        let postcode = this.props.user.profile.location.postcode;
        let region = this.props.user.profile.location.region;
        location = `${postcode} ${region}, ${country}`;
      }
    }

    return (
      <div className="profile-page">
        <div className="">
          <ProfileCover type={this.state.type} >
            <ProfileAvatar type={this.state.type} />
          </ProfileCover>
          <ProfileDetails
            type={this.state.type}
            name={name}
            alias={alias}
            headline={headline}
            location={location}
          />
        </div>
      </div>
    )
  }
}

ProfileCover.propTypes = {
  user: PropTypes.object
}

ProfileCover.defaultProps = {
  type: null,
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
  const user = Meteor.user();

  return {
    user
  }

}, Profile);
