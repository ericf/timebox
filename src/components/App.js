import React, {Component, PropTypes} from 'react';
import Auth from './Auth';
import Members from './Members';
import AgendasList from './AgendasList';

class App extends Component {
  static contextTypes = {
    app         : PropTypes.object.isRequired,
    now         : PropTypes.func.isRequired,
    isAuthorized: PropTypes.bool.isRequired,
    isAdmin     : PropTypes.bool.isRequired,
    user        : PropTypes.object,
  };

  state = {
    agenda: null,
  };

  onAgendaSelect = (agenda) => {
    this.setState({agenda});
  };

  render() {
    const {app, user, isAdmin} = this.context;

    return (
      <div>
        {user ? <Auth auth={app.auth()} user={user}/> : null}
        {isAdmin ? <Members database={app.database()}/> : null}
        <AgendasList onAgendaSelect={this.onAgendaSelect}/>
      </div>
    );
  }
}

export default App;
