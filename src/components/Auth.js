import React, {PureComponent, PropTypes} from 'react';
import {View, Image, StyleSheet} from 'react-native';
import Button from './Button';

export default class Auth extends PureComponent {
  static propTypes = {
    onSignIn : PropTypes.func.isRequired,
    onSignOut: PropTypes.func.isRequired,
    user     : PropTypes.object,
  };

  onSignInPress = (e) => {
    e.preventDefault();
    this.props.onSignIn();
  }

  onSignOutPress = (e) => {
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
        <View
          style={styles.container}
          accessibilityRole='complementary'
        >
          <Button
            label='Sign In'
            onPress={this.onSignInPress}
          />
        </View>
      );
    }

    return (
      <View
        style={styles.container}
        accessibilityRole='complementary'
      >
        <Image
          accessibilityLabel={`${user.displayName}'s avatar`}
          source={{uri: user.photoURL}}
          style={styles.avatar}
        />
        <Button
          label='Sign Out'
          onPress={this.onSignOutPress}
        />
      </View>
    );
  }

  static styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
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
