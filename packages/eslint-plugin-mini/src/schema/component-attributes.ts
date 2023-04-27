import basic from './component/basic';
import form from './component/form';
import media from './component/media';
import navigator from './component/navigator';
import view from './component/view';
import map from './component/map';
import open from './component/open';
import page from './component/page';
import reference from './component/reference';

// https://developers.weixin.qq.com/miniprogram/dev/component/

export const commonAttributes = {
    class: {
        type: 'string'
    },
    style: {
        type: 'string'
    },
};

export const commonEvents = {
    tap: {
        type: 'string'
    },
};

// aria
export const ariaAttributes = {
    'aria-hidden': {
        type: 'boolean'
    },
    'aria-role': {
        type: 'string',
        enum: [
            'article',
            'button',
            'cell',
            'checkbox',
            'columnheader',
            'combobox',
            'command',
            'definition',
            'figure',
            'form',
            'grid',
            'gridcell',
            'group',
            'heading',
            'img',
            'link',
            'list',
            'listbox',
            'listitem',
            'menuitem',
            'navigation',
            'option',
            'radio',
            'region',
            'roletype',
            'row',
            'rowgroup',
            'rowheader',
            'searchbox',
            'separator',
            'table',
            'term',
            'textbox'
        ]
    },
    'aria-label': {
        type: 'string'
    },
    'aria-checked': {
        type: 'boolean'
    },
    'aria-disabled': {
        type: 'boolean'
    },
    'aria-describedby': {
        type: 'string'
    },
    'aria-expanded': {
        type: 'boolean'
    },
    'aria-haspopup': {
        enum: [false, true, 'menu', 'listbox', 'tree', 'grid', 'dialog']
    },
    'aria-selected': {
        type: 'boolean'
    },
    'aria-required': {
        type: 'boolean'
    },
    'aria-orientation': {
        type: 'string',
        enum: ['vertical', 'undefined', 'horizontal']
    },
    'aria-valuemin': {
        type: 'number'
    },
    'aria-valuemax': {
        type: 'number'
    },
    'aria-valuenow': {
        type: 'number'
    },
    'aria-readonly': {
        type: 'boolean'
    },
    'aria-multiselectable': {
        type: 'boolean'
    },
    'aria-controls': {
        type: 'string'
    },
    'tabindex': {
        type: 'number'
    },
    'aria-labelledby': {
        type: 'string'
    }
};

// interface AttributeNode {
//     type?: 'string';
//     enum?: string[];
// }
// interface NodeAttributes {
//     type?: 'string';
//     properties: AttributeNode;
//     required?: string[];
// }
// TODO: use specific type instead of any
export const componentAttributes = {
    ...basic,
    ...form,
    ...media,
    ...navigator,
    ...view,
    ...map,
    ...open,
    ...page,
    ...reference
} as Record<string, any>;

