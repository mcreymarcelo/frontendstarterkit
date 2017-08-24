const gulp          = require('gulp');
const postcss       = require('gulp-postcss');
const posturl       = require("postcss-url")
const cssnext       = require('postcss-cssnext');
const atImport      = require('postcss-import');
const browserSync   = require('browser-sync');
const imagemin      = require('gulp-imagemin');
const concat        = require('gulp-concat');
const browserReport = require('postcss-browser-reporter');
const postReporter  = require('postcss-reporter');
const envi          = require('gulp-mode');
const minifyjs      = require('gulp-js-minify');
const minifycss     = require('gulp-clean-css');
const clean         = require('gulp-clean');

const file          = require('gulp-file');
const { rollup }    = require('rollup');
const babel         = require('rollup-plugin-babel');

const paths = {
  csspath    : 'assets/css/',
  cssmain    : 'assets/css/main.css',
  cssdist    : 'dist/css/',
  jspath     : 'assets/scripts/',
  jsmain     : 'assets/scripts/*.js',
  jsdist     : 'dist/scripts/',
  imagesmain : 'assets/images/*.*',
  imagesdist : 'dist/images/',
  proxy      : 'starter.dev'
};

const mode = envi({
  modes: ['production', 'development'],
  default: 'development',
  verbose: false
});


gulp.task('styles', () => {
    
  let  processors = [
          atImport,
          posturl(),
          cssnext(),
          browserReport(),
	        postReporter()
       ];

  return gulp.src(paths.cssmain)
             .pipe(postcss(processors))
             .pipe(mode.production(minifycss()))
             .pipe(gulp.dest(paths.cssdist));
    
});

gulp.task('scripts', () => {

  return rollup({
    input: 'assets/scripts/main.js',
    plugins: [
      babel({
        presets: [
          [
            'es2015', {
              'modules': false
            }
          ]
        ],
        babelrc: false,
        exclude: 'node_modules/**'
      })
    ]
  })
  .then( bundle => {
    return bundle.generate({
      format: 'umd',
      moduleName: 'myModule'
    })
  })
  .then( gen => {
    return file( 'main.js', gen.code, { src: true })
               .pipe(mode.production(minifyjs()))
               .pipe( gulp.dest('dist/scripts/') )
  });
  
    
});

gulp.task('images', () => {

	let minifactor = [
                       imagemin.gifsicle({interlaced: true}),
                       imagemin.jpegtran({progressive: true}),
                       imagemin.optipng({optimizationLevel: 5}),
                       imagemin.svgo({plugins: [{removeViewBox: true}]})
                   ];

	return gulp.src(paths.imagesmain)
               .pipe(mode.production(imagemin(minifactor)))
               .pipe(gulp.dest(paths.imagesdist));

});


gulp.task('clean-build', () => {

  return gulp.src('./dist', {read: false})
             .pipe(clean());

});


gulp.task('watch', ['default'], () => {

  browserSync.init({
    files: ['**/*.html', '*.html'],
    proxy: 'starter.dev'
  });

  gulp.watch(paths.csspath + '**/*.css', ['styles']).on('change', browserSync.reload);
  gulp.watch(paths.jsmain, ['scripts']).on('change', browserSync.reload);

});

gulp.task('default', ['clean-build', 'styles', 'scripts', 'images']);
