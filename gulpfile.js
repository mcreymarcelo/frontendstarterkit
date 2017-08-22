const gulp          = require('gulp');
const postcss       = require('gulp-postcss');
const posturl       = require("postcss-url")
const cssnext       = require('postcss-cssnext');
const atImport      = require('postcss-import');
const cssnano       = require('cssnano');
const browserSync   = require('browser-sync');
const imagemin      = require('gulp-imagemin');
const concat        = require('gulp-concat');
const browserReport = require('postcss-browser-reporter');
const postReporter  = require('postcss-reporter');
const envi          = require('gulp-mode');
const minifyjs      = require('gulp-js-minify');

const paths = {
    csspath    : 'assets/css/',
    cssmain    : 'assets/css/main.css',
    cssdist    : 'dist/css/',
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
		        postReporter(),
         ];

    let  processorsProd = [
            atImport,
            posturl(),
            cssnext(),
            browserReport(),
            postReporter(),
            cssnano()
         ];
    
    return gulp.src(paths.cssmain)
               .pipe(mode.production(postcss(processorsProd)) || postcss(processors))
               .pipe(gulp.dest(paths.cssdist));
    
});

gulp.task('scripts', () => {
    
    return gulp.src(paths.jsmain)
               .pipe(concat('all.js'))
               .pipe(mode.production(minifyjs()))
               .pipe(gulp.dest(paths.jsdist));
    
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


gulp.task('watch', () => {

  browserSync.init({
    files: ['**/*.html', '*.html'],
    proxy: 'starter.dev'
  });

  gulp.watch(paths.csspath + '**/*.css', ['styles']).on('change', browserSync.reload);
  gulp.watch(paths.jsmain, ['scripts']).on('change', browserSync.reload);

});


gulp.task('default', ['styles', 'scripts', 'images']);
