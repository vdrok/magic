const path = require('path');
const webpack = require('webpack');
const CompressionPlugin = require("compression-webpack-plugin");


module.exports = {
    devtool: [
        'eval',
    ],
    entry: [
        'babel-polyfill',
        path.join(__dirname, '../../app/web/index'),
    ],
    output: {
        path: path.join(__dirname, '../public'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    module: {
        loaders: [
            // take all less files, compile them, and bundle them in with our js bundle
            {
                test: /\.scss$/,
                loaders: ["style-loader", "css-loader", "sass-loader"],
            },{
                test: /\.json$/,
                loader: "json",
            }, {
                test: /\.css$/,
                loader: "style-loader!css-loader" }
            ,{
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'react'],
                    plugins: ['transform-class-properties'],
                },
            },
            {
                test: /\.(ttf|woff|woff2|svg)$/,
                loader: "url-loader", // or directly file-loader
                include: [
                    path.resolve(__dirname, "node_modules/react-native-vector-icons"),
                    path.resolve(__dirname, "node_modules/video.js"),
                ],
            },
            {
                test: /\.(jpg|png|svg|mp4|eot)$/,
                loader: 'file-loader'
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify('production'),
                'process.env.PLATFORM_ENV': JSON.stringify('web'),
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,   // enable source maps to map errors (stack traces) to modules
            output: {
                comments: false, // remove all comments
            },
        }),
        new CompressionPlugin(),
    ],
};
