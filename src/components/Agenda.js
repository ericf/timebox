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
  static contextTypes = {
    accessToken: PropTypes.string.isRequired,
  };

  static propTypes = {
    id: PropTypes.string.isRequired,
  };

  state = {
    agendaContent: null,
  };

  async updateAgendaContent(id) {
    const {accessToken} = this.context;
    const agenda = (await getAgendaContents(id, {accessToken}));
    const agendaContent = compileAgendaContent(agenda.content);
    this.setState({agenda, agendaContent});
  }

  componentDidMount() {
    this.updateAgendaContent(this.props.id.replace('-', '/'));
  }

  componentWillReceiveProps({id: nextId}) {
    if (nextId !== this.props.id) {
      this.updateAgendaContent(nextId.replace('-', '/'));
    }
  }

  render() {
    const {agenda, agendaContent} = this.state;
    if (!(agenda && agendaContent)) {
      return null;
    }

    return (
      <Agenda
        agenda={agenda}
        agendaContent={agendaContent}
      />
    );
  }
};
