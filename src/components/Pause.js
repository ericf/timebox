import React, {PureComponent, PropTypes} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';

const icon = (
  <svg
    viewBox='0 0 256 384'
    width='100%'
    height='100%'
  >
    <g>
      <path d='M96,371.8 L96,12.1 C96,5.4 90.6,0 83.8,0 L12.2,0 C5.4,0 -0,5.4 -0,12.1 L-0,371.8 C-0,378.5 5.4,384 12.2,384 L83.8,384 C90.6,384 96,378.6 96,371.8 z'/>
      <path d='M243.8,0 L172.2,0 C165.5,0 160,5.4 160,12.1 L160,371.8 C160,378.5 165.4,384 172.2,384 L243.8,384 C250.5,384 256,378.6 256,371.8 L256,12.1 C256,5.4 250.6,0 243.8,0 z'/>
    </g>
  </svg>
);

export default class Pause extends PureComponent {
  static propTypes = {
    size: PropTypes.number.isRequired,
    onPress: PropTypes.func.isRequired,
  };

  static defaultProps = {
    size: 32,
  };

  render() {
    const {styles} = Pause;
    const {size, onPress} = this.props;

    return (
      <TouchableOpacity
        accessibilityRole='button'
        onPress={onPress}
        style={styles.container}
      >
        <View style={[
          styles.icon,
          {width: size, height: size},
        ]}>
          {icon}
        </View>
      </TouchableOpacity>
    );
  }

  static styles = StyleSheet.create({
    container: {},
    icon: {
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
}
