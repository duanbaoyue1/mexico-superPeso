module.exports = {
  plugins: {
    'postcss-px-to-viewport': {
      unitToConvert: 'px', // 需要转换的单位，默认为"px"
      viewportWidth: 375, // 设计稿的视口宽度
      unitPrecision: 5, // 单位转换后保留的精度
      propList: ['*'], // 能转化为vw的属性列表
      viewportUnit: 'vw', // 希望使用的视口单位
      fontViewportUnit: 'vw', // 字体使用的视口单位
      selectorBlackList: ['.ignore-', '.hairlines'], //指定不转换为视窗单位的类，可以自定义，可以无限添加,建议定义一至两个通用的类名
      minPixelValue: 1, // 小于或等于`1px`不转换为视窗单位，你也可以设置为你想要的值
      mediaQuery: false, // 允许在媒体查询中转换`px`
      replace: true, // 是否直接更换属性值，而不添加备用属性
      exclude: [
      ], //忽略某些文件夹下的文件或特定文件，例如 'node_modules' 下的文件
      include: undefined, // 如果设置了include，那将只有匹配到的文件才会被转换
      landscape: true, //是否添加根据 landscapeWidth 生成的媒体查询条件 @media (orientation: landscape)
      landscapeUnit: 'vw', //横屏时使用的单位
      landscapeWidth: 667 //横屏时使用的视口宽度
    }
  }
}