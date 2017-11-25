const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './app/js/app.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'app.js'
  },
  plugins: [
    // Copy our app's index.html to the build folder.
    new CopyWebpackPlugin([
      { from: './app/index.html', to: "index.html" },
      { from: './app/home.html', to: "home.html" },
      { from: './app/earn.html', to: "earn.html" },
      { from: './app/earn-success.html', to: "earn-success.html" },
      { from: './app/earn-cashier-review.html', to: "earn-cashier-review.html" },
      { from: './app/redeem.html', to: "redeem.html" },
      { from: './app/redeem-success.html', to: "redeem-success.html" },
      { from: './app/redeem-user-review.html', to: "redeem-user-review.html" }
    ])
  ],
  module: {
    rules: [
      {
       test: /\.css$/,
       use: [ 'style-loader', 'css-loader' ]
      }
    ],
    loaders: [
      { test: /\.css$/, loader: "style-loader!css-loader" },
      { test: /\.json$/, use: 'json-loader' },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015'],
          plugins: ['transform-runtime']
        }
      }
    ]
  }
}
