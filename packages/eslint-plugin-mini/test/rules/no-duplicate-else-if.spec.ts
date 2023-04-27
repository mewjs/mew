import { RuleTester } from 'eslint';
import rule from '../../src/rules/no-duplicate-else-if';

const tester = new RuleTester({
    parser: require.resolve('@mewjs/mpxml-eslint-parser')
});

tester.run('mini/no-duplicate-else-if', rule, {
    valid: [
        {
            filename: 'page.wxml',
            code: `
      <block>
        <view wx:if="{{foo}}" />
        <view wx:elif="{{bar}}" />
        <view wx:elif="{{baz}}" />
      </block>
      `
        },
        {
            filename: 'page.wxml',
            code: `
      <block>
        <view wx:if="{{foo}}" >
          <view wx:elif="{{foo}}" />
        </view>
      </block>
      `
        },
        {
            filename: 'page.wxml',
            code: `
      <block>
        <view wx:if="{{foo}}" />
        <view wx:elif="{{bar}}" />
        <view wx:if="{{bar}}" />
        <view wx:elif="{{foo}}" />
      </block>
      `
        },
        {
            filename: 'page.wxml',
            code: `
      <block>
        <view wx:if="{{isSomething(x)}}" />
        <view wx:elif="{{isSomethingElse(x)}}" />

        <view wx:if="{{a}}" />
        <view wx:elif="{{b}}" />
        <view wx:elif="{{c && d}}" />
        <view wx:elif="{{c && e}}" />

        <view wx:if="{{n === 1}}" />
        <view wx:elif="{{n === 2}}" />
        <view wx:elif="{{n === 3}}" />
        <view wx:elif="{{n === 4}}" />
        <view wx:elif="{{n === 5}}" />
      </block>
      `
        },
        {
            filename: 'page.wxml',
            code: `
      <block>
        <view wx:if="{{foo}}" />
        <view />
        <view wx:elif="{{foo}}" />
      </block>
      `
        },
        {
            filename: 'page.wxml',
            code: `
      <block>
        <view wx:if />
        <view wx:elif />
      </block>
      `
        },
        // parse error
        {
            filename: 'page.wxml',
            code: `
      <block>
        <view wx:if="{{foo.}}" />
        <view wx:elif="{{foo.}}" />
      </block>
      `
        },
        {
            filename: 'page.wxml',
            code: `
      <block>
        <view wx:elif="{{foo.}}" />
        <view wx:elif="{{foo}}" />
      </block>
      `
        },

        // Referred to the ESLint core rule.
        {
            code: '<block><view wx:if="{{a}}" /><view wx:elif="{{b}}" /></block>',
            filename: 'page.wxml',
        },
        {
            code: '<block><view wx:if="{{a}}" /><view wx:elif="{{b}}" /><view wx:elif="{{c}}" /></block>',
            filename: 'page.wxml',
        },
        {
            code: '<block><view wx:if="{{true}}" /><view wx:elif="{{false}}" /></block>',
            filename: 'page.wxml',
        },
        {
            code: '<block><view wx:if="1" /><view wx:elif="2" /></block>',
            filename: 'page.wxml',
        },
        {
            code: '<block><view wx:if="{{f}}" /><view wx:elif="{{f()}}" /></block>',
            filename: 'page.wxml',
        },
        {
            code: '<block><view wx:if="{{f(a)}}" /><view wx:elif="{{g(a)}}" /></block>',
            filename: 'page.wxml',
        },
        {
            code: '<block><view wx:if="{{f(a)}}" /><view wx:elif="f(b)" /></block>',
            filename: 'page.wxml',
        },
        {
            code: '<block><view wx:if="{{a === 1}}" /><view wx:elif="{{a === 2}}" /></block>',
            filename: 'page.wxml',
        },
        {
            code: '<block><view wx:if="{{a === 1}}" /><view wx:elif="{{b === 1}}" /></block>',
            filename: 'page.wxml',
        },
        {
            code: '<block><view wx:if="{{a}}" /></block>',
            filename: 'page.wxml',
        },
        {
            code: '<block><view wx:if="{{a}}"><view wx:if="{{a}}" /></view></block>',
            filename: 'page.wxml',
        },
        {
            code: '<block><view wx:if="{{a}}"><view wx:if="{{b}}" /></view><view wx:elif="{{b}}" /></block>',
            filename: 'page.wxml',
        },
        {
            code: '<block><view wx:if="{{a}}"><view wx:if="{{b}}" /><view wx:elif="{{a}}" /></view></block>',
            filename: 'page.wxml',
        },
        {
            code: '<block><view wx:if="{{a}}" /><view wx:elif="!!a" /></block>',
            filename: 'page.wxml',
        },
        {
            code: '<block><view wx:if="{{a === 1}}" /><view wx:elif="{{a === (1)}}" /></block>',
            filename: 'page.wxml',
        },
        {
            code: '<block><view wx:if="{{a || b}}" /><view wx:elif="{{c || d}}" /></block>',
            filename: 'page.wxml',
        },
        {
            code: '<block><view wx:if="{{a || b}}" /><view wx:elif="{{a || d}}" /></block>',
            filename: 'page.wxml',
        },
        {
            code: '<block><view wx:if="{{a}}" /><view wx:elif="{{a || b}}" /></block>',
            filename: 'page.wxml',
        },
        {
            code: '<block><view wx:if="{{a}}" /><view wx:elif="{{b}}" /><view wx:elif="a || b || c" /></block>',
            filename: 'page.wxml',
        },
        {
            code: '<block><view wx:if="{{a && b}}" /><view wx:elif="{{a}}" /><view wx:elif="{{b}}" /></block>',
            filename: 'page.wxml',
        },
        {
            code:
            `<block>
                    <view wx:if="{{a && b}}" /><view wx:elif="{{b && c}}" /><view wx:elif="{{a && c}}" />
            </block>`,
            filename: 'page.wxml',
        },
        {
            code: '<block><view wx:if="{{a && b}}" /><view wx:elif="{{b || c}}" /></block>',
            filename: 'page.wxml',
        },
        {
            code: '<block><view wx:if="{{a}}" /><view wx:elif="{{b && (a || c)}}" /></block>',
            filename: 'page.wxml',
        },
        {
            code: '<block><view wx:if="{{a}}" /><view wx:elif="{{b && (c || d && a)}}" /></block>',
            filename: 'page.wxml',
        },
        {
            code: '<block><view wx:if="{{a && b && c}}" /><view wx:elif="{{a && b && (c || d)}}" /></block>',
            filename: 'page.wxml',
        }
    ],
    invalid: [
        {
            filename: 'page.wxml',
            code: `
            <block>
                <view wx:if="{{foo}}" />
                <view wx:elif="{{foo}}" />
            </block>
            `,
            errors: [
                {
                    message:
            'This branch can never execute. '
            + 'Its condition is a duplicate or covered by previous conditions in the `wx:if` / `wx:elif` chain.',
                    line: 4,
                    column: 34,
                    endLine: 4,
                    endColumn: 37
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: `
      <block>
        <view wx:if="{{isSomething(x)}}" />
        <view wx:elif="{{isSomething(x)}}" />
      </block>
      `,
            errors: [
                {
                    messageId: 'unexpected',
                    line: 4
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: `
      <block>
        <view wx:if="{{a}}" />
        <view wx:elif="{{b}}" />
        <view wx:elif="{{c && d}}" />
        <view wx:elif="{{c && d}}" />
      </block>
      `,
            errors: [
                {
                    messageId: 'unexpected',
                    line: 6
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: `
      <block>
        <view wx:if="{{n === 1}}" />
        <view wx:elif="{{n === 2}}" />
        <view wx:elif="{{n === 3}}" />
        <view wx:elif="{{n === 2}}" />
        <view wx:elif="{{n === 5}}" />
      </block>
      `,
            errors: [
                {
                    messageId: 'unexpected',
                    line: 6
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: `
      <block>
        <view wx:if="{{a || b}}" />
        <view wx:elif="{{a}}" />
      </block>
      `,
            errors: [
                {
                    messageId: 'unexpected',
                    line: 4
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: `
      <block>
        <view wx:if="{{a}}" />
        <view wx:elif="{{b}}" />
        <view wx:elif="{{a || b}}" />
      </block>
      `,
            errors: [
                {
                    messageId: 'unexpected',
                    line: 5
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: `
      <block>
        <view wx:if="{{a}}" />
        <view wx:elif="{{a && b}}" />
      </block>
      `,
            errors: [
                {
                    messageId: 'unexpected',
                    line: 4
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: `
      <block>
        <view wx:if="{{a && b}}" />
        <view wx:elif="{{a && b && c}}" />
      </block>
      `,
            errors: [
                {
                    messageId: 'unexpected',
                    line: 4
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: `
      <block>
        <view wx:if="{{a || b}}" />
        <view wx:elif="{{b && c}}" />
      </block>
      `,
            errors: [
                {
                    messageId: 'unexpected',
                    line: 4
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: `
      <block>
        <view wx:if="{{a}}" />
        <view wx:elif="{{b && c}}" />
        <view wx:elif="{{d && (c && e && b || a)}}" />
      </block>
      `,
            errors: [
                {
                    messageId: 'unexpected',
                    line: 5
                }
            ]
        },
        {
            filename: 'page.wxml',
            code:
            `
            <block>
                <view wx:if="{{foo}}" />
                <view wx:elif="{{foo && bar}}" />
                <view wx:elif="{{baz && foo}}" />
            </block>
            `,
            errors: [
                {
                    messageId: 'unexpected',
                    line: 4,
                    column: 34,
                    endLine: 4,
                    endColumn: 37
                },
                {
                    messageId: 'unexpected',
                    line: 5,
                    column: 41,
                    endLine: 5,
                    endColumn: 44
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: `
      <block>
        <view wx:if="{{a && b}}" />
        <view wx:elif="{{a && b && c}}" />
        <view wx:elif="{{a && c && b}}" />
      </block>
      `,
            errors: [
                { messageId: 'unexpected', line: 4 },
                { messageId: 'unexpected', line: 5 }
            ]
        },
        {
            filename: 'page.wxml',
            code: `
      <block>
        <view wx:if="{{a || b}}" />
        <view wx:elif="{{a}}" />
        <view wx:elif="{{b}}" />
      </block>
      `,
            errors: [
                { messageId: 'unexpected', line: 4 },
                { messageId: 'unexpected', line: 5 }
            ]
        },
        {
            filename: 'page.wxml',
            code: `
      <block>
        <view wx:if      ="{{((f && e) || d) && c || (b && a)}}" />
        <view wx:elif ="{{(a && b) || (c && (d || (e && f)))}}" />
        <view wx:elif ="{{(a && b) || (c && (d || (e && f)))}}" />
      </block>
      `,
            errors: [{ messageId: 'unexpected' }, { messageId: 'unexpected' }]
        },

        // Referred to the ESLint core rule.
        {
            filename: 'page.wxml',
            code: '<block><view wx:if="{{a}}" /><view wx:elif="{{a}}" /></block>',
            errors: [{ messageId: 'unexpected' }]
        },
        {
            filename: 'page.wxml',
            code:
        `<block>
            <view wx:if="{{a}}" /><view wx:elif="{{b}}" /><view wx:elif="{{a}}" /><view wx:elif="{{c}}" />
        </block>`,
            errors: [{ messageId: 'unexpected' }]
        },
        {
            filename: 'page.wxml',
            code:
        '<block><view wx:if="{{a}}" /><view wx:elif="{{b}}" /><view wx:elif="{{a}}" /></block>',
            errors: [{ messageId: 'unexpected' }]
        },
        {
            filename: 'page.wxml',
            code:
        `<block>
            <view wx:if="{{a}}" /><view wx:elif="{{b}}" /><view wx:elif="{{c}}" /><view wx:elif="{{a}}" />
        </block>`,
            errors: [{ messageId: 'unexpected' }]
        },
        {
            filename: 'page.wxml',
            code:
        '<block><view wx:if="{{a}}" /><view wx:elif="{{b}}" /><view wx:elif="{{b}}" /></block>',
            errors: [{ messageId: 'unexpected' }]
        },
        {
            filename: 'page.wxml',
            code:
        `<block>
            <view wx:if="{{a}}" /><view wx:elif="{{b}}" /><view wx:elif="{{c}}" /><view wx:elif="{{b}}" />
        </block>`,
            errors: [{ messageId: 'unexpected' }]
        },
        {
            filename: 'page.wxml',
            code:
        `<block>
            <view wx:if="{{a}}" /><view wx:elif="{{b}}" /><view wx:elif="{{c}}" />
            <view wx:elif="{{b}}" /><view wx:elif="{{d}}" />
        </block>`,
            errors: [{ messageId: 'unexpected' }]
        },
        {
            filename: 'page.wxml',
            code:
        `<block>
            <view wx:if="{{a}}" /><view wx:elif="{{b}}" /><view wx:elif="{{c}}" /><view wx:elif="{{d}}" />
            <view wx:elif="{{b}}" />
            <view wx:elif="{{e}}" />
        </block>`,
            errors: [{ messageId: 'unexpected' }]
        },
        {
            filename: 'page.wxml',
            code:
        '<block><view wx:if="{{a}}" /><view wx:elif="{{a}}" /><view wx:elif="{{a}}" /></block>',
            errors: [{ messageId: 'unexpected' }, { messageId: 'unexpected' }]
        },
        {
            filename: 'page.wxml',
            code:
        `<block>
            <view wx:if="{{a}}" /><view wx:elif="{{b}}" /><view wx:elif="{{a}}" /><view wx:elif="{{b}}" />
            <view wx:elif="{{a}}" />
        </block>`,
            errors: [
                { messageId: 'unexpected' },
                { messageId: 'unexpected' },
                { messageId: 'unexpected' }
            ]
        },
        {
            filename: 'page.wxml',
            code:
        '<block><view wx:if="{{a}}"><view wx:if="{{b}}" /></view><view wx:elif="{{a}}" /></block>',
            errors: [{ messageId: 'unexpected' }]
        },
        {
            filename: 'page.wxml',
            code:
        '<block><view wx:if="{{a === 1}}" /><view wx:elif="{{a === 1}}" /></block>',
            errors: [{ messageId: 'unexpected' }]
        },
        {
            filename: 'page.wxml',
            code:
        '<block><view wx:if="{{1 < a}}" /><view wx:elif="{{1 < a}}" /></block>',
            errors: [{ messageId: 'unexpected' }]
        },
        {
            filename: 'page.wxml',
            code: '<block><view wx:if="{{true}}" /><view wx:elif="{{true}}" /></block>',
            errors: [{ messageId: 'unexpected' }]
        },
        {
            filename: 'page.wxml',
            code:
        '<block><view wx:if="{{a && b}}" /><view wx:elif="{{a && b}}" /></block>',
            errors: [{ messageId: 'unexpected' }]
        },
        {
            filename: 'page.wxml',
            code:
        '<block><view wx:if="{{a && b || c}}" /><view wx:elif="{{a && b || c}}" /></block>',
            errors: [{ messageId: 'unexpected' }]
        },
        {
            filename: 'page.wxml',
            code: '<block><view wx:if="{{f(a)}}" /><view wx:elif="{{f(a)}}" /></block>',
            errors: [{ messageId: 'unexpected' }]
        },
        {
            filename: 'page.wxml',
            code:
        '<block><view wx:if="{{a === 1}}" /><view wx:elif="{{a===1}}" /></block>',
            errors: [{ messageId: 'unexpected' }]
        },
        {
            filename: 'page.wxml',
            code:
        '<block><view wx:if="{{a === 1}}" /><view wx:elif="{{a === /* comment */ 1}}" /></block>',
            errors: [{ messageId: 'unexpected' }]
        },
        {
            filename: 'page.wxml',
            code: '<block><view wx:if="{{a || b}}" /><view wx:elif="{{a}}" /></block>',
            errors: [{ messageId: 'unexpected' }]
        },
        {
            filename: 'page.wxml',
            code:
        '<block><view wx:if="{{a || b}}" /><view wx:elif="{{a}}" /><view wx:elif="{{b}}" /></block>',
            errors: [{ messageId: 'unexpected' }, { messageId: 'unexpected' }]
        },
        {
            filename: 'page.wxml',
            code:
        '<block><view wx:if="{{a || b}}" /><view wx:elif="{{b || a}}" /></block>',
            errors: [{ messageId: 'unexpected' }]
        },
        {
            filename: 'page.wxml',
            code:
        '<block><view wx:if="{{a}}" /><view wx:elif="{{b}}" /><view wx:elif="{{a || b}}" /></block>',
            errors: [{ messageId: 'unexpected' }]
        },
        {
            filename: 'page.wxml',
            code:
        '<block><view wx:if="{{a || b}}" /><view wx:elif="{{c || d}}" /><view wx:elif="{{a || d}}" /></block>',
            errors: [{ messageId: 'unexpected' }]
        },
        {
            filename: 'page.wxml',
            code:
        '<block><view wx:if="{{(a === b && fn(c)) || d}}" /><view wx:elif="{{fn(c) && a === b}}" /></block>',
            errors: [{ messageId: 'unexpected' }]
        },
        {
            filename: 'page.wxml',
            code: '<block><view wx:if="{{a}}" /><view wx:elif="{{a && b}}" /></block>',
            errors: [{ messageId: 'unexpected' }]
        },
        {
            filename: 'page.wxml',
            code:
        '<block><view wx:if="{{a && b}}" /><view wx:elif="{{a && b && c}}" /></block>',
            errors: [{ messageId: 'unexpected' }]
        },
        {
            filename: 'page.wxml',
            code:
        '<block><view wx:if="{{a || c}}" /><view wx:elif="{{a && b || c}}" /></block>',
            errors: [{ messageId: 'unexpected' }]
        },
        {
            filename: 'page.wxml',
            code:
        '<block><view wx:if="{{a}}" /><view wx:elif="{{b}}" /><view wx:elif="{{c && a || b}}" /></block>',
            errors: [{ messageId: 'unexpected' }]
        },
        {
            filename: 'page.wxml',
            code:
        '<block><view wx:if="{{a}}" /><view wx:elif="{{b}}" /><view wx:elif="{{c && (a || b)}}" /></block>',
            errors: [{ messageId: 'unexpected' }]
        },
        {
            filename: 'page.wxml',
            code:
        `<block>
            <view wx:if="{{a}}" /><view wx:elif="{{b && c}}" /><view wx:elif="{{d && (a || e && c && b)}}" />
        </block>`,
            errors: [{ messageId: 'unexpected' }]
        },
        {
            filename: 'page.wxml',
            code:
        '<block><view wx:if="{{a || b && c}}" /><view wx:elif="{{b && c && d}}" /></block>',
            errors: [{ messageId: 'unexpected' }]
        },
        {
            filename: 'page.wxml',
            code:
        '<block><view wx:if="{{a || b}}" /><view wx:elif="{{b && c}}" /></block>',
            errors: [{ messageId: 'unexpected' }]
        },
        {
            filename: 'page.wxml',
            code:
        '<block><view wx:if="{{a}}" /><view wx:elif="{{b}}" /><view wx:elif="{{(a || b) && c}}" /></block>',
            errors: [{ messageId: 'unexpected' }]
        },
        {
            filename: 'page.wxml',
            code:
        '<block><view wx:if="{{(a && (b || c)) || d}}" /><view wx:elif="{{(c || b) && e && a}}" /></block>',
            errors: [{ messageId: 'unexpected' }]
        },
        {
            filename: 'page.wxml',
            code:
        '<block><view wx:if="{{a && b || b && c}}" /><view wx:elif="{{a && b && c}}" /></block>',
            errors: [{ messageId: 'unexpected' }]
        },
        {
            filename: 'page.wxml',
            code:
        `<block>
            <view wx:if="{{a}}" /><view wx:elif="{{b && c}}" /><view wx:elif="{{d && (c && e && b || a)}}" />
        </block>`,
            errors: [{ messageId: 'unexpected' }]
        },
        {
            filename: 'page.wxml',
            code:
        '<block><view wx:if="{{a || (b && (c || d))}}" /><view wx:elif="{{(d || c) && b}}" /></block>',
            errors: [{ messageId: 'unexpected' }]
        },
        {
            filename: 'page.wxml',
            code:
        '<block><view wx:if="{{a || b}}" /><view wx:elif="{{(b || a) && c}}" /></block>',
            errors: [{ messageId: 'unexpected' }]
        },
        {
            filename: 'page.wxml',
            code:
        `<block>
            <view wx:if="{{a || b}}" />
                <view wx:elif="{{c}}" /><view wx:elif="{{d}}" />
            <view wx:elif="{{b && (a || c)}}" />
        </block>`,
            errors: [{ messageId: 'unexpected' }]
        },
        {
            filename: 'page.wxml',
            code:
        '<block><view wx:if="{{a || b || c}}" /><view wx:elif="{{a || (b && d) || (c && e)}}" /></block>',
            errors: [{ messageId: 'unexpected' }]
        },
        {
            filename: 'page.wxml',
            code:
        '<block><view wx:if="{{a || (b || c)}}" /><view wx:elif="{{a || (b && c)}}" /></block>',
            errors: [{ messageId: 'unexpected' }]
        },
        {
            filename: 'page.wxml',
            code:
        `<block>
            <view wx:if="{{a || b}}" /><view wx:elif="{{c}}" /><view wx:elif="{{d}}" />
            <view wx:elif="{{(a || c) && (b || d)}}" />
        </block>`,
            errors: [{ messageId: 'unexpected' }]
        },
        {
            filename: 'page.wxml',
            code:
        '<block><view wx:if="{{a}}" /><view wx:elif="{{b}}" /><view wx:elif="{{c && (a || d && b)}}" /></block>',
            errors: [{ messageId: 'unexpected' }]
        },
        {
            filename: 'page.wxml',
            code: '<block><view wx:if="{{a}}" /><view wx:elif="{{a || a}}" /></block>',
            errors: [{ messageId: 'unexpected' }]
        },
        {
            filename: 'page.wxml',
            code:
        '<block><view wx:if="{{a || a}}" /><view wx:elif="{{a || a}}" /></block>',
            errors: [{ messageId: 'unexpected' }]
        },
        {
            filename: 'page.wxml',
            code: '<block><view wx:if="{{a || a}}" /><view wx:elif="{{a}}" /></block>',
            errors: [{ messageId: 'unexpected' }]
        },
        {
            filename: 'page.wxml',
            code: '<block><view wx:if="{{a}}" /><view wx:elif="{{a && a}}" /></block>',
            errors: [{ messageId: 'unexpected' }]
        },
        {
            filename: 'page.wxml',
            code:
        '<block><view wx:if="{{a && a}}" /><view wx:elif="{{a && a}}" /></block>',
            errors: [{ messageId: 'unexpected' }]
        },
        {
            filename: 'page.wxml',
            code: '<block><view wx:if="{{a && a}}" /><view wx:elif="{{a}}" /></block>',
            errors: [{ messageId: 'unexpected' }]
        }
    ]
});
