import React, {Component, PropTypes} from 'react';
import {View, Text, ActivityIndicator, StyleSheet} from 'react-native';
import {Link} from 'react-router';
import database from 'firebase/database';
import Navigate from '../components/Navigate';
import Agenda from '../components/Agenda';

export default class CurrentAgendaPage extends Component {
  static contextTypes = {
    app: PropTypes.object.isRequired,
    isAuthorized: PropTypes.bool.isRequired,
  };

  state = {
    agenda: null,
    isLoading: false,
    isItemSelected: false,
  };

  detachAgendaListener = null;

  setTimeboxItem = async (item) => {
    const db = this.context.app.database();
    await db.ref('timebox').set({
      ...item,
      startTime: database.ServerValue.TIMESTAMP,
    });

    this.setState({isItemSelected: true});
  };

  componentDidMount() {
    setTimeout(() => {
      this.setState(({agenda}) => ({
        isLoading: !agenda,
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

    if (!agenda) {
      return null;
    }

    return (
      <View>
        <Text
          style={styles.heading}
          accessibilityRole='heading'
        >
          Current TC39 Agenda:{' '}
          {isAuthorized ? (
            ['(', <Link to='/agendas/' key={0}>Change</Link>, ')']
          ) : (
            null
          )}
        </Text>
        <Agenda
          agenda={agenda}
          onItemSelect={isAuthorized ? this.setTimeboxItem : null}
        />
      </View>
    );
  }

  static styles = StyleSheet.create({
    heading: {
      color: 'rgba(0, 0, 0, 0.6)',
    },
  });
}
