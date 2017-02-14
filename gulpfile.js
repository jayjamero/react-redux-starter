'use strict';

const gulp = require('gulp'),  // Base gulp package
    babelify = require('babelify'), // Used to convert ES6 & JSX to ES5
    browserify = require('browserify'), // Providers "require" support, CommonJS
    notify = require('gulp-notify'), // Provides notification to both the console and Growel
    rename = require('gulp-rename'), // Rename sources
    sourcemaps = require('gulp-sourcemaps'), // Provide external sourcemap files
    browserSync = require('browser-sync').create(),
    gutil = require('gulp-util'), // Provides gulp utilities, including logging and beep
    chalk = require('chalk'), // Allows for coloring for logging
    source = require('vinyl-source-stream'), // Vinyl stream support
    buffer = require('vinyl-buffer'), // Vinyl stream support
    watchify = require('watchify'), // Watchify for source changes
    merge = require('utils-merge'), // Object merge tool
    duration = require('gulp-duration'), // Time aspects of your gulp process
    sass = require('gulp-sass'),
    eslint = require('gulp-eslint'),
    uglify = require('gulp-uglify'), // can be a git checkout
    pump = require('pump'),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    del = require('del'),
    cleanCSS = require('gulp-clean-css');

const outputPath = './dist',
    assetPath = './assets/';

// Configuration for Gulp
const config = {
  index: './index.html',
  indexDist: './dist/index.html',
  js: {
    src: './app/index.js',
    watch: './app/*',
    outputDir: outputPath+'/js/build/',
    outputFile: 'main.js'
  },
};

// Completes the final file outputs
const bundle = (bundler) => {
  return bundler
    .bundle()
      .on('error', mapError) // Map error reporting
      .pipe(source('index.js')) // Set source name
      .pipe(buffer()) // Convert to gulp pipeline
      .pipe(rename(config.js.outputFile)) // Rename the output file
      .pipe(sourcemaps.init({loadMaps: true})) // Extract the inline sourcemaps
      .pipe(sourcemaps.write('./map')) // Set folder for sourcemaps to output to
      .pipe(gulp.dest(config.js.outputDir)) // Set the output folder
      .pipe(notify({
        message: 'Generated file: <%= file.relative %>',
      })); // Output the file being created
};

// Error reporting function
const mapError = (err) => {
  if (err.fileName) {
    // Regular error
    gutil.log(chalk.red(err.name)
      + ': ' + chalk.yellow(err.fileName.replace(__dirname + '/src/js/', ''))
      + ': ' + 'Line ' + chalk.magenta(err.lineNumber)
      + ' & ' + 'Column ' + chalk.magenta(err.columnNumber || err.column)
      + ': ' + chalk.blue(err.description));
  } else {
    // Browserify error..
    gutil.log(chalk.red(err.name)
      + ': '
      + chalk.yellow(err.message));
  }
};

gulp.task('lint-all', ['copy-index', 'copy-images', 'copy-fonts', 'sass-compile'], () => {
  // ESLint ignores files with "node_modules" paths.
  // So, it's best to have gulp ignore the directory as well.
  // Also, Be sure to return the stream from the task;
  // Otherwise, the task may end before the stream has finished.
  return gulp.src(['./app/**/*.js','!node_modules/**', '!Resources/public/js/build/**'])
    // eslint() attaches the lint output to the "eslint" property
    // of the file object so it can be used by other modules.
    .pipe(eslint())
    // Format results
    .pipe(eslint.result(result => {
      // Called for each ESLint result.
      gutil.log(chalk.magenta(`ESLinting file: ${result.filePath}`));
      gutil.log(chalk.green(`# Messages: ${result.messages.length}`));
      gutil.log(chalk.yellow(`# Warnings: ${result.warningCount}`));
      gutil.log(chalk.red(`# Errors: ${result.errorCount}`));
    }))
    // eslint.format() outputs the lint results to the console.
    // Alternatively use eslint.formatEach() (see Docs).
    .pipe(eslint.format())
    // To have the process exit with an error code (1) on
    // lint error, return the stream and pipe to failAfterError last.
    .pipe(eslint.failAfterError())
    .on('error', error => {
      gutil.log('Stream Exiting With Error: ' + error.message);
      process.exit(1);
    });
});

// Watching for single file changes to lint
gulp.task('lint-watch', () => {
  gulp.watch('./app/**/*.js')
    .on("change", (file) => {
      return gulp.src([file.path])
        .pipe(eslint())
        .pipe(eslint.result(result => {
          gutil.log(chalk.bold(chalk.blue(`File Changed`)));
          gutil.log(chalk.magenta(`ESLinting file: ${result.filePath}`));
          gutil.log(chalk.green(`# Messages: ${result.messages.length}`));
          gutil.log(chalk.yellow(`# Warnings: ${result.warningCount}`));
          gutil.log(chalk.red(`# Errors: ${result.errorCount}`));
        }))
        .pipe(eslint.format());
    });
});

