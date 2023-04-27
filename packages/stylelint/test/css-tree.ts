/* eslint-disable no-console */
import cssTree from 'css-tree';

{
    const ast = cssTree.parse('1px   2em var(--var) 20%', { context: 'value' });
    console.log(JSON.stringify(ast, null, 2));
}
