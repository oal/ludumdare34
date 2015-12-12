'use strict';

var webpack = require('webpack');
var path = require('path');

module.exports = {
	entry: './src/game.js',
	output: {
		filename: 'dist/game.js'
	},
	node: {
		fs: 'empty'
	},
	//devtool: 'source-map',
	module: {
		loaders: [
			{
				test: /\.js$/,
				loader: 'babel',
				query: {
					// https://github.com/babel/babel-loader#options
					cacheDirectory: true,
					presets: ['es2015']
				}
			}
		]
	}
};