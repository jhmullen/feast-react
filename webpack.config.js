var HTMLWebpackPlugin = require("html-webpack-plugin");
var HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
  template: __dirname + "/app/index.html",
  filename: "index.html",
  inject: "body"
});

module.exports = {
  entry: __dirname + "/app/index.js",
  module: {
    loaders: [
      {
        test: /\.js$|\.jsx$/,
        loader: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: ["file-loader?outputPath=static/"]
      }
    ]
  },
  output: {
    filename: "transformed.js",
    path: __dirname + "/build"
  },
  resolve: {
    extensions: ['.jsx', '.js']
  },
  plugins: [HTMLWebpackPluginConfig]
};