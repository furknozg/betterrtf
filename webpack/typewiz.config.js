const path = require('path');
const webpackMerge = require('webpack-merge');
const merge = webpackMerge.merge || webpackMerge;
const baseConfig = require('./base.config.js');

module.exports = merge(baseConfig, {
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: [{
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: true
                    }
                }, 'typewiz-webpack'],
                include: [
                    path.resolve(__dirname, "../src"),
                    path.resolve(__dirname, "../node_modules/codepage")
                ]
            }
        ]
    }
});
