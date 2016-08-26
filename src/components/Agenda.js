import React, {Component, PureComponent, PropTypes} from 'react';
import MarkdownContent from './MarkdownContent';
import {getAgendaContents} from '../github';
import {compileAgendaContent} from '../agendas';

class TimeboxedList extends PureComponent {
  static propTypes = {
    items: PropTypes.array.isRequired,
    label: PropTypes.string.isRequired,
    links: PropTypes.object.isRequired,
  };

  render() {
    return (
      <div>
        <h3>
          <MarkdownContent
            content={this.props.label}
            links={this.props.links}
          />
        </h3>
        <ul>
          {this.props.items.map((item, i) => (
            <li key={i}>
              <MarkdownContent
                content={item.label}
                links={this.props.links}
              />
            </li>
          ))}
        </ul>
      </div>
    );
  }
};

class Agenda extends PureComponent {
  static propTypes = {
    agenda       : PropTypes.object.isRequired,
    agendaContent: PropTypes.object.isRequired,
  };

  render() {
    const {agenda, agendaContent} = this.props;

    return (
      <div>
        <p>{agenda.id}</p>
        {agendaContent.timeboxed.map((timeboxed, i) => (
          <TimeboxedList
            {...timeboxed}
            key={i}
            links={agendaContent.links}
          />
        ))}
      </div>
    );
  }
};

export default class AgendaContainer extends Component {
  static propTypes = {
    agenda: Agenda.propTypes.agenda,
  };

  static contextTypes = {
    accessToken: PropTypes.string.isRequired,
  };

  state = {
    agendaContent: null,
  };

  async updateAgendaContent(agenda) {
    const {accessToken} = this.context;
    const rawAgendaContent = (await getAgendaContents(agenda, {accessToken})).content;
    const agendaContent = compileAgendaContent(rawAgendaContent);
    this.setState({agendaContent});
  }

  componentDidMount() {
    this.updateAgendaContent(this.props.agenda);
  }

  componentWillReceiveProps({agenda: nextAgenda}) {
    if (nextAgenda !== this.props.agenda) {
      this.updateAgendaContent(nextAgenda);
    }
  }

  render() {
    const {agendaContent} = this.state;
    if (!agendaContent) {
      return null;
    }

    return (
      <Agenda
        agenda={this.props.agenda}
        agendaContent={agendaContent}
      />
    );
  }
};
