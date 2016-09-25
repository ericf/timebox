import React, {Component, PropTypes} from 'react';
import {Link, Match, Miss} from 'react-router';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {GithubAuthProvider} from 'firebase/auth';
import MatchWhenAuthorized from '../components/MatchWhenAuthorized';
import JSLogo from '../components/JSLogo';
import Auth from '../components/Auth';
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
        <View
          style={styles.main}
          accessibilityRole='main'
        >
          <Match exactly pattern='/' component={TimeboxPage}/>
          <Match exactly pattern='/agenda' component={CurrentAgendaPage}/>
          <MatchWhenAuthorized pattern='/agendas/' component={AgendasPage}/>
          <MatchWhenAuthorized pattern='/agendas/:agendaId' component={AgendaPage}/>
          <MatchWhenAuthorized adminOnly pattern='/members' component={MembersPage}/>
        </View>
        <View style={styles.statusTray}>
          <Match pattern='*' render={() => (
            <View style={styles.timer}>
              <Match exactly pattern='/' render={() => (
                <Timer
                  {...timebox}
                  getTime={now}
                />
              )}/>
              <Miss render={() => (
                <Timer
                  {...timebox}
                  getTime={now}
                  showLabel
                />
              )}/>
            </View>
          )}/>
          <View
            style={styles.logo}
            accessibilityRole='banner'
          >
            <Link to='/'>
              {({onClick}) => (
                <TouchableOpacity style={styles.logo}>
                  <View onClick={onClick}>
                    <JSLogo size={200}/>
                    <Text style={styles.siteName}>
                      TC39 Timebox
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            </Link>
          </View>
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
      marginLeft: '1.5rem',
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
  });
}
