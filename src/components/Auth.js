import React, {PureComponent, PropTypes} from 'react';
import {View, Image, StyleSheet} from 'react-native';
import Button from './Button';

export default class Auth extends PureComponent {
  static propTypes = {
    onSignIn : PropTypes.func.isRequired,
    onSignOut: PropTypes.func.isRequired,
    user     : PropTypes.object,
  };

  onSignInClick = (e) => {
    e.preventDefault();
    this.props.onSignIn();
  }

  onSignOutClick = (e) => {
    e.preventDefault();
    this.props.onSignOut();
  }

  render() {
    const {styles} = Auth;
    const {user} = this.props;

    if (!user) {
      return null;
    }

    if (user.isAnonymous) {
      return (
        <View style={styles.container}>
          <Button
            label='Sign In'
            onPress={this.onSignInClick}
          />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <Image
          accessibilityLabel={`${user.displayName}'s avatar`}
          source={{uri: user.photoURL}}
          style={styles.avatar}
        />
        <Button
          label='Sign Out'
          onPress={this.onSignOutClick}
        />
      </View>
    );
  }

  static styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    avatar: {
      width: 32,
      height: 32,
      borderRadius: 3,
      marginRight: '0.5rem'
    },
  });
};
