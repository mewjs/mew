/**
 * @file effect.js
 */
import {useState, useEffect} from 'react';


const Effect = () => {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        this.ab = visible;
        setVisible(true);
    }, []);
};

export default Effect;
