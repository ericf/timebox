import React, {Component, PropTypes} from 'react';
import {Text} from 'react-native';
import {Link} from 'react-router';
import {getAgendaContents} from '../github';
import {createAgenda} from '../agendas';

export default class AgendaPage extends Component {
  static contextTypes = {
    app: PropTypes.object.isRequired,
    isAuthorized: PropTypes.bool.isRequired,
    accessToken: PropTypes.string,
  };

  static propTypes = {
    params: PropTypes.shape({
      agendaId: PropTypes.string.isRequired,
    }).isRequired,
  };

  state = {
    agenda: null,
  };

  async updateAgenda(props, context) {
    const {isAuthorized, accessToken} = context;
    const {params: {agendaId}} = props;

    let agenda = null;

    if (isAuthorized && accessToken) {
      let id = agendaId.replace('-', '/');
      let agendaContents;

      try {
        agendaContents = await getAgendaContents(id, {accessToken});
        agenda = createAgenda(agendaContents);
      } catch (e) {}
    }

    this.setState({agenda});
  }

  componentDidMount() {
    this.updateAgenda(this.props, this.context);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.params.agendaId !== this.props.params.agendaId) {
      this.updateAgenda(nextProps, nextContext);
    }
  }

  render() {
    const {isAuthorized} = this.context;
    const {agenda} = this.state;

    if (!isAuthorized) {
      return (
        <Text>Not Authorized</Text>
      );
    }

    if (!agenda) {
      return null;
    }

    return (
      <Text>{agenda.id}<Link to='/agendas/2016-07'>2016-07</Link></Text>
    );
  }
}
