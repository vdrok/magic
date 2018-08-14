const path = require('path');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
module.exports = {
    entry: [
        'babel-polyfill',
        path.join(__dirname, '../../app/web/index'),
    ],
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, '../public'),
    },

    resolve: {
        alias: {
            webworkify: 'webworkify-webpack-dropin'
        }
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader"
                    },
                    {
                        loader: "sass-loader"
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader"
                    }
                ]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['babel-preset-es2015', 'babel-preset-react'],
                        plugins: ['transform-class-properties']
                    }
                },
            },
            {
                test: /\.(jpg|png|svg|mp4|eot)$/,
                use: {
                    loader: 'file-loader'
                }
            }
        ]
    },
    devServer: {
        contentBase: "./web/public",
        historyApiFallback: true

    },
    devtool: 'inline-source-map',
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('dev'),
            'process.env.PLATFORM_ENV': JSON.stringify('web'),
        }),
        new webpack.ProvidePlugin({
            videojs: "video.js",
            "window.videojs": "video.js"
        }),
        new Dotenv()
        //  new webpack.NamedModulesPlugin(),
        //  new webpack.HotModuleReplacementPlugin(),
        //  new DashboardPlugin(),
    ],
};