import React, {Component, PureComponent, PropTypes} from 'react';
import {getAgendas} from '../github';
import {createAgenda} from '../agendas';

class AgendasListItem extends PureComponent {
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

class AgendasList extends PureComponent {
  static propTypes = {
    agendas       : PropTypes.array.isRequired,
    onAgendaSelect: PropTypes.func.isRequired,
  };

  render() {
    return (
      <ul>
        {this.props.agendas.map((agenda) => (
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
    numLatest     : PropTypes.number.isRequired,
    onAgendaSelect: AgendasList.propTypes.onAgendaSelect,
  };

  static contextTypes = {
    accessToken: PropTypes.string.isRequired,
  }

  static defaultProps = {
    numLatest: 2,
  };

  state = {
    agendas: null,
  };

  async updateAgendas(numLatest) {
    const {accessToken} = this.context;
    const allAgendas = (await getAgendas({accessToken})).map(createAgenda).reverse();
    const agendas = allAgendas.slice(0, numLatest);
    this.setState({agendas});
  }

  async componentDidMount() {
    this.updateAgendas(this.props.numLatest);
  }

  componentWillReceiveProps({numLatest: nextNumLatest}) {
    if (nextNumLatest !== this.props.numLatest) {
      this.updateAgendas(nextNumLatest);
    }
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