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
    htmlmin = require('gulp-htmlmin'),
    cp = require('child_process'),
    del = require('del');

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

gulp.task('html', ['jekyll'], function() {
    gulp.src(['tmp/*.html', 'tmp/**/*.html'])
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('./'));
    del(['./tmp']);
    return;
});

gulp.task('jekyll', function (gulpCallBack){
    var spawn = cp.spawn;
    var jekyll = spawn('jekyll', ['build'], {stdio: 'inherit'});

    jekyll.on('exit', function(code) {
        gulpCallBack(code === 0 ? null : 'ERROR: Jekyll process exited with code: '+code);
    });
});

//Defaulr task
gulp.task('watch', function() {
    gulp.watch('sass/**/*.scss',['styles']);
    gulp.watch('js/**/*.js',['scripts']);
    gulp.watch(['content/_layouts/*.html', 'content/*.html', 'content/**/*.html'],['html']);
});

//Default task
gulp.task('default', ['styles', 'scripts', 'html']);
