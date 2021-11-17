const path = require('path')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  resolve: {
    extensions: ['.ts'],
    plugins: [new TsconfigPathsPlugin({ configFile: './tsconfig.json' })],
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd',
    library: 'its-on-client',
    umdNamedDefine: true,
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
}
