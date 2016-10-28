import React, {Component, PropTypes} from 'react';
import {Link, Match, Miss} from 'react-router';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import database from 'firebase/database';
import {GithubAuthProvider} from 'firebase/auth';
import MatchWhenAuthorized from '../components/MatchWhenAuthorized';
import JSLogo from '../components/JSLogo';
import NavList from '../components/NavList';
import Auth from '../components/Auth';
import Timer from '../components/Timer';
import TimeboxPage from './TimeboxPage';
import CurrentAgendaPage from './CurrentAgendaPage';
import AgendasPage from './AgendasPage';
import AgendaPage from './AgendaPage';
import MembersPage from './MembersPage';

export default class App extends Component {
  static contextTypes = {
    app: PropTypes.object.isRequired,
    now: PropTypes.func.isRequired,
    isAuthorized: PropTypes.bool.isRequired,
    user: PropTypes.object,
  };

  state = {
    timebox: undefined,
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

  onTimerPlayPress = async () => {
    const db = this.context.app.database();
    const timeboxRef = db.ref('timebox');
    const resumeKey = timeboxRef.child('pauses').push().key;

    return timeboxRef.transaction((timebox) => {
      if (timebox.isPaused) {
        return {
          ...timebox,
          isPaused: false,
          pauses: {
            ...timebox.pauses,
            [resumeKey]: {
              resumeTime: database.ServerValue.TIMESTAMP,
            },
          },
        };
      }
    });
  };

  onTimerPausePress = async () => {
    const db = this.context.app.database();
    const timeboxRef = db.ref('timebox');
    const pauseKey = timeboxRef.child('pauses').push().key;

    return timeboxRef.transaction((timebox) => {
      if (!timebox.isPaused) {
        return {
          ...timebox,
          isPaused: true,
          pauses: {
            ...timebox.pauses,
            [pauseKey]: {
              pauseTime: database.ServerValue.TIMESTAMP,
            },
          },
        };
      }
    });
  };

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
    const {user, isAuthorized, now} = this.context;
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
        <View
          style={styles.nav}
          accessibilityRole='navigation'
        >
          <NavList
            items={[
              {location: '/', label: 'Timebox'},
              {location: '/agenda', label: 'Agenda'},
            ]}
          />
          <Auth
            user={user}
            onSignIn={this.signIn}
            onSignOut={this.signOut}
          />
        </View>
        <View
          style={styles.main}
          accessibilityRole='main'
        >
          <Match exactly pattern='/' component={TimeboxPage}/>
          <Match exactly pattern='/agenda' component={CurrentAgendaPage}/>
          <MatchWhenAuthorized exactly pattern='/agendas/' component={AgendasPage}/>
          <MatchWhenAuthorized exactly pattern='/agendas/:agendaId' component={AgendaPage}/>
          <MatchWhenAuthorized adminOnly exactly pattern='/members' component={MembersPage}/>
          <Miss render={({location}) => (
            <Text style={styles.notFound}>
              Page not found. (<Link to='/'>Return Home</Link>)
            </Text>
          )}/>
        </View>
        <View style={styles.statusTray}>
          <View
            style={styles.timer}
            accessibilityRole='status'
          >
            <Timer
              {...timebox}
              getTime={now}
              onPlayPress={this.onTimerPlayPress}
              onPausePress={this.onTimerPausePress}
              showControls={isAuthorized}
              showLabel
            />
          </View>
          <TouchableOpacity
            style={styles.logo}
            accessibilityRole='banner'
          >
            <Link to='/'>
              {({href, onClick}) => (
                <View
                  accessibilityRole='link'
                  href={href}
                  onClick={onClick}
                >
                  <JSLogo size={200}/>
                  <Text style={styles.siteName}>
                    TC39 Timebox
                  </Text>
                </View>
              )}
            </Link>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  static styles = StyleSheet.create({
    loading: {
      flexGrow: 1,
    },
    container: {
      flexGrow: 1,
      justifyContent: 'space-between',
      padding: '1.5rem',
    },
    nav: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: '3rem',
    },
    main: {
      flexGrow: 1,
      justifyContent: 'center',
      paddingBottom: '14.875rem',
    },
    statusTray: {
      position: 'fixed',
      bottom: 0,
      width: '100%',
      padding: '1.5rem',
      marginLeft: '-1.5rem',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      backgroundColor: '#f7df1e',
      boxShadow: '0 0 0.5rem rgba(0, 0, 0, 0.2)',
    },
    logo: {
      marginLeft: '3rem',
    },
    siteName: {
      alignSelf: 'flex-end',
      marginTop: '1.25rem',
      marginRight: '0.25rem',
      textTransform: 'uppercase',
      fontSize: '1.5rem',
      letterSpacing: '0.09em',
    },
    timer: {
      flexShrink: 1,
    },
    notFound: {
      fontStyle: 'italic',
    },
  });
}
