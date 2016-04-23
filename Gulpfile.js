var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename');
    sourcemaps = require('gulp-sourcemaps'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    browserify = require('browserify'),
    watchify = require('watchify'),
    babel = require('babelify'),
    htmlmin = require('gulp-htmlmin');;

gulp.task('scripts', function() {
    browserify('./js/global.js')
        .transform(babel)
        .bundle()
        .on('error', function(err) { console.error(err); this.emit('end'); })
        .pipe(source('build.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('styles', function() {
    gulp.src('sass/**/*.scss')
        .pipe(sass('sass', { style: 'expanded' }).on('error', sass.logError))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('html', function() {
  return gulp.src(['html/*.html', 'html/**/*.html'])
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist'))
});

//Defaulr task
gulp.task('watch', function() {
    gulp.watch('sass/**/*.scss',['styles']);
    gulp.watch('js/**/*.js',['scripts']);
    gulp.watch('html/**/*.html',['html']);
});

//Default task
gulp.task('default', ['styles', 'scripts', 'html']);
