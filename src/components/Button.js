import React, {PureComponent, PropTypes} from 'react';
import {Text, TouchableHighlight, StyleSheet} from 'react-native';

export default class Button extends PureComponent {
  static propTypes = {
    label  : PropTypes.node.isRequired,
    onPress: PropTypes.func.isRequired,
  };

  render() {
    return (
      <TouchableHighlight
        accessibilityRole='button'
        onPress={this.props.onPress}
        underlayColor='#d9d9d9'
        style={Button.styles.base}
      >
        <Text
          style={Button.styles.label}
          selectable={false}
        >
          {this.props.label}
        </Text>
      </TouchableHighlight>
    );
  }

  static styles = StyleSheet.create({
    base: {
      cursor: 'pointer',
      paddingHorizontal: '0.8rem',
      paddingVertical: '0.4rem',
      backgroundColor: '#e6e6e6',
      borderWidth: 1,
      borderColor: 'rgba(0, 0, 0, 0.2)',
      borderRadius: 3,
    },
    label: {
      whiteSpace: 'nowrap',
      color: 'rgba(0, 0, 0, 0.8)',
    }
  });
};
