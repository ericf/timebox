import {Component, Children, PropTypes} from 'react';
import database from 'firebase/database';

export default class Provider extends Component {
  static propTypes = {
    app: PropTypes.object.isRequired,
  };

  static childContextTypes = {
    app         : PropTypes.object.isRequired,
    now         : PropTypes.func.isRequired,
    isAuthorized: PropTypes.bool.isRequired,
    isAdmin     : PropTypes.bool.isRequired,
    user        : PropTypes.object,
  };

  unsubscribeAuthListener = null;

  state = {
    timeDrift   : 0,
    isAuthorized: false,
    isAdmin     : false,
    user        : null,
  };

  async computeTimeDrift(user) {
    const db = this.props.app.database();
    const serverTimePath = `users/${user.uid}/serverTime`;

    await db.ref(serverTimePath).set(database.ServerValue.TIMESTAMP);

    const userTime = Date.now();
    const serverTime = (await db.ref(serverTimePath).once('value')).val();
    return serverTime - userTime;
  }

  async isUserAuthorized(user) {
    if (user.isAnonymous) {
      return false;
    }

    const db = this.props.app.database();
    const {uid} = user.providerData[0];
    const members = (await db.ref('members').once('value')).val();
    return !!members[uid];
  }

  async isUserAdmin(user) {
    if (user.isAnonymous) {
      return false;
    }

    const db = this.props.app.database();
    const {uid} = user.providerData[0];
    const adminId = (await db.ref('admin').once('value')).val();
    return uid === adminId;
  }

  subscribeAuthStateChanged() {
    const auth = this.props.app.auth();

    return auth.onAuthStateChanged(async (user) => {
      if (!user) {
        return auth.signInAnonymously();
      }

      const [timeDrift, isAuthorized, isAdmin] = await Promise.all([
        this.computeTimeDrift(user),
        this.isUserAuthorized(user),
        this.isUserAdmin(user),
      ]);

      this.setState({timeDrift, isAuthorized, isAdmin, user});
    });
  }

  componentDidMount() {
    this.unsubscribeAuthListener = this.subscribeAuthStateChanged();
  }

  componentWillUnmount() {
    this.unsubscribeAuthListener();
  }

  getChildContext() {
    const {app} = this.props;
    const {timeDrift, isAuthorized, isAdmin, user} = this.state;
    const now = () => Date.now() + timeDrift;

    return {app, now, isAuthorized, isAdmin, user};
  }

  render() {
    return Children.only(this.props.children);
  }
};
