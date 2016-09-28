import React, {PureComponent, PropTypes} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import MarkdownContent from './MarkdownContent';
import Play from './Play';
import Pause from './Pause';

export default class Timer extends PureComponent {
  static propTypes = {
    label       : PropTypes.string.isRequired,
    links       : PropTypes.object.isRequired,
    startTime   : PropTypes.number.isRequired,
    duration    : PropTypes.number.isRequired,
    pauses      : PropTypes.object.isRequired,
    isPaused    : PropTypes.bool.isRequired,
    getTime     : PropTypes.func.isRequired,
    showLabel   : PropTypes.bool.isRequired,
    showControls: PropTypes.bool.isRequired,
    onPlayPress : PropTypes.func.isRequired,
    onPausePress: PropTypes.func.isRequired,
  };

  static defaultProps = {
    label: '',
    links: {},
    startTime: 0,
    duration: 0,
    pauses: {},
    isPaused: false,
    showLabel: false,
    showControls: false,
  };

  static nf = new Intl.NumberFormat('en', {
    minimumIntegerDigits: 2,
  });

  state = {
    now: this.props.getTime(),
  }

  timer = null;

  onPlayPress = (e) => {
    e.preventDefault();
    this.props.onPlayPress();
  };


  onPausePress = (e) => {
    e.preventDefault();
    this.props.onPausePress();
  };

  getElapsedTime({startTime, pauses, now}) {
    return Object.keys(pauses).reduce((elapsedTime, pauseKey) => {
      const pause = pauses[pauseKey];
      if (pause.pauseTime) {
        return elapsedTime - (now - pause.pauseTime);
      } else {
        return elapsedTime + (now - pause.resumeTime);
      }
    }, now - startTime);
  }

  startTimer(props) {
    const {startTime, duration, pauses, isPaused, getTime} = props;

    this.timer = setInterval(() => {
      if (isPaused) {
        this.stopTimer();
        return;
      }

      const now = getTime();
      const elapsedTime = this.getElapsedTime({startTime, pauses, now});

      if (elapsedTime >= duration) {
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
    const {
      startTime,
      duration,
      pauses,
      label,
      links,
      isPaused,
      showLabel,
      showControls,
    } = this.props;
    const {now} = this.state;

    const elapsedTime = this.getElapsedTime({startTime, pauses, now});
    const remaining = Math.max(duration - elapsedTime, 0) / 1000;
    const minutes = Math.floor(remaining / 60);
    const seconds = Math.floor(remaining % 60);

    return (
      <View accessibilityRole='timer'>
        <Text style={styles.timer}>
          {nf.format(minutes)}:{nf.format(seconds)}
        </Text>
        <View style={[
          styles.info,
          !showLabel && !showControls && styles.noLabelOrControls,
        ]}>
          {showControls ? isPaused ? (
            <Play
              size={28}
              onPress={this.onPlayPress}
            />
          ) : (
            <Pause
              size={28}
              onPress={this.onPausePress}
            />
          ) : null}
          {showLabel && label ? (
            <View style={styles.label}>
              <MarkdownContent
                style={styles.labelMarkdown}
                content={label}
                links={links}
              />
            </View>
          ) : (
            null
          )}
        </View>
      </View>
    );
  }

  static styles = StyleSheet.create({
    noLabelOrControls: {
      marginTop: '2rem',
    },
    timer: {
      fontSize: '8rem',
      lineHeight: '8rem',
    },
    info: {
      flexDirection: 'row',
      marginTop: '0.25rem',
    },
    label: {
      marginLeft: '0.5rem',
      flexShrink: 1,
    },
    labelMarkdown: {
      marginVertical: 0,
      fontSize: '1.5rem',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    }
  });
};
