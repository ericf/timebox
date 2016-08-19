import React, {Component, PropTypes} from 'react';
import Auth from './Auth';
import Members from './Members';

class App extends Component {
  static contextTypes = {
    app         : PropTypes.object.isRequired,
    now         : PropTypes.func.isRequired,
    isAuthorized: PropTypes.bool.isRequired,
    isAdmin     : PropTypes.bool.isRequired,
    user        : PropTypes.object,
  };

  render() {
    const {app, user, now, isAdmin} = this.context;

    return (
      <div>
        {user ? <Auth auth={app.auth()} user={user}/> : null}
        {isAdmin ? <Members database={app.database()}/> : null}
        <p>{now()}</p>
      </div>
    );
  }
}

export default App;
