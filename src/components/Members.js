import React, {Component, PropTypes} from 'react';
import {getOrgMembers} from '../github';

export default class Members extends Component {
  static propTypes = {
    database: PropTypes.object.isRequired,
  };

  onUpdateMembers = async (e) => {
    const orgMembers = await getOrgMembers();

    const orgMembersMap = orgMembers.reduce((members, {id}) => {
      members[id] = true;
      return members;
    }, {});

    return this.props.database.ref('members').set(orgMembersMap);
  }

  render() {
    return (
      <div>
        <button onClick={this.onUpdateMembers}>Update TC39 Members</button>
      </div>
    );
  }
};
