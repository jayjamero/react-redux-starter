const pkg = require('./package.json')

module.exports = {
  plugins: {
    autoprefixer: {
      browsers: pkg.browserslist,
      flexbox: 'no-2009',
      remove: false,
    },
  },
}
