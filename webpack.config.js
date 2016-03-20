var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: "./src/game.js",
    output: {
        path: __dirname + "/src/",
        filename: "bundle.js"
    },
    module: {
        preLoaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'jshint-loader',
            }
        ],
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            },
            { test: /\.css$/, loader: "style!css" }
        ]
    },
    watch: true,
    jshint: {
        esversion: 6
    }
};