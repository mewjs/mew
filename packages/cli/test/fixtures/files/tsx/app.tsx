/**
 * @file index.jsx
 */

import React from 'react';
import ReactDOM from 'react-dom';

class A<T> {
    private list: T[] = [];

    constructor(private name = 'a', t: T) {
        this.list.push(t);
    }

    getName(): string {
        return  this.name;
    }

    pop():T {
        return this.list.pop();
    }
}


class App extends React.Component {
    hello(): App {
        return new A('test', this).pop();
    }
}

ReactDOM.render(
    React.createElement(<App />),
    document.body.appendChild(document.createElement('div'))
);

