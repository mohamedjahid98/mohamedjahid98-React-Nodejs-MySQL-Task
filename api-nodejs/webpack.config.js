const path = require('path');
const nodeExternals = require('webpack-node-externals');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'production',
    target: 'node',
    entry: './src/server.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'server.js',
    },
    resolve: {
        extensions: ['.js'],
    },
    externals: [nodeExternals()],
    plugins: [

        new CleanWebpackPlugin(),

        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'prisma'),
                    to: path.resolve(__dirname, 'dist/prisma'),
                },
                {
                    from: path.resolve(__dirname, '.env'),
                    to: path.resolve(__dirname, 'dist'),
                },
                {
                    from: path.resolve(__dirname, 'package.json'),
                    to: path.resolve(__dirname, 'dist/package.json'),
                },
            ],
        }),
    ],
};
