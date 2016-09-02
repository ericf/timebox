import React, {Component, PropTypes} from 'react';
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

export default class Auth extends Component {
  static contextTypes = {
    app: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
  };

  onSignIn = (e) => {
    e.preventDefault();

    const auth = this.context.app.auth();
    const provider = new GithubAuthProvider();
    auth.signInWithRedirect(provider);
  }

  onSignOut = (e) => {
    e.preventDefault();

    const auth = this.context.app.auth();
    auth.signOut();
  }

  render() {
    const {user} = this.context;

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
