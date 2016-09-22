import React, {Component, PropTypes} from 'react';
import {Match} from 'react-router';
import {Text} from 'react-native';

export default class MatchWhenAuthorized extends Component {
  static contextTypes = {
    isAuthorized: PropTypes.bool.isRequired,
  };

  render() {
    const {isAuthorized} = this.context;
    const {component: Component, ...props} = this.props;

    return (
      <Match {...props} render={(props) => (
        isAuthorized ? (
          <Component {...props}/>
        ) : (
          <Text>Not Authorized</Text>
        )
      )}/>
    );
  }
}
