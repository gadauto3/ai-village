const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: path.join(__dirname, "src", "index.js"),
  mode: 'development',
  output: {
    path:path.resolve(__dirname, "public"),
    filename: 'main.js'
  },
  module: {
    rules: [
      {
        test: /\.(png|jp(e*)g|svg|gif)$/i,
        exclude: /token32\.png$/i,
        use: 
        {
          loader: 'file-loader',
          options: {
            outputPath: 'images/',
          },
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "index.html"),
    }),
    new CopyPlugin({
      patterns: [
        { from: 'src/assets/images/icons', to: 'images' },  // copies all files from src/assets to outputDir/assets
        { from: 'src/assets/images/token32.png', to: 'token32.png' }
      ],
    }),
  ],
}
