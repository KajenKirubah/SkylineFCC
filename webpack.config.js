const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizePlugin = require('css-minimizer-webpack-plugin');

const currentTask = process.env.npm_lifecycle_event;

const PostCSSPlugins = [
    require('postcss-simple-vars'),
    require('postcss-mixins'),
    require('postcss-nested'),
    require('postcss-import'),
    require('autoprefixer')
];

module.exports = {
    mode: "development",
    entry: {
        app: './app/scripts/App.js'
    },
    output: {
        path: path.resolve(__dirname, 'docs'),
        filename: '[name].[contenthash].js',
        chunkFilename: '[name].[contenthash].js',
        clean: true
    },
    plugins: [
        new HtmlWebpackPlugin({filename: 'index.html', template: './app/index.html'}),
        new MiniCssExtractPlugin({filename: 'styles.[contenthash].css'})
    ],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [
                    currentTask == "build" ? MiniCssExtractPlugin.loader : "style-loader",
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: PostCSSPlugins
                            }
                        }
                    }
                ]
            }
        ]
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            minSize: 1000
        },
        minimize: true,
        minimizer: [`...`, new CssMinimizePlugin()]
    },
    devServer: {
        watchFiles: ["./app/**/*.html"],
        static: {
            directory: path.resolve(__dirname, 'docs'),
        },
        hot: true,
        port: 3000
    }
}