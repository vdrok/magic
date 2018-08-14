const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
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
            webworkify: 'webworkify-webpack-dropin',
            'videojs-contrib-hls': path.join(__dirname, '../../node_modules/videojs-contrib-hls/dist/videojs-contrib-hls.js')
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
                }
            },
            {
                test: /\.(jpg|png|svg|mp4|eot)$/,
                use: {
                    loader: 'file-loader'
                }
            }
        ]
    },
    devtool: 'source-map',
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
            'process.env.PLATFORM_ENV': JSON.stringify('web'),
            'typeof global': JSON.stringify('undefined'), //required for videojs-contrib-hls support
            'process.env.API_URL': JSON.stringify(process.env.API_URL),
            'process.env.FACEBOOK_APP_ID': JSON.stringify(process.env.FACEBOOK_APP_ID),
            'process.env.AWS_BUCKET': JSON.stringify(process.env.AWS_BUCKET),
            'process.env.ONESIGNAL_APP_ID': JSON.stringify(process.env.ONESIGNAL_APP_ID)
        }),
        new webpack.ProvidePlugin({
            videojs: "video.js",
            "window.videojs": "video.js"
        }),
        //  new webpack.NamedModulesPlugin(),
        // new DashboardPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress: false, // leave false for now. This breaks the videojs-contrib-hls package
            mangle: true,
        })
    ],
};