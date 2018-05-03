// load the needed node modules
import path from 'path'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import webpack from 'webpack'
import 'babel-polyfill'

const extractCss = new MiniCssExtractPlugin({
  filename: 'css/[name].css',
  chunkFilename: '[id].css',
})

// webpack project settings
const config = (env, argv) => ({
  context: path.join(__dirname, 'src'),
  entry: [
    'babel-polyfill',
    path.join(__dirname, 'src/index.jsx'),
    path.join(__dirname, 'assets/scss/main.scss'),
  ],
  devtool: argv.mode === 'production' ? '' : 'inline-source-map',
  output: {
    path: path.resolve(__dirname, 'build/public/assets'),
    publicPath: '/public/assets/',
    pathinfo: argv.mode === 'development',
    filename: 'js/[name].js?[hash:8]',
    chunkFilename: 'js/[name].js?[hash:8][chunkhash:8]',
    // Point sourcemap entries to original disk location (format as URL on Windows)
    devtoolModuleFilenameTemplate: info =>
      path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
  },
  resolve: {
    // Allow absolute paths in imports, e.g. import Button from 'components/Button'
    // Keep in sync with .eslintrc
    modules: [
      path.resolve(__dirname, 'src'),
      path.resolve(__dirname, 'assets'),
      path.resolve(__dirname, 'assets/scss'),
      path.resolve(__dirname, 'assets/img'),
      path.resolve(__dirname, 'node_modules'),
    ],
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    extractCss,
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV_STRING: argv.mode === 'production' ? '"development"' : '"production"',
        NODE_ENV: JSON.stringify(argv.mode),
        DEBUG: JSON.stringify(process.env.DEBUG),
        BROWSER: true,
      },
    }),
  ],
  module: {
    // Make missing exports an error instead of warning
    strictExportPresence: true,
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env', 'react', 'stage-2'],
          },
        },
      },

      // Rules for Style Sheets
      {
        test: /\.(scss|sass)$/,
        include: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'assets/scss')],
        use: [
          { loader: MiniCssExtractPlugin.loader },
          // Process internal/project styles (from assets/scss folder)
          {
            loader: 'css-loader',
            options: {
              sourceMap: argv.mode === 'development',
              localIdentName: argv.mode === 'development'
                ? '[name]-[local]-[hash:base64:5]'
                : '[hash:base64:5]',
            },
          },
          { loader: 'sass-loader', options: { sourceMap: argv.mode === 'development' } },
        ],
      },
      // Rules for images
      {
        test: /\.(png|jpg|gif|svg)$/,
        include: [path.resolve(__dirname, 'assets/img')],
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'img/[name].[ext]',
            },
          },
        ],
      },
    ],
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        js: {
          test: /\.js$/,
          name: 'main',
        },
        css: {
          test: /\.(css|sass|scss)$/,
          name: 'main',
        },
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
        },
      },
    },
  },
})

export default [config]
