import React, {Component, PropTypes} from 'react';
import {ActivityIndicator, Text, StyleSheet} from 'react-native';
import {Link} from 'react-router';
import {fetchGithub} from '../github';
import {createAgenda} from '../agendas';
import Navigate from '../components/Navigate';
import Agenda from '../components/Agenda';

export default class AgendaPage extends Component {
  static contextTypes = {
    app: PropTypes.object.isRequired,
    accessToken: PropTypes.string.isRequired,
  };

  static propTypes = {
    params: PropTypes.shape({
      agendaId: PropTypes.string.isRequired,
    }).isRequired,
  };

  state = {
    agenda: null,
    isInvalid: false,
    isLoading: false,
    isAgendaSelected: false,
    isCurrentAgenda: true,
  };

  detachCurrentAgendaListener = null;

  setAgenda = async (agenda) => {
    const db = this.context.app.database();
    await Promise.all([
      db.ref('agenda').set(agenda),
      db.ref('timebox').remove(),
    ]);

    this.setState({isAgendaSelected: true});
  };

  async updateAgenda(props, context) {
    const {accessToken} = context;
    const {params: {agendaId}} = props;

    this.setState({agenda: null});

    setTimeout(() => {
      this.setState(({agenda, isInvalid}) => ({
        isLoading: !agenda && !isInvalid,
      }));
    }, 200);

    try {
      const id = agendaId.replace('-', '/');
      const url = `/repos/tc39/agendas/contents/${id}.md`;
      const res = await fetchGithub(url, {accessToken});
      if (res.ok) {
        const agenda = createAgenda(await res.json());
        this.setState({agenda});
      } else {
        this.setState({isInvalid: true});
      }
    } catch (e) {
      this.setState({isInvalid: true});
    }

    this.setState({isLoading: false});
  }

  subscribeCurrentAgenda() {
    const db = this.context.app.database();
    const ref = db.ref('agenda');
    const listener = ref.on('value', (snapshot) => {
      const {id: currentAgendaId} = snapshot.val() || {};
      this.setState((_, {params: {agendaId}}) => ({
        isCurrentAgenda: currentAgendaId === agendaId.replace('-', '/'),
      }));
    });

    this.detachCurrentAgendaListener = () => ref.off('value', listener);
  }

  componentDidMount() {
    this.updateAgenda(this.props, this.context);
    this.subscribeCurrentAgenda();
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.params.agendaId !== this.props.params.agendaId) {
      this.updateAgenda(nextProps, nextContext);
    }
  }

  componentWillUnmount() {
    this.detachCurrentAgendaListener();
  }

  render() {
    const {styles} = AgendaPage;
    const {
      agenda,
      isLoading,
      isInvalid,
      isAgendaSelected,
      isCurrentAgenda,
    } = this.state;

    if (isAgendaSelected) {
      return (
        <Navigate to='/agenda'/>
      );
    }

    if (isInvalid) {
      return (
        <Text style={styles.notFound}>
          Agenda not found. (<Link to='/agendas/'>Return to Agendas</Link>)
        </Text>
      );
    }

    if (isLoading) {
      return (
        <ActivityIndicator color='black'/>
      );
    }

    return agenda ? (
      <Agenda
        agenda={agenda}
        onAgendaSelect={!isCurrentAgenda ? this.setAgenda : null}
      />
    ) : (
      null
    );
  }

  static styles = StyleSheet.create({
    notFound: {
      fontStyle: 'italic',
    },
  });
}
