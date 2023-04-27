
import path from 'path';
import { RuleTester } from 'eslint';
import rule from '../../src/rules/resolve-src';

const ruleTester = new RuleTester({
    parser: require.resolve('@mewjs/mpxml-eslint-parser')
});

const filePath = path.resolve(
    __dirname,
    '../fixtures/miniprogram/pages/test/test.wxml'
);

const wrongFilePath = path.resolve(
    __dirname,
    '../fixtures/miniprogram/pages/test.wxml'
);

ruleTester.run('resolve-src', rule, {

    valid: [
        {
            filename: filePath,
            code: '<wxs src="../../tools.wxs"/>'
        },
        {
            filename: filePath,
            code: '<import src="/pages/item/item.wxml"/>'
        },
        {
            filename: filePath,
            code: '<include src="../item/item.wxml"/>'
        },
        {
            filename: filePath,
            code: '<include src="../item/item.wxml"></include>'
        },
        {
            filename: filePath,
            code: '<import src="../item/item.wxml"></import>'
        },
        {
            filename: filePath,
            code: '<wxs src="../../tools.wxs"></wxs>'
        },
        {
            filename: filePath,
            code: '<include />'
        }
    ],
    invalid: [
        {
            filename: wrongFilePath,
            code: '<wxs src="../../tools.wxs" />',
            errors: [
                {
                    message: 'Unable to resolve the src path to \'../../tools.wxs\'.',
                    line: 1,
                    column: 6,
                    endColumn: 27
                }
            ]
        },
        {
            filename: filePath,
            code: '<wxs src="../tools.wxs" />',
            errors: [
                {
                    message: 'Unable to resolve the src path to \'../tools.wxs\'.',
                    line: 1,
                    column: 6,
                    endColumn: 24
                }
            ]
        },
        {
            filename: filePath,
            code: '<wxs src="/tools.wxs" />',
            errors: [
                {
                    message: 'The wxs src path to \'/tools.wxs\' shouldn\'t be absolute.',
                    line: 1,
                    column: 6,
                    endColumn: 22
                }
            ]
        },
        {
            filename: filePath,
            code: '<wxs src="{{srcUrl}}" />',
            errors: [
                {
                    message: 'src value should be literal text.',
                    line: 1,
                    column: 6,
                    endColumn: 22
                }
            ]
        },
        {
            filename: filePath,
            code: '<import src="{{srcUrl}}" />',
            errors: [
                {
                    message: 'src value should be literal text.',
                    line: 1,
                    column: 9,
                    endColumn: 25
                }
            ]
        },
        {
            filename: filePath,
            code: '<import src="{{srcUrl}}/abc.js" />',
            errors: [
                {
                    message: 'src value should be literal text.',
                    line: 1,
                    column: 9,
                    endColumn: 32
                }
            ]
        },
        {
            filename: filePath,
            code: '<import src="../src/item.wxml" />',
            errors: [
                {
                    message: 'Unable to resolve the src path to \'../src/item.wxml\'.',
                    line: 1,
                    column: 9,
                    endColumn: 31
                }
            ]
        },
        {
            filename: filePath,
            code: '<import src="/pages/src/item.wxml" />',
            errors: [
                {
                    message: 'Unable to resolve the src path to \'/pages/src/item.wxml\'.',
                    line: 1,
                    column: 9,
                    endColumn: 35
                }
            ]
        },
        {
            filename: filePath,
            code: '<include src="../item.wxml" />',
            errors: [
                {
                    message: 'Unable to resolve the src path to \'../item.wxml\'.',
                    line: 1,
                    column: 10,
                    endColumn: 28
                }
            ]
        },
        {
            filename: filePath,
            code: '<include src="/pages/src/item.wxml" />',
            errors: [
                {
                    message: 'Unable to resolve the src path to \'/pages/src/item.wxml\'.',
                    line: 1,
                    column: 10,
                    endColumn: 36
                }
            ]
        },
        {
            filename: filePath,
            code: '<include src="{{srcUrl}}/abc.js" />',
            errors: [
                {
                    message: 'src value should be literal text.',
                    line: 1,
                    column: 10,
                    endColumn: 33
                }
            ]
        }
    ]
});
