// vue.config.js
module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? '/iems5718-shoppingsite-1155218630/' : '/',
    lintOnSave: false,
    devServer: {
      proxy: {
          '/api': {
              target: 'http://localhost:8000',
              changeOrigin: true,
              pathRewrite: {
                  '/api': ''
              }
          }
      }
  }

  };