gulp.task('build-react', (done) => {
  const args = merge(watchify.args, { debug: false }), // Merge in default watchify args with browserify arguments
    bundler = browserify(config.js.src, args) // Browserify
      .transform(babelify, {presets: ['airbnb', 'es2015', 'react']}), // Babel tranforms
    bundconstimer = duration('Javascript bundle time'); // timer
  bundle(bundler).on('end', done).pipe(bundconstimer); // Run the bundle the first time (required for Watchify to kick in)
});

gulp.task('build-react-dev', ['lint-all'], (done) => {
  const args = merge(watchify.args, { debug: true }), // Merge in default watchify args with browserify arguments
    bundler = browserify(config.js.src, args) // Browserify
    .plugin(watchify, {ignoreWatch: ['**/node_modules/**', '**/bower_components/**']}) // Watchify to watch source file changes
    .transform(babelify, {presets: ['es2015', 'react']}), // Babel tranforms
    bundconstimer = duration('Javascript bundle time'); // timer

  //bundle(bundler).on('end', (done).pipe(bundconstimer);
  bundle(bundler).on('end', done).pipe(bundconstimer); // Run the bundle the first time (required for Watchify to kick in)

  bundler.on('update', function() {
    bundle(bundler); // Re-run bundle on source updates
  });
});

// Compress the compiled file
gulp.task('compress', ['build-react'], (done) => {
  const options = {
    //preserveComments: 'license',
    unused: true,
    dead_code: true,
    mangle: true
  };
  pump([
      //.pipe(rename({ suffix: '.min' })) -> If we want a .min suffix to main
      gulp.src(config.js.outputDir+config.js.outputFile),
      uglify(options),
      gulp.dest(config.js.outputDir)
    ]
  );
  done();
});

gulp.task('sass-compile', () => {
  return gulp.src(assetPath+'/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(outputPath+'/css/'));
});

gulp.task('sass-minify', () => {
  return gulp.src(assetPath+'/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS({debug: true, compatibility: 'ie8'}, function(details){
      gutil.log(chalk.bold(chalk.gray('[ Minify Details ]')));
      gutil.log(chalk.yellow(details.name + ': ' + Math.ceil( details.stats.originalSize / 1024 )+"kb"));
      gutil.log(chalk.magenta("Minified "+details.name + ': ' + Math.ceil( details.stats.minifiedSize / 1024 )+"kb"));
    }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(outputPath+'/css/'));
});

gulp.task('watch-sass', ['sass-compile'], (done) => {
  browserSync.reload();
  done();
});

gulp.task('copy-index', () => {
  return gulp.src(config.index)
    .pipe(gulp.dest(outputPath));
});

gulp.task('watch-index', ['copy-index'], (done) => {
  browserSync.reload();
  done();
});

gulp.task('copy-images', () => {
  return gulp.src(assetPath+'/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}')
    // Caching images that ran through imagemin
    .pipe(cache(imagemin({
      interlaced: true
    })))
    .pipe(gulp.dest(outputPath+'/images'));
});

gulp.task('watch-images', ['copy-images'], (done) => {
  browserSync.reload();
  done();
});

gulp.task('copy-font-awesome', () => {
  return gulp.src('./bower_components/font-awesome/fonts/**/*.{ttf,woff,eof,svg}')
    .pipe(gulp.dest(outputPath+'/fonts'));
});

gulp.task('copy-fonts', ['copy-font-awesome'], (done) => {
  done();
});

// reloading browsers
gulp.task('reload', (done) => {
  browserSync.reload();
  done();
});

// Gulp default task for build
gulp.task('default', ['lint-all', 'copy-index', 'copy-images', 'copy-fonts', 'sass-compile'], (done) => {
  return done();
});

// Gulp task for build
gulp.task('dist', ['lint-all', 'compress', 'copy-index', 'copy-images', 'copy-fonts', 'sass-minify'], (done) => {
  done();
});

gulp.task('clean:dist', function() {
  return del.sync('./dist');
});

// create a task that ensures the `assets` are copied and complete before reloading.
// use serve task to launch Browsersync and watch JS files
gulp.task('serve', ['build-react-dev', 'lint-watch'], function () {
  gulp.watch(config.index, ['watch-index']);
  gulp.watch(assetPath+'/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}', ['watch-images']);
  gulp.watch(assetPath+'/sass/**/*.scss', ['watch-sass']);
  gulp.watch(config.js.outputDir+config.js.outputFile, ['reload']);

  // Serve files from the root of this project
  browserSync.init({
    server: {
      baseDir: "./dist"
    }
  });
});
