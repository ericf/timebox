import React, {PureComponent, PropTypes} from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default class Timer extends PureComponent {
  static propTypes = {
    getTime  : PropTypes.func.isRequired,
    startTime: PropTypes.number.isRequired,
    duration : PropTypes.number.isRequired,
  };

  static nf = new Intl.NumberFormat('en', {
    minimumIntegerDigits: 2,
  });

  state = {
    now: this.props.getTime(),
  }

  timer = null;

  startTimer({startTime, duration, getTime}) {
    const endTime = startTime + duration;

    this.timer = setInterval(() => {
      let now = getTime();
      if (now >= endTime) {
        now = endTime;
        this.stopTimer();
      }

      this.setState({now});
    }, 100);
  }

  stopTimer() {
    clearInterval(this.timer);
  }

  componentDidMount() {
    this.startTimer(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.stopTimer();
    this.setState({now: nextProps.getTime()});
    this.startTimer(nextProps);
  }

  componentWillUnmount() {
    this.stopTimer();
  }

  render() {
    const {styles, nf} = Timer;
    const {startTime, duration} = this.props;
    const {now} = this.state;

    const endTime = startTime + duration;
    const remaining = Math.max(endTime - now, 0) / 1000;
    const minutes = Math.floor(remaining / 60);
    const seconds = Math.floor(remaining % 60);

    return (
      <View style={styles.container}>
        <Text style={styles.timer}>
          {nf.format(minutes)}:{nf.format(seconds)}
        </Text>
      </View>
    );
  }

  static styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
    },
    timer: {
      fontSize: '8rem',
      lineHeight: '8rem',
    },
  });
};
