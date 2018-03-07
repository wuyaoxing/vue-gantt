const express = require('express')
const webpack = require('webpack')
const config = require('../config/index')
const opn = require('opn')

const webpackConfig = require('./webpack.prod.conf')

const app = express()
const compiler = webpack(webpackConfig)

const devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    quiet: true
})

app.use(devMiddleware)
app.use(express.static('./dist'))

const port = process.env.PORT || config.build.port
const autoOpenBrowser = config.build.autoOpenBrowser
const uri = 'http://localhost:' + port

module.exports = app.listen(port, (err) => {
    if (err) {
        console.log(err)
        return
    }
    console.log('Listening at ' + uri)

    if (autoOpenBrowser) {
        opn(uri)
    }
})
