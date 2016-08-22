import React, {Component, PropTypes} from 'react';
import Auth from './Auth';
import Members from './Members';
import AgendasList from './AgendasList';
import Agenda from './Agenda';

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
    const db = this.context.app.database();
    db.ref('agenda').set(agenda);
  };

  componentDidMount() {
    const db = this.context.app.database();
    this.agendaRef = db.ref('agenda');
    this.agendaRef.on('value', (snapshot) => {
      this.setState({agenda: snapshot.val()});
    });
  }

  componentWillUnmount() {
    this.agendaRef.off();
  }

  render() {
    const {app, isAuthorized, isAdmin,user} = this.context;
    const {agenda} = this.state;

    return (
      <div>
        {user ? <Auth auth={app.auth()} user={user}/> : null}
        {isAdmin ? <Members database={app.database()}/> : null}
        {isAuthorized ? <AgendasList onAgendaSelect={this.onAgendaSelect}/>: null}
        <div>
          <p>Current Agenda:</p>
          {agenda ? <Agenda agenda={agenda}/> : null}
        </div>
      </div>
    );
  }
}

export default App;
