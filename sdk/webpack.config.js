const path = require('path');
var webpack = require('webpack');

module.exports = (env) => {
  const mode = env.TARGET_ENV === 'development' ? 'development' : 'production';

  return {
    mode: mode,
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          'TARGET_ENV': JSON.stringify(env.TARGET_ENV)
        }
      })
    ],
    entry: './src/index.js',
    output: {
      path: path.resolve('./build/'),
      filename: 'mo.sdk.js'
    },
    module: {
      rules: [{ 
        test: /\.js$/, 
        exclude: /node_modules/, 
        loader: "babel-loader" 
      }]
    }
  };
};
