import { Meteor } from 'meteor/meteor';
import React from 'react';
import ProfileCover from '/imports/ui/components/profile/cover.js';
import ProfileAvatar from '/imports/ui/components/profile/avatar.js';

class Profile extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="profile-page">
        <div className="">
          <ProfileCover>
            <ProfileAvatar />
          </ProfileCover>
        </div>
      </div>
    )
  }
}

export default Profile;
