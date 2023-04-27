import { ESLint, type Linter } from 'eslint';
import base from '../src/config/base';
import recommended from '../src/config/recommended';
import * as plugin from '../src';

const baseConfig = base as unknown as Linter.Config;
const recommendedConfig = recommended as unknown as Linter.Config;

const testCode = `
<template data="{{item}}"></template>
<view>
    <button class="btn" bindtap="btn1" type="primary" loading="{{loading}}" disabled="{{disabled}}">
        按钮
    </button>
    <icon wx:if="abc" type="success" size="23" color="" />
</view>

<wxs module="foo">
var some_msg = "hello world";
module.exports = {
    msg: some_msg
}
</wxs>
<view class="class">{{foo.msg}}</view>
`;

describe('lint', () => {
    it('lint base', done => {
        const eslint = new ESLint({
            cwd: '/tmp',
            baseConfig,
            resolvePluginsRelativeTo: __dirname,
            plugins: {
                '@mewjs/min': plugin
            },
            fix: false
        });
        const promise = eslint.lintText(
            testCode,
            {
                filePath: 'page.wxml',
                warnIgnored: false
            }
        );

        promise.then(result => {
            const [{ messages } = { messages: [] }] = result;
            expect(messages).toEqual([]);
            done();
        });
    });

    it('lint recommended', done => {
        const eslint = new ESLint({
            cwd: '/tmp',
            baseConfig: recommendedConfig,
            resolvePluginsRelativeTo: __dirname,
            plugins: {
                '@mewjs/min': plugin
            },
            fix: false
        });
        const promise = eslint.lintText(
            testCode,
            {
                filePath: 'page.wxml',
                warnIgnored: false
            }
        );

        promise.then(result => {
            const [{ messages } = { messages: [] }] = result;
            expect(messages.length > 0).toBeTruthy();
            done();
        });
    });


    it('lint base eslint-disabled', done => {
        const eslint = new ESLint({
            cwd: '/tmp',
            baseConfig,
            resolvePluginsRelativeTo: __dirname,
            plugins: {
                '@mewjs/min': plugin
            },
            fix: false
        });

        const promise = eslint.lintText(
            `<!-- eslint-disable -->\n${ testCode }`,
            {
                filePath: 'page.wxml',
                warnIgnored: false
            }
        );

        promise.then(result => {
            const [{ messages } = { messages: [] }] = result;
            expect(messages.length).toBe(0);
            done();
        });
    });
});
