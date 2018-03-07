// see http://vuejs-templates.github.io/webpack for documentation.
const path = require('path')

module.exports = {
    build: {
        env: require('./prod.env'),
        port: 9000,
        autoOpenBrowser: true,
        index: path.resolve(__dirname, '../public/index.html'), // 编译输入的 index.html 文件
        assetsRoot: path.resolve(__dirname, '../public'), // 编译输出的静态资源路径
        assetsSubDirectory: '', // 编译输出的二级目录
        assetsPublicPath: process.env.npm_config_publish ? '//cdn.easypm.cn/pub/' : '/resources/', // 编译发布的根目录，可配置为资源服务器域名或 CDN 域名
        productionSourceMap: true, // 是否开启 cssSourceMap
        // Gzip off by default as many popular static hosts such as
        // Surge or Netlify already gzip all static assets for you.
        // Before setting to `true`, make sure to:
        // npm install --save-dev compression-webpack-plugin
        productionGzip: true, // 是否开启 gzip
        productionGzipExtensions: ['js', 'css'], // 需要使用 gzip 压缩的文件扩展名
        // Run the build command with an extra argument to
        // View the bundle analyzer report after build finishes:
        // `npm run build --report`
        // Set to `true` or `false` to always turn it on or off
        bundleAnalyzerReport: process.env.npm_config_report,
        lang: 'zh-CN'
    },
    dev: {
        env: require('./dev.env'),
        port: 9090,
        autoOpenBrowser: true,
        assetsSubDirectory: '',
        assetsPublicPath: '/',
        proxyTable: {
            // '*': {
            //     target: 'http://192.168.0.2:8080',
            //     logLevel: 'debug',
            //     changeOrigin: true,
            //     onProxyRes(proxyRes, req, res) {
            //         var _location = proxyRes.headers['location'];
            //         if (_location) {
            //             console.log("_location:" + _location)
            //             proxyRes.headers['location'] = _location.replace('http://192.168.0.2:8080' + '/', '/')
            //         }
            //     },
            //     filter: function (pathname, req) {
            //         const pathRegexp = /^\/.*\.(js|json)$|^\/images\/.*$|^\/src\/.*$|^\/__webpack_hmr$|^\/reload\/reload.js$/;
            //         var ret = pathRegexp.test(pathname)
            //         if (ret) {
            //             console.log("   local get: " + pathname)
            //         }
            //         return !ret
            //     }
            // }
        },
        // CSS Sourcemaps off by default because relative paths are "buggy"
        // with this option, according to the CSS-Loader README
        // (https://github.com/webpack/css-loader#sourcemaps)
        // In our experience, they generally work as expected,
        // just be aware of this issue when enabling this option.
        cssSourceMap: false
    }
}
