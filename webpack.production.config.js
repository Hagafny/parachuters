var WebpackStripLoader = require('strip-loader'); //strip-loader removes whatever we want.
var devConfig = require('./webpack.config.js'); //get the develpoment webpack config.

//create loader configuration.
var stripLoader = {
 test: /\.js$/,
 exclude: /node_modules/,
 loader: WebpackStripLoader.loader('console.log') //remove console.log across all files.
}

devConfig.module.loaders.push(stripLoader); //push the loader
module.exports = devConfig; 