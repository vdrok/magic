const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');


module.exports = {
    devtool: [
        'cheap-module-eval-source-map',
        'cheap-module-source-map'
    ],
    entry: [
        'webpack-hot-middleware/client',
        'babel-polyfill',
        path.join(__dirname, '../../app/web/index'),
      //  path.join(__dirname, '../../app/web/scss/libs.scss'),
      //  path.join(__dirname, '../../app/web/scss/main.scss'),
    ],
    devServer: {
        historyApiFallback: true,
        disableHostCheck: true,
        hot: true,
    },
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
                    plugins: ['transform-class-properties',['react-transform', {
                        transforms: [{
                            transform: 'react-transform-hmr',
                            imports: ['react'],
                            // this is important for Webpack HMR:
                            locals: ['module']
                        }],
                    }]],
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
                'process.env.NODE_ENV': JSON.stringify('dev'),
                'process.env.PLATFORM_ENV': JSON.stringify('web'),
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
    ],
};
