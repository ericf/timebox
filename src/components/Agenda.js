import React, {PureComponent, PropTypes} from 'react';
import {View, Text, TouchableHighlight, StyleSheet} from 'react-native';
import {compileAgendaContent} from '../agendas';
import Button from './Button';
import MarkdownContent from './MarkdownContent';
import Refresh from './Refresh';

class TimeboxedItem extends PureComponent {
  static propTypes = {
    item: PropTypes.shape({
      duration: PropTypes.number.isRequired,
      isComplete: PropTypes.bool.isRequired,
      label: PropTypes.string.isRequired,
    }).isRequired,

    links: PropTypes.object.isRequired,
    onSelect: PropTypes.func,
  };

  onPress = (e) => {
    if (e.target.matches('a, a *')) {
      return;
    }

    this.props.onSelect(this.props.item);
  };

  render() {
    const {styles} = TimeboxedItem;
    const {item: {duration, label}, links, onSelect} = this.props;
    const durationMinutes = duration / (1000 * 60);

    const itemEl = (
      <View style={styles.container}>
        <Text style={styles.label}>
          <MarkdownContent
            style={styles.labelMarkdown}
            content={label}
            links={links}
          />
        </Text>
        <Text
          style={styles.duration}
          selectable={false}
          accessibilityLabel={`${durationMinutes} minutes`}
        >
          {durationMinutes}m
        </Text>
      </View>
    );

    if (onSelect) {
      return (
        <TouchableHighlight
          style={styles.highlight}
          underlayColor='rgba(0, 0, 0, 0.15)'
          onPress={this.onPress}
        >
          {itemEl}
        </TouchableHighlight>
      );
    }

    return itemEl;
  }

  static styles = StyleSheet.create({
    highlight: {
      paddingHorizontal: '0.5rem',
      marginHorizontal: '-0.5rem',
    },
    container: {
      flexDirection: 'row',
      marginVertical: '0.25rem',
    },
    label: {
      order: 2,
      lineHeight: '1.5',
    },
    labelMarkdown: {
      marginVertical: 0,
    },
    duration: {
      order: 1,
      lineHeight: '1.5',
      marginRight: '0.5rem',
      color: 'rgba(0, 0, 0, 0.6)',
    }
  });
}

class TimeboxedList extends PureComponent {
  static propTypes = {
    items: PropTypes.array.isRequired,
    label: PropTypes.string.isRequired,
    links: PropTypes.object.isRequired,
    onItemSelect: PropTypes.func,
  };

  render() {
    const {styles} = TimeboxedList;
    const {items, label, links, onItemSelect} = this.props;

    if (items.length === 0) {
      return null;
    }

    return (
      <View>
        <Text style={styles.heading}>
          <MarkdownContent
            style={styles.headingMarkdown}
            content={label}
            links={links}
          />
        </Text>
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
      fontSize: '1.5rem',
      marginTop: '0.5rem',
      marginBottom: '0.5rem',
    },
    headingMarkdown: {
      marginVertical: 0,
    },
    list: {
      marginBottom: '1rem',
    },
    listItem: {},
  });
}

export default class Agenda extends PureComponent {
  static propTypes = {
    agenda: PropTypes.shape({
      id: PropTypes.string.isRequired,
      year: PropTypes.number.isRequired,
      month: PropTypes.number.isRequired,
      html_url: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      sha: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
    }).isRequired,

    onItemSelect: PropTypes.func,
    onAgendaSelect: PropTypes.func,
    onAgendaRefresh: PropTypes.func,
  };

  static df = new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'long',
  });

  onAgendaSelectPress = (e) => {
    e.preventDefault();
    this.props.onAgendaSelect(this.props.agenda);
  };

  onAgendaRefreshPress = (e) => {
    e.preventDefault();
    this.props.onAgendaRefresh(this.props.agenda);
  };

  render() {
    const {styles, df} = Agenda;
    const {
      agenda: {year, month, content},
      onItemSelect,
      onAgendaSelect,
      onAgendaRefresh,
    } = this.props;

    const {timeboxed, links} = compileAgendaContent(content);

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text
            style={styles.heading}
            accessibilityRole='heading'
          >
            {df.format(new Date(year, month - 1))} Agenda
          </Text>
          {onAgendaRefresh ? (
            <Refresh onPress={this.onAgendaRefreshPress}/>
          ) : (
            null
          )}
          {onAgendaSelect ? (
            <Text style={styles.agendaControl}>
              <Button
                label='Set as Agenda'
                onPress={this.onAgendaSelectPress}
              />
            </Text>
          ) : (
            null
          )}
        </View>
        {timeboxed.length > 0 ? (
          timeboxed.map((timeboxedList, i) => (
            <TimeboxedList
              {...timeboxedList}
              key={i}
              links={links}
              onItemSelect={onItemSelect}
            />
          ))
        ) : (
          <Text style={styles.noTimeboxed}>
            No timeboxed agenda items.
          </Text>
        )}
      </View>
    );
  }

  static styles = StyleSheet.create({
    container: {},
    header: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      marginTop: '0.25rem',
      marginBottom: '1rem',
    },
    heading: {
      fontSize: '2rem',
      marginRight: '1rem',
    },
    agendaControl: {
      fontSize: '1rem',
    },
    noTimeboxed: {
      fontStyle: 'italic',
    },
  });
}
