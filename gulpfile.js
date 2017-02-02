var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var runSequence = require('run-sequence');
var gutil = require('gulp-util');


var distDir = 'public/assets/';
var buildDir = 'app/';
var nodeModulesDir = 'node_modules/';
gulp.task('copy:normalize', function () {
    return gulp.src(nodeModulesDir + 'normalize.css/normalize.css')
        .pipe(gulp.dest(distDir + 'css/'));
});

gulp.task('copy', ['copy:normalize'], function () {
    console.log("Copying files to dist directory")
});

gulp.task('compile_scss', function () {
    gulp.src(buildDir + 'scss/*.scss')
        .pipe(sass({style: 'expanded'}))
        .on('error', gutil.log)
        .pipe(gulp.dest(distDir + "css/"))
});

gulp.task('compress_js', function () {
    gulp.src(buildDir + 'js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest(distDir + "js/"))
});

gulp.task('watch', function () {
    gulp.watch(buildDir + 'js/*.js', ['compress_js']);
    gulp.watch(buildDir + 'scss/*.scss', ['compile_scss']);
});

gulp.task('default', function (callback) {
    runSequence('copy', ['compile_scss', 'compress_js'], callback);
});