require('./check-versions')() // 检查Node 和 npm版本

const config = require('../config')
const utils = require('./utils')
/**
 * 如果Node的环境无法判断当前环境
 * 则使用config.dev.env.NODE_ENV作为当前环境
 */
if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

const opn = require('opn') // A better node-open. Opens stuff like websites, files, executables. Cross-platform. 打开浏览器并跳转到指定url
const path = require('path') // NodeJS 自带的文件路径工具
const express = require('express')
const webpack = require('webpack')
const proxyMiddleware = require('http-proxy-middleware') // http代理
const webpackConfig = process.env.NODE_ENV === 'testing'
    ? require('./webpack.prod.conf')
    : require('./webpack.dev.conf')

const port = process.env.PORT || config.dev.port // 默认端口config.dev.port

const autoOpenBrowser = !!config.dev.autoOpenBrowser // 自动打开浏览器变量

// https://github.com/chimurai/http-proxy-middleware
const proxyTable = config.dev.proxyTable // 自定义HTTP代理proxyTable

const app = express() // 使用express启动一个服务
const compiler = webpack(webpackConfig) // 启动webpack进行编译

app.set('view engine', 'hbs') // 用hbs作为模板引擎
app.set('views', path.resolve(__dirname, '../src/pages')) // 模板所在路径

if (Object.keys(proxyTable).length) {

    // proxy api requests
    Object.keys(proxyTable).forEach(context => {
        let options = proxyTable[context]
        if (typeof options === 'string') {
            options = { target: options }
        }
        app.use(proxyMiddleware(options.filter || context, options))
    })
} else {

    app.get('/', (req, res) => {
        res.render('index', {
            pages: utils.pages,
            title: 'EasyPM-mobile',
        })
    })

    // css: ['/css/home.css', '/css/home_add.css'],
    // js: ['/js/home.js'],
    // name: "茄果", //这个是页面中用到的数据，与title同一性质
    // layout: true  //默认为true，设为false则不启用layout模板

    utils.pages.forEach(({ name, title, chunks }) => {
        app.get(`/${name}`, (req, res) => {
            res.render(`${name}/index`, {
                chunks: chunks,
                devMode: true,
                title
            })
        })
    })
}

// 启动webpack-dev-middleware将编译后的文件暂存到内存中，只能用于开发
const devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    noInfo: true,
    quiet: true,
    stats: {
        colors: true,
        chunks: false
    }
})

// 启动webpack-hot-middleware，热重载（hot reloading）
const hotMiddleware = require('webpack-hot-middleware')(compiler, {
    log: false,
    heartbeat: 2000
})

// 当html-webpack-plugin template changes强制刷新页面
compiler.plugin('compilation', compilation => {
    compilation.plugin('html-webpack-plugin-after-emit', (data, cb) => {
        hotMiddleware.publish({ action: 'reload' })
        cb()
    })
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
const staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

const uri = 'http://localhost:' + port

let _resolve
const readyPromise = new Promise(resolve => {
    _resolve = resolve
})

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
    console.log('> Listening at ' + uri + '\n')
    // when env is testing, don't need open it
    if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
        opn(uri)
    }
    _resolve()
})

const server = app.listen(port)

module.exports = {
    ready: readyPromise,
    close: () => {
        server.close()
    }
}
