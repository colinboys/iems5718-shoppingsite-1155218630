// vue.config.js
module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
    lintOnSave: false,
    devServer: {
      proxy: {
          '/api': {
            //   target: 'http://13.215.48.147:8000',
              target: 'http://localhose:8000',
              changeOrigin: true,
              pathRewrite: {
                  '/api': ''
              }
          }
      }
  }

  };