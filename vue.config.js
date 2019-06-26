const fs = require('fs')
const path = require('path')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')

const resolve = dir => path.join(__dirname, '', dir)

const isDevMode = process.env.NODE_ENV === 'development'

const publicPath = isDevMode ? '/' : './'
const pagesDir = './src/pages'
const entrys = fs.readdirSync(pagesDir)

console.log('页面入口：', entrys)

const pages = entrys.reduce((acc, name) => {
    acc[name] = {
        entry: `${pagesDir}/${name}/index.js`,
        filename: `${name}.html`,
        title: `gantt-${name}`,
        chunks: ['chunk-vendors', 'chunk-common', name]
    }
    return acc
}, {})

const rewrites = entrys.map(name => ({
    from: `/${name}`,
    to: path.posix.join(publicPath, `/${name}.html`)
}))

module.exports = {
    publicPath,
    outputDir: 'dist',
    assetsDir: '',
    pages,
    // productionSourceMap: false,
    css: {
        loaderOptions: {
            css: {
                localIndentName: isDevMode ? '[folder]-[name]-[local]' : '[hash:5]'
            },
            less: {
                javascriptEnabled: true
            }
        }
    },
    configureWebpack: config => {
        config.devtool = 'source-map'
        config.resolve.modules.unshift(resolve('src'))
        config.plugins.push(new LodashModuleReplacementPlugin())
    },
    devServer: {
        port: 9000,
        open: true,
        historyApiFallback: {
            disableDotRule: true,
            rewrites
        }
        // proxy: 'http://localhost:9000'
    }
}
