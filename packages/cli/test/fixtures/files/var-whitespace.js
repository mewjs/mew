/**
 * @file var-whitespace.js
 */

const myVar  =  1;

const {documentElement: {firstElementChild: {nextSibling}}} = window;

const myArray
    = [].filter().map();

const myObject = {
    prop1: !1
};

export default {myVar, myObject, myArray, nextSibling};
