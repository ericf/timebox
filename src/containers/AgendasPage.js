import React, {Component, PropTypes} from 'react';
import {ActivityIndicator} from 'react-native';
import {createAgenda} from '../agendas';
import {fetchGithub} from '../github';
import Agendas from '../components/Agendas';

export default class AgendasPage extends Component {
  static contextTypes = {
    accessToken: PropTypes.string.isRequired,
  };

  state = {
    agendas: null,
    isLoading: false,
  };

  async updateAgendas() {
    const {accessToken} = this.context;

    setTimeout(() => {
      this.setState(({agendas}) => ({
        isLoading: !agendas,
      }));
    }, 200);

    const repoContentsUrl = '/repos/tc39/agendas/contents/';
    const repoContentsRes = await fetchGithub(repoContentsUrl, {accessToken});
    const repoContents = await repoContentsRes.json();

    const yearsDirs = repoContents.filter(({name, type}) => {
      return type === 'dir' && /\d{4}/.test(name);
    });

    const yearsContents = await Promise.all(
      // Last two years.
      yearsDirs.slice(-2).map(async (dir) => {
        const dirContentsRes = await fetchGithub(dir.url, {accessToken});
        return dirContentsRes.json();
      })
    );

    const agendas = yearsContents.reduce((agendas, yearContents) => {
      return agendas.concat(
        yearContents.filter(({name, type}) => {
          return type === 'file' && /\d{2}\.md/.test(name);
        })
      );
    }, []).reverse().slice(0, 3).map(createAgenda);

    this.setState({
      agendas,
      isLoading: false,
    });
  }

  componentDidMount() {
    this.updateAgendas();
  }

  render() {
    const {agendas, isLoading} = this.state;

    if (isLoading) {
      return (
        <ActivityIndicator color='black'/>
      );
    }

    return agendas ? (
      <Agendas agendas={agendas}/>
    ) : (
      null
    );
  }
}
