import React, {Component, PropTypes} from 'react';
import {Match, Link} from 'react-router';
import {Text} from 'react-native';

export default class MatchWhenAuthorized extends Component {
  static contextTypes = {
    isAuthorized: PropTypes.bool.isRequired,
    isAdmin: PropTypes.bool.isRequired,
  };

  static propTypes = {
    adminOnly: PropTypes.bool,
  };

  render() {
    const {isAuthorized, isAdmin} = this.context;
    const {component: Component, adminOnly, ...props} = this.props;

    return (
      <Match {...props} render={(props) => (
        isAuthorized && (adminOnly ? isAdmin : true) ? (
          <Component {...props}/>
        ) : (
          <Text>
            You're not authorized to view this page.{' '}
            Either sign in, or return <Link to='/'>home</Link>.
          </Text>
        )
      )}/>
    );
  }
}
