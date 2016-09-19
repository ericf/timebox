import React, {Component, PureComponent, PropTypes} from 'react';
import {getAgendas} from '../github';
import {createAgenda} from '../agendas';

class Agendas extends PureComponent {
  static propTypes = {
    agendas: PropTypes.array.isRequired,
  }

  static df = new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'long',
  });

  render() {
    return (
      <div>
        <ul>
          {this.props.agendas.map(({id, year, month}) => (
            <li key={id}>
              {Agendas.df.format(new Date(year, month - 1))}
            </li>
          ))}
        </ul>
        {this.props.children}
      </div>
    );
  }
}

export default class AgendasContainer extends Component {
  static contextTypes = {
    app        : PropTypes.object.isRequired,
    accessToken: PropTypes.string.isRequired,
  }

  static propTypes = {
    numLatest: PropTypes.number.isRequired,
  };

  static defaultProps = {
    numLatest: 2,
  };

  state = {
    agendas: null,
  };

  async updateAgendas(numLatest) {
    const {accessToken} = this.context;
    const allAgendas = (await getAgendas({accessToken})).map(createAgenda);
    const agendas = allAgendas.reverse().slice(0, numLatest);
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
      <Agendas agendas={agendas}>
        {this.props.children}
      </Agendas>
    );
  }
}
