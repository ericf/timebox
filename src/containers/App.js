import React, {Component, PropTypes} from 'react';
import {Match} from 'react-router';
import {View, Text, ActivityIndicator, StyleSheet} from 'react-native';
import {GithubAuthProvider} from 'firebase/auth';
import MatchWhenAuthorized from '../components/MatchWhenAuthorized';
import Auth from '../components/Auth';
import JSLogo from '../components/JSLogo';
import Timer from '../components/Timer';
import TimeboxPage from './TimeboxPage';
import CurrentAgendaPage from './CurrentAgendaPage';
import AgendasPage from './AgendasPage';
import AgendaPage from './AgendaPage';
import MembersPage from './MembersPage';

export default class App extends Component {
  static contextTypes = {
    app : PropTypes.object.isRequired,
    now : PropTypes.func.isRequired,
    user: PropTypes.object,
  };

  state = {
    timebox: {
      startTime: 0,
      duration : 0,
    },
  };

  detachTimeboxListener = null;

  signIn = () => {
    const auth = this.context.app.auth();
    const provider = new GithubAuthProvider();
    auth.signInWithRedirect(provider);
  }

  signOut = () => {
    const auth = this.context.app.auth();
    auth.signOut();
  }

  componentDidMount() {
    const db = this.context.app.database();
    const ref = db.ref('timebox');
    const listener = ref.on('value', (snapshot) => {
      this.setState({timebox: snapshot.val() || {}});
    });

    this.detachTimeboxListener = () => ref.off('value', listener);
  }

  componentWillUnmount() {
    this.detachTimeboxListener();
  }

  render() {
    const {styles} = App;
    const {user, now} = this.context;
    const {timebox} = this.state;

    if (!user) {
      return (
        <ActivityIndicator
          color='black'
          size='large'
          style={styles.loading}
        />
      );
    }

    return (
      <View
        style={styles.container}
        accessibilityRole='application'
      >
        <Auth
          user={user}
          onSignIn={this.signIn}
          onSignOut={this.signOut}
        />
        <View accessibilityRole='main'>
          <Match exactly pattern='/' component={TimeboxPage}/>
          <Match exactly pattern='/agenda' component={CurrentAgendaPage}/>
          <MatchWhenAuthorized pattern='/agendas/' component={AgendasPage}/>
          <MatchWhenAuthorized pattern='/agendas/:agendaId' component={AgendaPage}/>
          <MatchWhenAuthorized adminOnly pattern='/members' component={MembersPage}/>
        </View>
        <View style={styles.footer}>
          <View style={styles.timer}>
            <Timer
              getTime={now}
              startTime={timebox.startTime}
              duration={timebox.duration}
            />
          </View>
          <View
            style={styles.logo}
            accessibilityRole='banner'
          >
            <JSLogo size={300}/>
            <Text style={styles.siteName}>
              TC39 Timebox
            </Text>
          </View>
        </View>
      </View>
    );
  }

  static styles = StyleSheet.create({
    loading: {
      flexGrow: 1,
      backgroundColor: '#f7df1e',
    },
    container: {
      flexGrow: 1,
      justifyContent: 'space-between',
      backgroundColor: '#f7df1e',
      padding: '1.5rem',
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
    },
    logo: {
      marginRight: '-1.5rem'
    },
    siteName: {
      alignSelf: 'flex-end',
      marginRight: '1.5rem',
      textTransform: 'uppercase',
      fontSize: '1.5rem',
      letterSpacing: '0.08em',
    },
    timer: {
      marginBottom: '2rem',
    },
  });
}
