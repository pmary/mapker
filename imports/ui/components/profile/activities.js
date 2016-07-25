import React, { PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { streamClient } from '/imports/api/stream/client/config.js';

class ProfileActivities extends React.Component {
  /**
   * constructor
   * @param {object} props
   */
  constructor(props) {
    super(props);

    this.state = {};
  }
  /**
   * Handle the post submit.
   * @param {SytheticEvent} e
   */
  handleSubmit(e) {
    e.preventDefault();

    // Get the client token
    Meteor.call('stream.user.getToken', (err, token) => {
      if (token) {
      }
    });

  }
  /**
   * render
   * @return {ReactElement} markup
   */
  render() {
    return(
      <div className="profilePosts">
        <form onSubmit={this.handleSubmit.bind(this)}>
          <textarea className="form-control" placeholder="What's happening? ">
          </textarea>
          <div className="pull-right">
            <button type="submit" className="btn btn-primary">Post</button>
          </div>
        </form>
      </div>
    )
  }
}

export default ProfileActivities;
