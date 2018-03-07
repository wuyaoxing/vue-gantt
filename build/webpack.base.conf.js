const path = require('path')
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')

const resolve = dir => path.join(__dirname, '..', dir) // 绝对路径

module.exports = {
    // 入口
    entry: Object.assign({}, utils.entries()),
    // 输出
    output: {
        path: config.build.assetsRoot, // 编译输出的静态资源根路径
        filename: '[name].js', // 编译输出的文件名
        chunkFilename: '[name].js',
        // 正式发布环境下编译输出的上线路径的根路径
        publicPath: process.env.NODE_ENV === 'production'
            ? config.build.assetsPublicPath
            : config.dev.assetsPublicPath
    },
    resolve: {
        // 匹配目录
        modules: [
            resolve('src'),
            resolve('node_modules'),
        ],
        // 自动补全的扩展名
        extensions: ['.js', '.vue', '.json'],
        // 别名
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            fonts: 'assets/fonts',
            images: 'assets/images',
        }
    },
    module: {
        rules: [
            {
                test: /\.(js|vue)$/,
                loader: 'eslint-loader',
                enforce: 'pre',
                include: [resolve('src'), resolve('test')],
                options: {
                    formatter: require('eslint-friendly-formatter')
                }
            }, {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: vueLoaderConfig
            }, {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [resolve('src'), resolve('test')]
            }, {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'file-loader',
                include: resolve('src/assets/images'),
                options: {
                    name: utils.assetsPath('images/[name].[ext]')
                }
            }, {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'file-loader',
                exclude: resolve('src/assets/images'),
                options: {
                    name: utils.assetsPath('images/[name].[hash:7].[ext]')
                }
            },
            // {
            //     test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            //     loader: 'url-loader',
            //     include: resolve('src/static'),
            //     options: {
            //         limit: 10000,
            //         name: utils.assetsPath('img/[name].[hash:7].[ext]')
            //     }
            // },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('images/[name].[hash:7].[ext]')
                }
            }, {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('images/[name].[hash:7].[ext]')
                }
            }, {
                test: /\.hbs$/,
                loader: 'handlebars-loader'
            }
        ]
    }
}
