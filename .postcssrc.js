module.exports = {
  plugins: {
    'postcss-px2rem-include': {
      remUnit: 37.5,
      include: /(components\/m\/|views\/m\/)/i
    }
  }
};
