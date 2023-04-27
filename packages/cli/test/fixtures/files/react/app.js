/**
 * @file index.jsx
 */

import React from 'react';
import ReactDOM from 'react-dom';
import '../app.less';
import '../app.css';
import '../app.scss';
import '../app.styl';
import '../icon.png';

class App extends React.Component {}

ReactDOM.render(
    React.createElement(<App/>),
    document.body.appendChild(document.createElement('div'))
);
