import React, {PureComponent, PropTypes} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import MarkdownContent from './MarkdownContent';

export default class Timer extends PureComponent {
  static propTypes = {
    label    : PropTypes.string.isRequired,
    links    : PropTypes.object.isRequired,
    startTime: PropTypes.number.isRequired,
    duration : PropTypes.number.isRequired,
    getTime  : PropTypes.func.isRequired,
    showLabel: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    label: '',
    links: {},
    startTime: 0,
    duration: 0,
    showLabel: false,
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
    const {label, links, startTime, duration, showLabel} = this.props;
    const {now} = this.state;

    const endTime = startTime + duration;
    const remaining = Math.max(endTime - now, 0) / 1000;
    const minutes = Math.floor(remaining / 60);
    const seconds = Math.floor(remaining % 60);

    return (
      <View
        style={[(!showLabel || !label) && styles.noLabel]}
        accessibilityRole='timer'
      >
        <Text style={styles.timer}>
          {nf.format(minutes)}:{nf.format(seconds)}
        </Text>
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
    );
  }

  static styles = StyleSheet.create({
    noLabel: {
      marginBottom: '2rem',
    },
    timer: {
      fontSize: '8rem',
      lineHeight: '8rem',
    },
    label: {
      marginTop: '0.25rem',
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
