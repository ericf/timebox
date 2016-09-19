import React, {PureComponent, PropTypes} from 'react';
import {UIManager, findNodeHandle} from 'react-native';
import marked from 'marked';

export default class MarkdownContent extends PureComponent {
  static propTypes = {
    content: PropTypes.string.isRequired,
    links  : PropTypes.object.isRequired,
    style  : PropTypes.any,
  };

  static defaultProps = {
    links: {},
  };

  applyStyleToMarkdownRoot() {
    const node = findNodeHandle(this).firstChild;
    const {style} = this.props;
    UIManager.updateView(node, {style}, this);
  }

  componentDidMount() {
    this.applyStyleToMarkdownRoot();
  }

  componentDidUpdate() {
    this.applyStyleToMarkdownRoot();
  }

  render() {
    let tokens = marked.lexer(this.props.content);
    tokens.links = this.props.links;

    return (
      <div dangerouslySetInnerHTML={{
        __html: marked.parser(tokens),
      }}/>
    );
  }
};
