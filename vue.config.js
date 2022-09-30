module.exports = {
  publicPath: './',

  // 前台不显示sourcemap
  productionSourceMap: false,  

  devServer: {
    proxy: {
      '^/userreg': {
        target: 'http://8.131.94.90',
        ws: true,
        changeOrigin: true,
      },
    },
  },
};
