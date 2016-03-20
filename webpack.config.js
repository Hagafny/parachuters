var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin'); //This plugin will generate an html page in the dist location

module.exports = {
    entry: {
        game: "./src/game.js" // the key 'game' is used in the output script- game.bundle.js
    },
    output: {
        path: __dirname + "/dist/",
        filename: "[name].bundle.js"
    },
    module: {
        preLoaders: [
            { //preload jshint
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'jshint-loader',
            }
        ],
        loaders: [
            { // load babel with ES2015
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            },
            { // Work with css
                test: /\.css$/,
                loader: "style!css"
            },
            { // Work with images. This loader checks and if the file is less than 5k it will convert to Base64. If he's bigger, it will move the file
              // to a dist folder under the name= address.
                test: /\.(png|jpg)$/,
                loader: 'url-loader?limit=5000&name=img/img-[hash:6].[ext]'
            } // inline base64 URLs for <=5k images, direct URLs for the rest           
        ]
    },
    //jshint configuration. let jshint know we're working with es2015.
    jshint: {
        esversion: 6
    },
    //add the html plugin to create an index file on dist location.
    plugins: [
        new HtmlWebpackPlugin({
            title: "Parachuters"
        })
    ]
};