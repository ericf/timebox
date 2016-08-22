import React, {PureComponent, PropTypes} from 'react';
import marked from 'marked';

export default class MarkdownContent extends PureComponent {
  static propTypes = {
    content: PropTypes.string.isRequired,
    links  : PropTypes.object.isRequired,
  };

  static defaultProps = {
    links: {},
  };

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
