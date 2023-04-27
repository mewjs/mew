/**
 * @file hooks.js
 */

import {useState} from 'react';

const Tips = ({title}) => (
    <>
        <span>
            {title}
        </span>
    </>
);

const Message = ({title}) => {
    const [name, setName] = useState('');
    return (
        <>
            <span>
                {`${title}:${name}`}
            </span>
        </>
    );
};

export default {Tips, Message};
