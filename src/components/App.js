import React, {Component, PropTypes} from 'react';
import {GithubAuthProvider} from 'firebase/auth';
import Auth from './Auth';

export default class App extends Component {
  static contextTypes = {
    app : PropTypes.object.isRequired,
    user: PropTypes.object,
  };

  signIn = (e) => {
    const auth = this.context.app.auth();
    const provider = new GithubAuthProvider();
    auth.signInWithRedirect(provider);
  }

  signOut = () => {
    const auth = this.context.app.auth();
    auth.signOut();
  }

  render() {
    return (
      <div>
        <Auth
          user={this.context.user}
          onSignIn={this.signIn}
          onSignOut={this.signOut}
        />
        {this.props.children}
      </div>
    );
  }
}
