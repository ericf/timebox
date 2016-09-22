import React, {Component, PropTypes} from 'react';
import {View, StyleSheet} from 'react-native';
import {fetchGithub} from '../github';
import Button from '../components/Button';
import Navigate from '../components/Navigate';

export default class MembersPage extends Component {
  static contextTypes = {
    app: PropTypes.object.isRequired,
    accessToken: PropTypes.string.isRequired,
  };

  state = {
    isMembersUpdated: false,
  };

  onUpdateMembersPress = async (e) => {
    e.preventDefault();

    const {app, accessToken} = this.context;
    const orgMembersUrl = '/orgs/tc39/members';
    const orgMembersRes = await fetchGithub(orgMembersUrl, {accessToken});
    const orgMembers = await orgMembersRes.json();

    const orgMembersMap = orgMembers.reduce((members, {id}) => {
      members[id] = true;
      return members;
    }, {});

    const db = app.database();
    await db.ref('members').set(orgMembersMap);

    this.setState({isMembersUpdated: true});
  };

  render() {
    const {styles} = MembersPage;
    const {isMembersUpdated} = this.state;

    if (isMembersUpdated) {
      return (
        <Navigate to='/'/>
      );
    }

    return (
      <View style={styles.container}>
        <Button
          label='Update TC39 Members'
          onPress={this.onUpdateMembersPress}
        />
      </View>
    );
  }

  static styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
    },
  });
}
