import React, {PureComponent, PropTypes} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Link} from 'react-router';

export default class Agendas extends PureComponent {
  static propTypes = {
    agendas: PropTypes.array.isRequired,
  };

  static df = new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'long',
  });

  render() {
    const {styles, df} = Agendas;
    const {agendas} = this.props;

    return (
      <View style={styles.container}>
        <Text
          style={styles.heading}
          accessibilityRole='heading'
        >
          TC39 Agendas
        </Text>
        <View
          style={styles.list}
          accessibilityRole='list'
        >
          {agendas.map(({id, month, year}, i) => (
            <View
              key={i}
              accessibilityRole='listitem'
            >
              <Text style={styles.agendaLabel}>
                <Link to={`/agendas/${id.replace('/', '-')}`}>
                  {df.format(new Date(year, month - 1))}
                </Link>
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  }

  static styles = StyleSheet.create({
    container: {},
    heading: {
      fontSize: '2rem',
      marginTop: '0.25rem',
      marginBottom: '1rem',
    },
    list: {
      marginBottom: '1rem',
    },
    agendaLabel: {
      lineHeight: '1.5',
    },
  });
};
