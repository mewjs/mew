import React from 'react';
import './App.css';

function App() {
    return (
        <div className="App">
            <div className="title">
                <img src={require('./app.png')} alt="" />
                <h3>
                    您需要完成以下个步骤
                </h3>
                <img src={require('./app.png')} alt="" />
            </div>
            <header className="App-header">
                <p>
                    Edit
                    {' '}
                    <code>src/App.js</code>
                    {' '}
                    and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
        </div>
    );
}

export default App;
