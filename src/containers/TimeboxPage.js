import React, {Component, PropTypes} from 'react';
import {View, Text, ActivityIndicator, StyleSheet} from 'react-native';
import {Link} from 'react-router';
import MarkdownContent from '../components/MarkdownContent';

export default class TimeboxPage extends Component {
  static contextTypes = {
    app: PropTypes.object.isRequired,
    isAuthorized: PropTypes.bool.isRequired,
  };

  state = {
    timebox: undefined,
    isLoading: false,
  };

  detachTimeboxListener = null;

  componentDidMount() {
    setTimeout(() => {
      this.setState(({timebox}) => ({
        isLoading: timebox === undefined,
      }));
    }, 200);

    const db = this.context.app.database();
    const ref = db.ref('timebox');
    const listener = ref.on('value', (snapshot) => {
      this.setState({
        timebox: snapshot.val(),
        isLoading: false,
      });
    });

    this.detachTimeboxListener = () => ref.off('value', listener);
  }

  componentWillUnmount() {
    this.detachTimeboxListener();
  }

  render() {
    const {styles} = TimeboxPage;
    const {isAuthorized} = this.context;
    const {timebox, isLoading} = this.state;

    if (isLoading) {
      return (
        <ActivityIndicator color='black'/>
      );
    }

    if (!timebox) {
      return (
        <Text style={styles.noTimeboxedItem}>
          There's no agenda item in the timebox.{' '}
          (<Link to='/agenda'>View Agenda</Link>)
        </Text>
      );
    }

    const durationMinutes = timebox.duration / (1000 * 60);

    return (
      <View style={styles.container}>
        <Text
          style={styles.heading}
          accessibilityRole='heading'
        >
          Current Timeboxed Agenda Item:{' '}
          {isAuthorized ? ['(', <Link to='/agenda' key={0}>Change</Link>, ')'] : null}
        </Text>
        <View style={styles.timebox}>
          <View style={styles.timeboxLabel}>
            <MarkdownContent
              style={styles.timeboxLabelMarkdown}
              content={timebox.label}
              links={timebox.links}
            />
          </View>
          <Text
            style={styles.timeboxDuration}
            selectable={false}
            accessibilityLabel={`${durationMinutes} minutes`}
          >
            {durationMinutes}m
          </Text>
        </View>
      </View>
    );
  }

  static styles = StyleSheet.create({
    container: {},
    heading: {
      color: 'rgba(0, 0, 0, 0.6)',
    },
    noTimeboxedItem: {
      fontStyle: 'italic',
    },
    timebox: {
      flexDirection: 'row',
    },
    timeboxLabel: {
      order: 2,
      flexShrink: 1,
    },
    timeboxLabelMarkdown: {
      marginVertical: 0,
      fontSize: '3rem',
    },
    timeboxDuration: {
      order: 1,
      fontSize: '3rem',
      marginRight: '1rem',
      color: 'rgba(0, 0, 0, 0.6)',
    },
  });
}
