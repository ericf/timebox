import React, {PureComponent, PropTypes} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';

const icon = (
  <svg
    viewBox='0 0 320 384'
    width='100%'
    height='100%'
  >
    <path d='M309.2,168.9 L30.8,3.2 C27.4,1.2 23.9,0 19.9,0 C9,0 0.1,9 0.1,20 L0,20 L0,364 L0.1,364 C0.1,375 9,384 19.9,384 C24,384 27.4,382.6 31.1,380.6 L309.2,215.1 C315.8,209.6 320,201.3 320,192 C320,182.7 315.8,174.5 309.2,168.9 z'/>
  </svg>
);

export default class Play extends PureComponent {
  static propTypes = {
    size: PropTypes.number.isRequired,
    onPress: PropTypes.func.isRequired,
  };

  static defaultProps = {
    size: 32,
  };

  render() {
    const {styles} = Play;
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
