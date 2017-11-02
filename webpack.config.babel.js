/*
 * Webpack config
 */
import path from 'path'
import webpack from 'webpack'
import 'babel-polyfill'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import CleanWebpackPlugin from 'clean-webpack-plugin'
import BundleAnalyzerPlugin from 'webpack-bundle-analyzer'

//
// Common configuration chunk to be used for both
// client-side (client.js) and server-side (server.js) bundles (eventually)
// -----------------------------------------------------------------------------

const isDebug = !process.argv.includes('--optimize-minimize')
const isVerbose =
  process.argv.includes('--verbose') || process.argv.includes('-d')
const isAnalyze =
  process.argv.includes('--analyze') || process.argv.includes('--analyse')

const kgnScript = /\.(js|jsx|mjs)$/
const kgnStyle = /\.(scss|sass)$/
const kgnImage = /\.(bmp|gif|jpg|jpeg|png|svg)$/

const staticAssetName = isDebug
  ? '[path][name].[ext]?[hash:8]'
  : '[hash:8].[ext]'

// CSS Nano options http://cssnano.co/
const minimizeCssOptions = {
  discardComments: { removeAll: true },
}

const extractSass = new ExtractTextPlugin({
  filename: '[name].css?[hash:8]',
  disable: process.env.NODE_ENV === 'development',
  allChunks: true,
})

// the path(s) that should be cleaned
const pathsToClean = [
  'build/public/**/*',
]

// the clean options to use
const cleanProjectConfig = {
  verbose: true,
  dry: false,
}

const config = {
  context: path.join(__dirname, 'src'),
  output: {
    path: path.resolve(__dirname, 'build/public/assets'),
    publicPath: '/build/public/',
    pathinfo: isVerbose,
    filename: isDebug ? '[name].js?[hash:8]' : '[name].js?[hash:8]',
    chunkFilename: isDebug
      ? '[name].chunk.js'
      : '[name].[chunkhash:8].chunk.js',
    // Point sourcemap entries to original disk location (format as URL on Windows)
    devtoolModuleFilenameTemplate: info =>
      path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
  },
  resolve: {
    // Allow absolute paths in imports, e.g. import Button from 'components/Button'
    // Keep in sync with .eslintrc
    modules: [
      path.join(__dirname, '/src'),
      path.join(__dirname, '/assets/scss'),
      path.join(__dirname, '/assets/img'),
      'node_modules',
    ],
    extensions: ['.js', '.jsx'],
  },

  module: {
    // Make missing exports an error instead of warning
    strictExportPresence: true,
    rules: [
      // Rules for JS / JSX
      {
        test: kgnScript,
        include: [path.resolve(__dirname, 'src')],
        exclude: /(node_modules|libs)/,
        loader: 'babel-loader',
        options: {
          // https://github.com/babel/babel-loader#options
          cacheDirectory: isDebug,

          // https://babeljs.io/docs/usage/options/
          babelrc: true,
          presets: [
            // A Babel preset that can automatically determine the Babel plugins and polyfills
            // https://github.com/babel/babel-preset-env
            [
              'env',
              {
                targets: {
                  forceAllTransforms: !isDebug, // for UglifyJS
                },
                modules: false,
                useBuiltIns: false,
                debug: false,
              },
            ],
            // Experimental ECMAScript proposals
            // https://babeljs.io/docs/plugins/#presets-stage-x-experimental-presets-
            'stage-2',
            // Flow
            // https://github.com/babel/babel/tree/master/packages/babel-preset-flow
            'flow',
            // JSX
            // https://github.com/babel/babel/tree/master/packages/babel-preset-react
            ['react'],
          ],
          plugins: [
            // Treat React JSX elements as value types and hoist them to the highest scope
            // https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-react-constant-elements
            ...(isDebug ? [] : ['transform-react-constant-elements']),
            // Replaces the React.createElement function with one that is more optimized for production
            // https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-react-inline-elements
            ...(isDebug ? [] : ['transform-react-inline-elements']),
            // Remove unnecessary React propTypes from the production build
            // https://github.com/oliviertassinari/babel-plugin-transform-react-remove-prop-types
            ...(isDebug ? [] : ['transform-react-remove-prop-types']),
          ],
        },
      },

      // Rules for Style Sheets
      {
        test: kgnStyle,
        include: [path.resolve(__dirname, 'assets/scss')],
        use: extractSass.extract({
          use: [
            // Process internal/project styles (from assets/scss folder)
            {
              loader: 'css-loader',
              options: {
                // CSS Loader https://github.com/webpack/css-loader
                importLoaders: 1,
                sourceMap: isDebug,
                // CSS Modules https://github.com/css-modules/css-modules
                modules: true,
                localIdentName: isDebug
                  ? '[name]-[local]-[hash:base64:5]'
                  : '[hash:base64:5]',
                // CSS Nano http://cssnano.co/
                minimize: isDebug ? false : minimizeCssOptions,
              },
            },
            { loader: 'postcss-loader', options: { sourceMap: true } },
            { loader: 'sass-loader', options: { sourceMap: true } },
          ],
          fallback: 'style-loader',
        }),
      },

      // Rules for images
      {
        test: kgnImage,
        oneOf: [
          // Inline lightweight images into CSS
          {
            issuer: kgnStyle,
            oneOf: [
              // Inline lightweight SVGs as UTF-8 encoded DataUrl string
              {
                test: /\.svg$/,
                loader: 'svg-url-loader',
                options: {
                  name: staticAssetName,
                  limit: 4096, // 4kb
                },
              },

              // Inline lightweight images as Base64 encoded DataUrl string
              {
                loader: 'url-loader',
                options: {
                  name: staticAssetName,
                  limit: 4096, // 4kb
                },
              },
            ],
          },

          // Or return public URL to image resource
          {
            loader: 'file-loader',
            options: {
              name: staticAssetName,
            },
          },
        ],
      },

      // Return public URL for all assets unless explicitly excluded
      // DO NOT FORGET to update `exclude` list when you adding a new loader
      {
        exclude: [kgnScript, kgnStyle, kgnImage],
        loader: 'file-loader',
        options: {
          name: staticAssetName,
        },
      },
    ],
  },
  // Don't attempt to continue if there are any errors.
  bail: !isDebug,

  cache: isDebug,

  // Specify what bundle information gets displayed
  // https://webpack.js.org/configuration/stats/
  stats: {
    cached: isVerbose,
    cachedAssets: isVerbose,
    chunks: isVerbose,
    chunkModules: isVerbose,
    colors: true,
    hash: isVerbose,
    modules: isVerbose,
    reasons: isDebug,
    timings: true,
    version: isVerbose,
  },

  // Choose a developer tool to enhance debugging
  // https://webpack.js.org/configuration/devtool/#devtool
  devtool: isDebug ? 'cheap-module-inline-source-map' : 'source-map',
}

