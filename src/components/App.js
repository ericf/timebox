import React, {Component, PropTypes} from 'react';
import {View, Text, ActivityIndicator, StyleSheet} from 'react-native';
import {GithubAuthProvider} from 'firebase/auth';
import Auth from './Auth';
import JSLogo from './JSLogo';
import Timer from './Timer';

export default class App extends Component {
  static contextTypes = {
    app : PropTypes.object.isRequired,
    now : PropTypes.func.isRequired,
    user: PropTypes.object,
  };

  state = {
    timeboxed: {
      startTime: 0,
      duration : 0,
    },
  };

  timeboxedRef = null;

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
    this.timeboxedRef = db.ref('timeboxed');
    this.timeboxedRef.on('value', (snapshot) => {
      this.setState({timeboxed: snapshot.val()});
    });
  }

  componentWillUnmount() {
    this.timeboxedRef.off();
  }

  render() {
    const {styles} = App;
    const {user, now} = this.context;
    const {timeboxed} = this.state;

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
      <View style={styles.container}>
        <Auth
          user={user}
          onSignIn={this.signIn}
          onSignOut={this.signOut}
        />
        {this.props.children}
        <View style={styles.footer}>
          <View style={styles.timer}>
            <Timer
              getTime={now}
              startTime={timeboxed.startTime}
              duration={timeboxed.duration}
            />
          </View>
          <View style={styles.logo}>
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
