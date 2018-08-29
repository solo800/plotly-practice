const path = require('path');
const HtmlWP = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: {
        app: './src/index.js',
    },
    output: {
        path: path.resolve('./dist'),
        filename: '[name].js',
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loaders: ['babel-loader', 'eslint-loader', ],
                exclude: /node_modules/,
            },
            {
                test: /\.css|\.scss/,
                loaders: ExtractTextPlugin.extract('css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!sass-loader'),
                exclude: /node_modules/,
            },
        ]
    },
    plugins: [
        new HtmlWP({
            template: './src/index.html',
            filename: 'index.html',
            inject: 'body',
        }),
        new ExtractTextPlugin('styles.css'),
    ],
    watchOptions: {
        poll: true,
    },
};