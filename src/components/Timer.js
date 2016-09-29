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
    if (!startTime) {
      return 0;
    }

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
    const {isPaused, startTime, getTime} = props;

    this.timer = setInterval(() => {
      if (!startTime || isPaused) {
        this.stopTimer();
        return;
      }

      const now = getTime();
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
    const remaining = (duration - elapsedTime) / 1000;
    const minutes = Math.floor(Math.abs(remaining) / 60);
    const seconds = Math.floor(Math.abs(remaining) % 60);
    const isOvertime = remaining < 0;

    return (
      <View accessibilityRole='timer'>
        {isOvertime ? (
          <Text style={styles.overtime}>
            Overtime
          </Text>
        ) : (
          null
        )}
        <Text style={[
          styles.timer,
          isOvertime && styles.timerOvertime
        ]}>
          {nf.format(minutes)}:{nf.format(seconds)}
        </Text>
        <View style={[
          styles.info,
          ((!showLabel && !showControls) || !startTime) && styles.noLabelOrControls,
        ]}>
          {(showControls && startTime) ? isPaused ? (
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
      marginLeft: '-0.25rem',
    },
    timerOvertime: {
      color: '#AA0C58',
    },
    overtime: {
      fontSize: '1.25rem',
      letterSpacing: '0.075em',
      textTransform: 'uppercase',
      color: '#AA0C58',
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
