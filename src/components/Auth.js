import React, {PureComponent, PropTypes} from 'react';
import {GithubAuthProvider} from 'firebase/auth';

const AnonymousUser = ({onSignIn}) => (
  <div>
    <button onClick={onSignIn}>Sign In</button>
  </div>
);

const AuthenticatedUser = ({user, onSignOut}) => (
  <div>
    {user.displayName}
    <button onClick={onSignOut}>Sign Out</button>
  </div>
);

export default class Auth extends PureComponent {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
  };

  onSignIn = (e) => {
    e.preventDefault();

    const provider = new GithubAuthProvider();
    this.props.auth.signInWithRedirect(provider);
  }

  onSignOut = (e) => {
    e.preventDefault();
    this.props.auth.signOut();
  }

  render() {
    const {user} = this.props;

    if (user.isAnonymous) {
      return (
        <AnonymousUser onSignIn={this.onSignIn}/>
      );
    }

    return (
      <AuthenticatedUser
        user={user}
        onSignOut={this.onSignOut}
      />
    );
  }
};
