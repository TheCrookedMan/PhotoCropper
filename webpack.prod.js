const path = require('path')

module.exports = {
  mode: "production",
  entry: './src/main.js',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module:{
    rules: [{
      test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif|jpeg)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 8192
          }
        }]
    },
    {
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
          plugins: ['@babel/transform-runtime']
        }
      }
    },
  {
    test: /\.less$/,
    use: [{
      loader: "style-loader" // 将 JS 字符串生成为 style 节点
    }, {
      loader: "css-loader" // 将 CSS 转化成 CommonJS 模块
    }, {
      loader: "less-loader" // 将 Less 编译成 CSS
    }]
  }]
  }
};