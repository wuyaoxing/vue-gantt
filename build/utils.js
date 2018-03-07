const path = require('path')
const config = require('../config')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

// 多页面配置
// var glob = require('glob')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const PAGE_PATH = path.resolve(__dirname, '../src/pages')
// var merge = require('webpack-merge')

const fs = require('fs')

const isProd = process.env.NODE_ENV === 'production'

const cn = {
    gantt: 'Gantt Demo',
    test: '测试页面'
}
const en = {
    gantt: 'gantt',
    test: 'test'
}

const titleSource = config.build.lang === 'zh-CN' ? cn : en

const outputSource = {
    gantt: 'gantt.jsp',
    test: 'test.jsp',
}

// pages
const devPages = fs.readdirSync(PAGE_PATH).reduce((acc, filename) => {
    if (!/\.hbs$/.test(filename)) {
        acc.push({
            name: filename,
            title: titleSource[filename],
            // chunks: [filename],
            chunks: isProd ? ['manifest', 'vendor', filename] : [filename],
            output: outputSource[filename] // 打包输出文件
        })
    }
    return acc
}, [])

const prodIgnore = ['index']

const prodPages = devPages.filter(item => prodIgnore.indexOf(item.name))

const pages = isProd ? prodPages : devPages

exports.pages = pages

const chunksSort = orders => (chunk1, chunk2) => {
    // https://github.com/jantimon/html-webpack-plugin/issues/481
    const o1 = orders.indexOf(chunk1.names[0])
    const o2 = orders.indexOf(chunk2.names[0])
    return o1 - o2
}

// 多入口配置
exports.entries = () =>
    // var entryFiles = glob.sync(PAGE_PATH + '/*/*.js')
    // var map = {}
    // entryFiles.forEach((filePath) => {
    //     var filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'))
    //     map[filename] = filePath
    // })
    // console.log(entryFiles, map)
    // return map

     pages.reduce((acc, dir) => {
        const filename = dir.name
        acc[filename] = `${PAGE_PATH}/${filename}/index.js`
        return acc
    }, {})

// 多页面输出配置

const hbsSource = {
    gantt: `<div id="app"></div>`,
    test: `<div id="app"></div>`,
}

exports.htmlPlugin = () => {
    const layoutPath = `${PAGE_PATH}/layout.hbs`
    // const layoutHtml = fs.readFileSync(layoutPath, 'utf-8');
    return pages.map(item => {
        // const pagePath = `${PAGE_PATH}/${item.name}/index.hbs`
        // const pageHtml = fs.readFileSync(pagePath, 'utf-8');

        // const tpl = layoutHtml.replace(/\{\{\{body\}\}\}/, pageHtml)
        const options = {
            title: item.title,
            filename: `pages/${item.output || `${item.name}.html`}`,
            content: hbsSource[item.name],
            template: layoutPath,
            inject: true,
            chunks: item.chunks,
            // chunksSortMode: chunksSort(item.chunks),
            isProd: true
        }
        if (isProd) {
            Object.assign(options, {
                minify: {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true
                },
                chunksSortMode: 'dependency'
            })
        }
        return new HtmlWebpackPlugin(options)
    })

    // let entryHtml = glob.sync(PAGE_PATH + '/*/*.html')
    // let arr = []
    // entryHtml.forEach((filePath) => {
    //     let filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'))
    //     let conf = {
    //         title: filename,
    //         template: filePath,
    //         filename: filename + '.html',
    //         chunks: ['manifest', 'vendor', filename],
    //         inject: true,

    //         // filename: `page/${filename}.jsp`,
    //     }
    //     if (isProd) {
    //         conf = merge(conf, {
    //             minify: {
    //                 removeComments: true,
    //                 collapseWhitespace: true,
    //                 removeAttributeQuotes: true
    //             },
    //             chunksSortMode: 'dependency'
    //         })
    //     }
    //     arr.push(new HtmlWebpackPlugin(conf))
    // })
    // return arr
}

exports.assetsPath = function (_path) {
    let assetsSubDirectory = isProd
        ? config.build.assetsSubDirectory
        : config.dev.assetsSubDirectory
    return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function (options) {
    options = options || {}

    let cssLoader = {
        loader: 'css-loader',
        options: {
            minimize: isProd,
            sourceMap: options.sourceMap
        }
    }

    // generate loader string to be used with extract text plugin
    function generateLoaders(loader, loaderOptions) {
        var loaders = [cssLoader]
        if (loader) {
            loaders.push({
                loader: loader + '-loader',
                options: Object.assign({}, loaderOptions, {
                    sourceMap: options.sourceMap
                })
            })
        }

        // Extract CSS when that option is specified
        // (which is the case during production build)
        if (options.extract) {
            return ExtractTextPlugin.extract({
                use: loaders,
                fallback: 'vue-style-loader'
            })
        }
            return ['vue-style-loader'].concat(loaders)

    }

    // https://vue-loader.vuejs.org/en/configurations/extract-css.html
    return {
        css: generateLoaders(),
        postcss: generateLoaders(),
        less: generateLoaders('less'),
        sass: generateLoaders('sass', { indentedSyntax: true }),
        scss: generateLoaders('sass'),
        stylus: generateLoaders('stylus'),
        styl: generateLoaders('stylus')
    }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
    let output = []
    let loaders = exports.cssLoaders(options)
    for (let extension in loaders) {
        let loader = loaders[extension]
        output.push({
            test: new RegExp(`\\.${  extension  }$`),
            use: loader
        })
    }
    return output
}
