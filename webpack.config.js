var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: "./src/game.js",
    output: {
        path: __dirname + "/src/",
        filename: "bundle.js"
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                include: path.join(__dirname, 'src'),
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            },
            { 
                test: /\.css$/, 
                loader: "style!css" }
        ]
    }
};