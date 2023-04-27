/**
 * @file component.jsx
 */

import React from 'react';
import './app.jsx';
import '../app.css';
import '../app.scss';
import '../app.styl';
import '../icon.png';

const Message = (
    <>
        message
    </>
);

const Fragment = ({hello}) => (
    <React.Fragment>
        {hello}
    </React.Fragment>
);

export default class MyComponent extends React.Component {

    static propTypes = {
        hello: String
    };

    static defaultProps = {
        hello: 'hello'
    };

    state = {
        world: 'world'
    };

    componentDidMount() {
        this.hello = 'world';
    }

    doClick = () => {
        this.clicked = true;
    };

    maxFunctionLines = () => {
        let line = 1;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        line = 2;
        return line;
    };

    render() {
        const {hello} = this.props;
        const {world} = this.state;
        return (
            <>
                <Message />
                <Fragment hello={hello} world={world} />
                <div role="button" onClick={this.doClick}></div>
            </>
        );
    }
}
