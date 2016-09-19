import React, {Component, PropTypes} from 'react';
import {Text} from 'react-native';
import database from 'firebase/database';
import Agenda from '../components/Agenda';

export default class CurrentAgendaPage extends Component {
  static contextTypes = {
    app: PropTypes.object.isRequired,
  };

  state = {
    agenda: null,
  };

  detachAgendaListener = null;

  setTimeboxItem = async (item) => {
    const db = this.context.app.database();
    return db.ref('timebox').set({
      ...item,
      startTime: database.ServerValue.TIMESTAMP,
    });
  };

  componentDidMount() {
    const db = this.context.app.database();
    const ref = db.ref('agenda');
    const listener = ref.on('value', (snapshot) => {
      this.setState({agenda: snapshot.val()});
    });

    this.detachAgendaListener = () => ref.off('value', listener);
  }

  componentWillUnmount() {
    this.detachAgendaListener();
  }

  render() {
    const {agenda} = this.state;

    if (!agenda) {
      return null;
    }

    return (
      <Agenda
        {...agenda}
        onItemSelect={this.setTimeboxItem}
      />
    );
  }
}
