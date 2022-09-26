module.exports = {
  publicPath: './',

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
