const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = (env, args) => {
  return {
    mode: args.mode ?? 'production',
    entry: './src/main.ts',
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: '[name].js',
    },
    experiments: {
      asyncWebAssembly: true,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: [/node_modules/],
        },
        {
          test: /\.css$/i,
          use: [
            'style-loader',
            'css-loader'
          ],
        },
      ],
    },
    resolve: {
      alias: {
        '@app': path.resolve(__dirname, './src'),
      },
      extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './index.html',
      }),
      new ESLintPlugin({
        extensions: ['js', 'ts', 'tsx'],
        exclude: ['node_modules', 'build'],
      }),
    ],
    devServer: {
      static: {
        directory: path.join(__dirname, '.'),
        publicPath: '/build',
      },
      watchFiles: ['./src/*', './index.html'],
      devMiddleware: {
        mimeTypes: {
          phtml: 'text/html',
          css: 'text/css',
        },
      },
    },
    ignoreWarnings: [/warning/],
  };
};
