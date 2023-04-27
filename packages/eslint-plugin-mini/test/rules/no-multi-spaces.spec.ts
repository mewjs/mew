import { RuleTester } from 'eslint';
import rule from '../../src/rules/no-multi-spaces';

const ruleTester = new RuleTester({
    parser: require.resolve('@mewjs/mpxml-eslint-parser')
});

ruleTester.run('no-multi-spaces', rule, {
    valid: [
        {
            filename: 'page.wxml',
            code: ''
        },
        {
            filename: 'page.wxml',
            code: '<   view />'
        },
        {
            filename: 'page.wxml',
            code: '<view></view>'
        },
        {
            filename: 'page.wxml',
            code: '<view>     </view>     <view/>'
        },
        {
            filename: 'page.wxml',
            code: '<view ></ view>'
        },
        {
            filename: 'page.wxml',
            code: '<view class="aaa"></view>'
        },
        {
            filename: 'page.wxml',
            code: '<view class = "aaa" ></view>'
        },
        {
            filename: 'page.wxml',
            code: '<view class = "    aaa     " ></view>'
        },
        {
            filename: 'page.wxml',
            code: '<view class = "aaa"\n          style="aaa"></view>'
        },
        {
            filename: 'page.wxml',
            code: '<view class = "aaa"\n\t\t\t\tstyle="aaa"\n\t\t\t></view>'
        },
        {
            filename: 'page.wxml',
            code: '<view class = "aaa" \n          style="aaa"></view>'
        },
        {
            filename: 'page.wxml',
            code: '<view class = "{{aaa}}"\n          style="aaa"></view>'
        },
        {
            filename: 'page.wxml',
            code: '<view class = "{{ aaa }}"\n          style="aaa"></view>'
        },
        {
            filename: 'page.wxml',
            code: '<view class="{{aaa}}" style="aaa"></view>'
        },
        {
            filename: 'page.wxml',
            code: '<view class="aa" style="aaa">{{test}}</view>'
        },
        {
            filename: 'page.wxml',
            code: '<view class="aa" style="aaa">{{ test }}</view>'
        },
        {
            filename: 'page.wxml',
            code: '<view class="aa" style="aaa">{{test}}<!-- hello --></view>'
        },
        {
            filename: 'page.wxml',
            code: '<view class="aa" style="aaa">{{test}} <!-- hello --></view>'
        },
        {
            filename: 'page.wxml',
            code: '<view class="aa" style="aaa">{{test}} <!--      hello     --></view>'
        },
        {
            filename: 'page.wxml',
            code: '<view class="      " style="aaa">"         "</view>'
        },
        {
            filename: 'page.wxml',
            code: '<view class="      " style="aaa">   {{ }}   </view>'
        },
        {
            filename: 'page.wxml',
            code: `<view>{{
                1 === 1 ? 1 : {
                    a   :   1,
                    b   :   2
                }
            }}</view>`,
            options: [
                {
                    ignoreProperties: true
                }
            ]
        },
    ],
    invalid: [
        {
            filename: 'page.wxml',
            code: '<view    ></view>',
            output: '<view ></view>',
            errors: [
                {
                    message: 'Multiple spaces found before \'>\'.',
                    type: 'HTMLTagClose'
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view    class="aaa" ></view>',
            output: '<view class="aaa" ></view>',
            errors: [
                {
                    message: 'Multiple spaces found before \'class\'.',
                    type: 'HTMLIdentifier'
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view    class="aaa" >   <view   /></view>',
            output: '<view class="aaa" >   <view /></view>',
            errors: [
                {
                    message: 'Multiple spaces found before \'class\'.',
                    type: 'HTMLIdentifier'
                },
                {
                    message: 'Multiple spaces found before \'/>\'.',
                    type: 'HTMLSelfClosingTagClose'
                },
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view\t\tclass="aaa"\t\t></view>',
            output: '<view class="aaa" ></view>',
            errors: [
                {
                    message: 'Multiple spaces found before \'class\'.',
                    type: 'HTMLIdentifier'
                },
                {
                    message: 'Multiple spaces found before \'>\'.',
                    type: 'HTMLTagClose'
                },
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view wx  :  if="aaa"></view>',
            output: '<view wx : if="aaa"></view>',
            errors: [
                {
                    message: 'Multiple spaces found before \':\'.',
                    type: 'HTMLIdentifier'
                },
                {
                    message: 'Multiple spaces found before \'if\'.',
                    type: 'HTMLIdentifier'
                },
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view\n    class="aaa"   >    {{}}    </view>',
            output: '<view\n    class="aaa" >    {{}}    </view>',
            errors: [
                {
                    message: 'Multiple spaces found before \'>\'.',
                    type: 'HTMLTagClose'
                }
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view\n    class="aaa" >    {{  test  }}    </view>',
            output: '<view\n    class="aaa" >    {{ test }}    </view>',
            errors: [
                {
                    message: 'Multiple spaces found before \'test\'.',
                    type: 'Identifier'
                },
                {
                    message: 'Multiple spaces found before \'}}\'.',
                    type: 'XExpressionEnd'
                },
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view\n    class="{{  test  }}" >        </view>',
            output: '<view\n    class="{{ test }}" >        </view>',
            errors: [
                {
                    message: 'Multiple spaces found before \'test\'.',
                    type: 'Identifier'
                },
                {
                    message: 'Multiple spaces found before \'}}\'.',
                    type: 'XExpressionEnd'
                },
            ]
        },
        {
            filename: 'page.wxml',
            code: '<view\n    class="   aaa {{  test  }} aaa   " >        </view>',
            output: '<view\n    class="   aaa {{ test }} aaa   " >        </view>',
            errors: [
                {
                    message: 'Multiple spaces found before \'test\'.',
                    type: 'Identifier'
                },
                {
                    message: 'Multiple spaces found before \'}}\'.',
                    type: 'XExpressionEnd'
                },
            ]
        },
        {
            filename: 'page.wxml',
            code: `<view\n    class="aaa" >    {{ \n  1 === 2 ? 1 : {
                        a  :    1,
                        b  :    2
                    }
                }}
            </view>`,
            output: `<view\n    class="aaa" >    {{ \n  1 === 2 ? 1 : {
                        a : 1,
                        b : 2
                    }
                }}
            </view>`,
            errors: [
                {
                    message: 'Multiple spaces found before \':\'.',
                    type: 'Punctuator'
                },
                {
                    message: 'Multiple spaces found before \'1\'.',
                    type: 'Numeric'
                },
                {
                    message: 'Multiple spaces found before \':\'.',
                    type: 'Punctuator'
                },
                {
                    message: 'Multiple spaces found before \'2\'.',
                    type: 'Numeric'
                },
            ]
        },
    ]
});
