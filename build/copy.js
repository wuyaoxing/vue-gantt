require('shelljs/global')
const path = require('path')
const config = require('../config')
/**
 * 复制前端打包文件到 java 对应目录
 */

// 目标路径
const prjPath = path.join(__dirname, '..')
const sourceDir = path.join(prjPath, '../resources/static/resources/mobile')
const pagePath = path.join(prjPath, '../webapp/WEB-INF/views/mobile/pub')

// 原始路径
// const distDir = path.join(prjPath, config.build.assetsRoot)
const distDir = config.build.assetsRoot + '/'

cp('-R', distDir + '!pages', sourceDir)
cp('-R', distDir + 'pages/*.*', pagePath)

console.log('Copy Success！')
