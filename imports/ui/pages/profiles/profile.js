import { Meteor } from 'meteor/meteor';
import React from 'react';
import ProfileCover from '/imports/ui/components/profile/cover.js';
import ProfileAvatar from '/imports/ui/components/profile/avatar.js';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'user'
    }
  }
  render() {
    return (
      <div className="profile-page">
        <div className="">
          <ProfileCover type={this.state.type} >
            <ProfileAvatar type={this.state.type} />
          </ProfileCover>
        </div>
      </div>
    )
  }
}

export default Profile;
