/**
 * @file parse-wxml.js
 */

const parser = require('../../src/index.ts');
const {readMpXmlFile, fixturesDir} = require('./util.js');


const mpxmlFile = readMpXmlFile(`${fixturesDir}/expression.wxml`);
const code = mpxmlFile.content;

const result = parser.parseForESLint(`
<template data="{{foo, bar}}"></template>`, {
    filePath: mpxmlFile.filePath,
    ecmaVersion: 2018,
    sourceType: 'module'
});

console.log(result);
