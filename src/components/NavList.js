import React, {PureComponent, PropTypes} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Link} from 'react-router';

export default class NavList extends PureComponent {
  static propTypes = {
    items: PropTypes.arrayOf(
      PropTypes.shape({
        location: PropTypes.string.isRequired,
        label: PropTypes.node.isRequired,
      })
    ).isRequired,
  };

  render() {
    const {styles} = NavList;

    return (
      <View
        style={styles.list}
        accessibilityRole='list'
      >
        {this.props.items.map(({location, label}, i) => (
          <View
            key={i}
            style={styles.listItem}
            accessibilityRole='listitem'
          >
            <TouchableOpacity>
              <Link
                to={location}
                activeOnlyWhenExact
              >
                {({isActive, onClick}) => (
                  <View
                    style={styles.label}
                    onClick={onClick}
                  >
                    <Text style={styles.labelText}>
                      {label}
                    </Text>
                    <View style={[
                      styles.labelUnderline,
                      isActive && {backgroundColor: '#000'},
                    ]}/>
                  </View>
                )}
              </Link>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  }

  static styles = StyleSheet.create({
    list: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: '-0.75rem',
    },
    listItem: {
      marginHorizontal: '0.25rem',
    },
    label: {
      cursor: 'pointer',
      paddingVertical: '0.25rem',
      paddingHorizontal: '0.5rem',
    },
    labelText: {
      color: '#000',
      fontSize: '1.25rem',
      letterSpacing: '0.075em',
      textTransform: 'uppercase',
    },
    labelUnderline: {
      marginTop: '0.25rem',
      height: 1,
    },
  });
}
