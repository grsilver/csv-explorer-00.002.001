var path = require("path");
//cd /mnt/c/dev/SSDQuery/v.00.002.001
//package.json has build and dev
//npm run build_webpack
//npm run build_server
//npm run webpack_and_server
// cd /Users/gsilvestri/galendev/ssd-explorer-00.002.001

module.exports = {
  entry: {
    app: './client.js.src/main.js',
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './client.dist'
  },
  plugins: [
    //new CleanWebpackPlugin(['dist']),
    //new HtmlWebpackPlugin({
    //  title: 'Development 111'
    //})
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'client.dist')
  }
};
