import fs from 'fs';
import path from 'path';

import utils from '../utils';

const getAppJsonPath = (sourceDir: string): string | null => {
    const parentPath = path.dirname(sourceDir);
    if (parentPath === '/' || !fs.existsSync(parentPath)) {
        return null;
    }

    const srcUrl = path.join(parentPath, 'app.json');

    if (fs.existsSync(srcUrl)) {
        return parentPath;
    }
    return getAppJsonPath(parentPath);
};

export default {
    meta: {
        docs: {
            description: 'check the src file exists',
            categories: ['essential'],
            url: utils.getRuleUrl('resolve-src')
        },
        messages: {
            unexpected: 'check if the src file referenced by the labels of <import> <include> & <wxs> exists'
        },
        schema: []
    },

    create(context) {
        return utils.defineTemplateBodyVisitor(context, {
            ['XStartTag[parent.name = "import"],'
                + 'XStartTag[parent.name = "include"],'
                + 'XStartTag[parent.name = "wxs"]'
            ](node: XStartTag) {

                const attribute = node.attributes.find(attr => attr.key.name === 'src');
                if (!attribute) {
                    return;
                }

                const sourceFilePath = context.getFilename();
                const sourceDir = path.dirname(sourceFilePath);

                if (utils.getValueType(attribute) !== 'literal' || utils.isEmptyValueLiteral(attribute)) {
                    return context.report({
                        node: attribute,
                        loc: attribute.loc,
                        message: 'src value should be literal text.'
                    });
                }

                const srcValue = (attribute.value[0] as XLiteral | XMustache).value;
                let resolvedPath = '';

                if (srcValue.startsWith('/')) {
                    if (node.parent.name === 'wxs') {
                        return context.report({
                            node: attribute,
                            loc: attribute.loc,
                            message: 'The wxs src path to \'{{srcValue}}\' shouldn\'t be absolute.',
                            data: { srcValue }
                        });
                    }
                    const appDir = getAppJsonPath(sourceDir);
                    resolvedPath = appDir ? path.join(appDir, srcValue) : resolvedPath;

                }
                else {
                    resolvedPath = path.join(sourceDir, srcValue);
                }

                const isExist = fs.existsSync(resolvedPath);
                if (!isExist) {
                    context.report({
                        node: attribute,
                        loc: attribute.loc,
                        message: 'Unable to resolve the src path to \'{{srcValue}}\'.',
                        data: { srcValue }
                    });
                }
            }
        });
    }
} as RuleModule;
