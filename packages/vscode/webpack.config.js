// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

const config = {
    target: 'node',
    entry: {
        client: './src/client',
        server: './src/server'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        // filename: 'extension.js',
        libraryTarget: 'commonjs2',
        devtoolModuleFilenameTemplate: '../[resource-path]'
    },
    devtool: 'source-map',
    externals: {
        // the vscode-module is created on-the-fly and must be excluded. Add other modules that cannot be webpack'ed,
        // -> https://webpack.js.org/configuration/externals/
        vscode: 'commonjs vscode'
    },
    resolve: {
        // support reading TypeScript and JavaScript files, 📖 -> https://github.com/TypeStrong/ts-loader
        extensions: ['.ts', '.js']
    },
    module: {
        exprContextCritical: false,
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader'
                    }
                ]
            }
        ]
    }
};
module.exports = config;
