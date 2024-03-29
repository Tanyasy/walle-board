module.exports = {

    css: {
        loaderOptions: {
            sass: {
                prependData: `@import "~@/assets/scss/style.scss";`
            }
        }
    }
}

const path = require('path')
console.log(path)
function resolve(dir) {
  return path.join(__dirname, '.', dir)
}
module.exports = {
  chainWebpack: config => {
    config.module.rules.delete("svg"); //重点:删除默认配置中处理svg,
    config.module
      .rule('svg-sprite-loader')
      .test(/\.svg$/)
      .include
      .add(resolve('./src/icons')) //处理svg目录
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
  },
    configureWebpack:{
        module: {
            rules: [
                {
                    test: /\.mjs$/,
                    include: /node_modules/,
                    type: "javascript/auto"
                },
            ]
        }
    },
    devServer: {
        port: 8081
    }
}