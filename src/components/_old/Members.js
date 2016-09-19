import React, {Component, PropTypes} from 'react';
import {getOrgMembers} from '../github';

export default class Members extends Component {
  static contextTypes = {
    app: PropTypes.object.isRequired,
    accessToken: PropTypes.string.isRequired,
  };

  onUpdateMembers = async (e) => {
    e.preventDefault();

    const {app, accessToken} = this.context;
    const orgMembers = await getOrgMembers({accessToken});

    const orgMembersMap = orgMembers.reduce((members, {id}) => {
      members[id] = true;
      return members;
    }, {});

    const db = app.database();
    return db.ref('members').set(orgMembersMap);
  }

  render() {
    return (
      <div>
        <button onClick={this.onUpdateMembers}>Update TC39 Members</button>
      </div>
    );
  }
};
