import {Component, PropTypes} from 'react';
import {routerContext} from 'react-router/PropTypes';

export default class Navigate extends Component {
  static contextTypes = {
    router: routerContext.isRequired,
  };

  static propTypes = {
    to: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ]).isRequired,
  };

  componentDidMount() {
    this.context.router.transitionTo(this.props.to);
  }

  render() {
    return null;
  }
}
