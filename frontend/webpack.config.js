const path = require('path');
const webpack = require('webpack');

module.exports(env) = {
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
      'process.env.WS_HOST': JSON.stringify(env.WS_HOST),
    })
  ],
};
