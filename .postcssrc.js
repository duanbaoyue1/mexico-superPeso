module.exports = {
  plugins: {
    'postcss-px2rem-include': {
      remUnit: 36,
      include: /(components[\\/]|views[\\/])/i
    }
  }
};
