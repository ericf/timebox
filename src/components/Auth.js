import React, {PureComponent, PropTypes} from 'react';

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
    const {user} = this.props;

    if (!user) {
      return null;
    }

    if (user.isAnonymous) {
      return (
        <div>
          <button onClick={this.onSignInClick}>Sign In</button>
        </div>
      );
    }

    return (
      <div>
        {user.displayName}
        <button onClick={this.onSignOutClick}>Sign Out</button>
      </div>
    );
  }
};