//
// Configuration for the client-side bundle (client.js)
// -----------------------------------------------------------------------------
const clientConfig = {
  ...config,

  name: 'client',
  target: 'web',
  entry: [
    'babel-polyfill',
    path.join(__dirname, 'src/index.jsx'),
    path.join(__dirname, 'assets/scss/main.scss'),
  ],
  plugins: [
    extractSass,
    new CleanWebpackPlugin(pathsToClean, cleanProjectConfig),
    // Define free variables
    // https://webpack.js.org/plugins/define-plugin/
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': isDebug ? '"development"' : '"production"',
      'process.env.BROWSER': true,
      __DEV__: isDebug,
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.DEBUG': JSON.stringify(process.env.DEBUG),
    }),
    // Move modules that occur in multiple entry chunks to a new entry chunk (the commons chunk).
    // https://webpack.js.org/plugins/commons-chunk-plugin/
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: module => /node_modules/.test(module.resource),
    }),
    ...(isDebug
      ? []
      : [
        // Decrease script evaluation time
        // https://github.com/webpack/webpack/blob/master/examples/scope-hoisting/README.md
        new webpack.optimize.ModuleConcatenationPlugin(),

        // Minimize all JavaScript output of chunks
        // https://github.com/mishoo/UglifyJS2#compressor-options
        new webpack.optimize.UglifyJsPlugin({
          compress: {
            warnings: isVerbose,
            unused: true,
            dead_code: true,
            screw_ie8: true,
          },
          mangle: {
            screw_ie8: true,
          },
          output: {
            comments: false,
            screw_ie8: true,
          },
          sourceMap: true,
        }),
      ]),

    // Webpack Bundle Analyzer
    // https://github.com/th0r/webpack-bundle-analyzer
    ...(isAnalyze ? [new BundleAnalyzerPlugin()] : []),
  ],

  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  // https://webpack.js.org/configuration/node/
  // https://github.com/webpack/node-libs-browser/tree/master/mock
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
}

export default [clientConfig]
