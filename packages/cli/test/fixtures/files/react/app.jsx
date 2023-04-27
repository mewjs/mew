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
import '../icon.woff';

class App extends React.Component {}

const Message = (<>message</>);

ReactDOM.render(
    React.createElement(<App message={(<Message/>)} />),
    document.body.appendChild( document.createElement('div'))
);
