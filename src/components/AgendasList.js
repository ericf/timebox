import React, {Component, PropTypes} from 'react';
import {getAgendas} from '../github';
import {createAgenda} from '../agendas';

class AgendasListItem extends Component {
  static df = new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'long',
  });

  onClick = (e) => {
    e.preventDefault();
    this.props.onSelect(this.props.agenda);
  };

  render() {
    const {year, month} = this.props.agenda;

    return (
      <a href="#" onClick={this.onClick}>
        {AgendasListItem.df.format(new Date(year, month - 1))}
      </a>
    );
  }
};

class AgendasList extends Component {
  static propTypes = {
    agendas       : PropTypes.array.isRequired,
    onAgendaSelect: PropTypes.func.isRequired,
  };

  render() {
    return (
      <ul>
        {[...this.props.agendas].reverse().map((agenda) => (
          <li key={agenda.id}>
            <AgendasListItem
              agenda={agenda}
              onSelect={this.props.onAgendaSelect}
            />
          </li>
        ))}
      </ul>
    );
  }
};

export default class AgendasListContainer extends Component {
  static propTypes = {
    onAgendaSelect: AgendasList.propTypes.onAgendaSelect,
  };

  state = {
    agendas: null,
  };

  async componentDidMount() {
    let agendas = (await getAgendas()).map(createAgenda);
    this.setState({agendas});
  }

  render() {
    const {agendas} = this.state;
    if (!agendas) {
      return null;
    }

    return (
      <AgendasList
        agendas={agendas}
        onAgendaSelect={this.props.onAgendaSelect}
      />
    );
  }
};
