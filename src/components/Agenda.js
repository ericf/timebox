import React, {PureComponent, PropTypes} from 'react';
import {View, Text, TouchableHighlight, StyleSheet} from 'react-native';
import {compileAgendaContent} from '../agendas';
import MarkdownContent from './MarkdownContent';

class TimeboxedItem extends PureComponent {
  static propTypes = {
    item: PropTypes.shape({
      duration: PropTypes.number.isRequired,
      isComplete: PropTypes.bool.isRequired,
      label: PropTypes.string.isRequired,
    }).isRequired,

    links: PropTypes.object.isRequired,
    onSelect: PropTypes.func.isRequired,
  };

  onPress = (e) => {
    if (e.target.matches('a, a *')) {
      return;
    }

    this.props.onSelect(this.props.item);
  };

  render() {
    const {styles} = TimeboxedItem;
    const {item: {duration, label}, links} = this.props;
    const durationMinutes = duration / (1000 * 60);

    return (
      <TouchableHighlight
        onPress={this.onPress}
      >
        <View style={styles.container}>
          <View style={styles.label}>
            <MarkdownContent
              style={styles.labelMarkdown}
              content={label}
              links={links}
            />
          </View>
          <Text
            style={styles.duration}
            selectable={false}
            accessibilityLabel={`${durationMinutes} minutes`}
          >
            {durationMinutes}m
          </Text>
        </View>
      </TouchableHighlight>
    );
  }

  static styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
    },
    label: {
      order: 2,
    },
    labelMarkdown: {
      marginVertical: 0,
    },
    duration: {
      order: 1,
      marginRight: '0.5rem',
    }
  });
}

class TimeboxedList extends PureComponent {
  static propTypes = {
    items: PropTypes.array.isRequired,
    label: PropTypes.string.isRequired,
    links: PropTypes.object.isRequired,
    onItemSelect: PropTypes.func.isRequired,
  };

  render() {
    const {styles} = TimeboxedList;
    const {items, label, links, onItemSelect} = this.props;

    return (
      <View>
        <View
          style={styles.heading}
          accessibilityRole='heading'
        >
          <MarkdownContent
            style={styles.headingMarkdown}
            content={label}
            links={links}
          />
        </View>
        <View
          style={styles.list}
          accessibilityRole='list'
        >
          {items.map((item, i) => (
            <View
              key={i}
              style={styles.listItem}
              accessibilityRole='listitem'
            >
              <TimeboxedItem
                item={item}
                links={links}
                onSelect={onItemSelect}
              />
            </View>
          ))}
        </View>
      </View>
    );
  }

  static styles = StyleSheet.create({
    heading: {
      flexDirection: 'row',
    },
    headingMarkdown: {
      marginVertical: 0,
    },
    list: {},
    listItem: {},
  });
}

export default class Agenda extends PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    year: PropTypes.number.isRequired,
    month: PropTypes.number.isRequired,
    html_url: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    sha: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    onItemSelect: PropTypes.func.isRequired,
  };

  static df = new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'long',
  });

  render() {
    const {styles, df} = Agenda;
    const {year, month, content, onItemSelect} = this.props;
    const {timeboxed, links} = compileAgendaContent(content);

    return (
      <View style={styles.container}>
        <Text accessibilityRole='heading'>
          {df.format(new Date(year, month - 1))} Agenda:
        </Text>
        {timeboxed.map((timeboxedList, i) => (
          <TimeboxedList
            {...timeboxedList}
            key={i}
            links={links}
            onItemSelect={onItemSelect}
          />
        ))}
      </View>
    );
  }

  static styles = StyleSheet.create({
    container: {},
  });
}
