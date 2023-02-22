const path = require('path');
const webpack = require('webpack');
console.log('test test test', process.env)
module.exports = {
  entry: './src/index.tsx',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css?$/,
        use: 'css-loader',
        exclude: /node_modules/,
      },
    ],
  },
  mode: 'production',
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.css'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [    
    new webpack.DefinePlugin({              
      'process.env.WS_HOST': JSON.stringify(process.env.WS_HOST),
    })
  ],
};
