/**
 * @file webpack config
 */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const mewLoader = require.resolve('../../lib');
const baseDir = path.resolve(__dirname);

module.exports = {
    mode: 'production',
    entry: `${ baseDir }/src/index.js`,
    output: {
        filename: '[name].js',
        path: `${ baseDir }/dist`
    },
    module: {
        rules: [
            {
                test: /\.js|jsx$/,
                use: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: 'css-loader'
            },
            {
                test: /\.unknown$/,
                use: 'file-loader'
            },
            {
                test: /\.(less|css|js|jsx|vue|unknown)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: mewLoader,
                        options: {
                            failOnError: true,
                            failOnWarning: false
                        }
                    }
                ]
            },
        ]
    },
    plugins: [
        // 入口文件
        new HtmlWebpackPlugin({
            template: path.resolve(`${ baseDir }/public/index.html`),
            filename: 'index.html'
        }),
    ]
};
