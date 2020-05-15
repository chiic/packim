const merge = require('webpack-merge')
const common = require('./webpack.config.base');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = merge(common, {
    mode: 'production',
    devtool: 'source-map',
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                parallel: true
            })
        ],
        runtimeChunk: {
            name: entrypoint => `runtime-${entrypoint.name}`
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        })
    ],
    externals: {}
})