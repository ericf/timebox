import marked from 'marked';

function parser(tokens) {
  let current = 0;
  let isInList = false;

  function walk() {
    let token = tokens[current];

    if (token.type === 'list_start') {
      let node = {
        type: 'list',
        ordered: token.ordered,
        items: [],
      };

      current++;

      while (token.type !== 'list_end') {
        isInList = true;
        let item = walk();
        if (item) {
          node.items.push(item);
        }
        token = tokens[current];
      }

      current++;
      isInList = false;

      return node;
    }

    if (token.type === 'list_item_start') {
      let node = {
        type: 'list_item',
        body: [],
      };

      current++;

      while (token.type !== 'list_item_end') {
        let child = walk();
        if (child) {
          node.body.push(child);
        }
        token = tokens[current];
      }

      current++;

      return node;
    }

    if (isInList && token.type === 'text') {
      current++;

      return {
        type: 'text',
        text: token.text,
      };
    }

    current++;
  }

  let ast = {
    type: 'agenda',
    links: tokens.links,
    lists: [],
  };

  while (current < tokens.length) {
    let list = walk();
    if (list) {
      ast.lists.push(list);
    }
  }

  return ast;
}

function traverser(ast, visitor) {
  function traverseArray(array, parent) {
      array.forEach((child) => traverseNode(child, parent));
  }

  function traverseNode(node, parent) {
    let method = visitor[node.type];
    if (method) {
      method(node, parent);
    }

    switch (node.type) {
      case 'agenda':
        traverseArray(node.lists, node);
        break;

      case 'list':
        traverseArray(node.items, node);
        break;

      case 'list_item':
        traverseArray(node.body, node);
        break;

      default:
        break;
    }
  }

  traverseNode(ast, null);
}

function transformer(ast) {
  function isTimeboxedList({body: [label = {}, list = {}]}) {
    return (
      label.type === 'text' &&
      /timebox/i.test(label.text) &&
      !/non|not/i.test(label.text) &&
      list.type === 'list'
    );
  }

  var newAst = {
    ...ast,
    lists: [],
  };

  traverser(ast, {
    list_item(node, parent) {
      if (isTimeboxedList(node)) {
        newAst.lists.push({
          ...parent,
          items: [node],
        });
      }
    }
  });

  return newAst;
}

function generator(ast) {
  function generateTimeItems(node) {
    let [timeLabel, {items = []} = {}] = node.body;

    if (!/\d+/.test(timeLabel.text)) {
      return [];
    }

    return items.map(({body: [item]}) => {
      return {
        duration: timeLabel.text.match(/\d+/)[0] * 60 * 1000,
        isComplete: /^~~/.test(item.text),
        label: item.text,
      };
    });
  }

  return ast.lists.map((list) => {
    let [label, {items: times}] = list.items[0].body;
    return {
      label: label.text,
      items: times.reduce((items, time) => {
        return items.concat(generateTimeItems(time));
      }, []),
    };
  });
}

export function compileAgenda(agenda) {
  let tokens = marked.lexer(atob(agenda.content));
  let ast = transformer(parser(tokens));
  let [year, month] = agenda.path.replace(/\.md$/, '').split('/').map(Number);

  return {
    year,
    month,
    url: agenda.html_url,
    sha: agenda.sha,
    content: {
      timeboxed: generator(ast),
      links: ast.links,
    },
  };
}
