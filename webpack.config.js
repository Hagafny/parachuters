var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        game: "./src/game.js"
    },

    output: {
        path: __dirname + "/dist/",
        filename: "[name].bundle.js"
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
            {
                test: /\.css$/,
                loader: "style!css"
            },
            {
                test: /\.(png|jpg)$/,
                loader: 'url-loader?limit=5000&name=img/img-[hash:6].[ext]'
            } // inline base64 URLs for <=5k images, direct URLs for the rest           
        ]
    },
    jshint: {
        esversion: 6
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "Parachuters"
        })
    ]
};