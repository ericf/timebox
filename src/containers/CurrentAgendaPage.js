import React, {Component, PropTypes} from 'react';
import {View, Text, ActivityIndicator, StyleSheet} from 'react-native';
import {Link} from 'react-router';
import database from 'firebase/database';
import {createAgenda} from '../agendas';
import {fetchGithub} from '../github';
import Navigate from '../components/Navigate';
import Agenda from '../components/Agenda';

export default class CurrentAgendaPage extends Component {
  static contextTypes = {
    app: PropTypes.object.isRequired,
    isAuthorized: PropTypes.bool.isRequired,
    accessToken: PropTypes.string,
  };

  state = {
    agenda: undefined,
    isLoading: false,
    isItemSelected: false,
  };

  detachAgendaListener = null;

  refreshAgenda = async () => {
    const {app, accessToken} = this.context;
    const {agenda: {url}} = this.state;

    const res = await fetchGithub(url, {accessToken});
    if (!res.ok) {
      return;
    }

    const agenda = createAgenda(await res.json());
    const {agenda: {id, sha}} = this.state;

    if (agenda.id === id && agenda.sha !== sha) {
      return app.database().ref('agenda').set(agenda);
    }
  };

  setTimeboxItem = async (item) => {
    const {app} = this.context;
    const db = app.database();
    const timeboxRef = db.ref('timebox');
    const currentItem = (await timeboxRef.once('value')).val();

    let shouldSetItem = true;
    if (currentItem && !currentItem.isPaused) {
      shouldSetItem = window.confirm(
        `There's currently a timeboxed item, are sure you want to change it?`
      );
    }

    if (shouldSetItem) {
      await timeboxRef.set({
        ...item,
        startTime: database.ServerValue.TIMESTAMP,
      });

      this.setState({isItemSelected: true});
    }
  };

  componentDidMount() {
    setTimeout(() => {
      this.setState(({agenda}) => ({
        isLoading: agenda === undefined,
      }));
    }, 200);

    const db = this.context.app.database();
    const ref = db.ref('agenda');
    const listener = ref.on('value', (snapshot) => {
      this.setState({
        agenda: snapshot.val(),
        isLoading: false,
      });
    });

    this.detachAgendaListener = () => ref.off('value', listener);
  }

  componentWillUnmount() {
    this.detachAgendaListener();
  }

  render() {
    const {styles} = CurrentAgendaPage;
    const {isAuthorized} = this.context;
    const {agenda, isLoading, isItemSelected} = this.state;

    if (isItemSelected) {
      return (
        <Navigate to='/'/>
      );
    }

    if (isLoading) {
      return (
        <ActivityIndicator color='black'/>
      );
    }

    if (agenda === undefined) {
      return (
        null
      );
    }

    if (!agenda) {
      return (
        <Text style={styles.noAgenda}>
          There's no current agenda.{' '}
          {isAuthorized ? (
            <Text>
              (<Link to='/agendas/'>Set Agenda</Link>)
            </Text>
          ) : (
            null
          )}
        </Text>
      );
    }

    return (
      <View>
        <Text
          style={styles.heading}
          accessibilityRole='heading'
        >
          Current TC39 Agenda:{' '}
          {isAuthorized ? (
            <Text>
              (<Link to='/agendas/' key={0}>Change</Link>)
            </Text>
          ) : (
            null
          )}
        </Text>
        <Agenda
          agenda={agenda}
          onItemSelect={isAuthorized ? this.setTimeboxItem : null}
          onAgendaRefresh={isAuthorized ? this.refreshAgenda : null}
        />
      </View>
    );
  }

  static styles = StyleSheet.create({
    heading: {
      color: 'rgba(0, 0, 0, 0.6)',
    },
    noAgenda: {
      fontStyle: 'italic',
    },
  });
}
