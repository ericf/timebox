import React, {PureComponent, PropTypes} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';

const icon = (
  <svg
    viewBox='0 0 100 125'
    width='100%'
    height='100%'
  >
    <path d='M77.999,56.801c0,15.904-12.896,28.8-28.8,28.8s-28.8-12.896-28.8-28.8c0-15.883,12.86-28.765,28.743-28.796v15.198   l21.6-21.604L49.143,0v13.605C25.314,13.637,6,32.962,6,56.801C6,80.657,25.343,100,49.199,100s43.199-19.343,43.199-43.199H77.999   z'/>
  </svg>
);

export default class Refresh extends PureComponent {
  static propTypes = {
    size: PropTypes.number.isRequired,
    onPress: PropTypes.func.isRequired,
  };

  static defaultProps = {
    size: 32,
  };

  render() {
    const {styles} = Refresh;
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
