import React, {Component, PropTypes} from 'react';
import {View, Text} from 'react-native';

export default class TimeboxContainer extends Component {
  static contextTypes = {
    app: PropTypes.object.isRequired,
  };

  state = {
    timebox: null,
  };

  timeboxRef = null;

  componentDidMount() {
    const db = this.context.app.database();
    this.timeboxRef = db.ref('timebox');
    this.timeboxRef.on('value', (snapshot) => {
      this.setState({timebox: snapshot.val()});
    });
  }

  componentWillUnmount() {
    this.timeboxRef.off();
  }

  render() {
    const {timebox} = this.state;
    if (!timebox) {
      return null;
    }

    return (
      <View>
        <View>
          <Text>{timebox.label}</Text>
        </View>
        <View>
          <Text>
            {timebox.duration / (1000 * 60)} minutes
          </Text>
        </View>
      </View>
    );
  }
};
