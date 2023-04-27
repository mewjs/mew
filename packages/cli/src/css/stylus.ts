import syntax from 'postcss-syntax';
import stylus from 'postcss-styl';

export const parser = syntax({ stylus });
// eslint-disable-next-line import/no-commonjs
module.exports = parser;
export default parser;
