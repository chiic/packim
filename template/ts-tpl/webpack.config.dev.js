const merge = require('webpack-merge')
const common = require('./webpack.config.base');
const path = require('path');
const webpack = require('webpack');

module.exports = merge(common, {
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000
    },
    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ]
})