var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var runSequence = require('run-sequence');
var gutil = require('gulp-util');
var browserify = require('browserify');
var source = require('vinyl-source-stream'),
    rename = require('gulp-rename'),
    glob = require('glob'),
    es = require('event-stream');

var distDir = 'public/assets/';
var buildDir = 'public/app/';
var nodeModulesDir = 'node_modules/';
var cleanCSS = require('gulp-clean-css');

gulp.task('copy:normalize', function () {
    return gulp.src(nodeModulesDir + 'normalize.css/normalize.css')
        .pipe(gulp.dest(distDir + 'css/'));
});
gulp.task('copy:angular', function () {
    return gulp.src([
        //Commented out modules are now imported using Browserify
        // nodeModulesDir + 'angular/angular.min.js*',
        nodeModulesDir + 'moment/min/moment.min.js',
        // nodeModulesDir + 'angular-moment-picker/dist/angular-moment-picker.min.js',
        // nodeModulesDir + 'ng-file-upload/dist/ng-file-upload-all.min.js',
        // nodeModulesDir + 'ngmap/build/scripts/ng-map.min.js',
        // nodeModulesDir + 'angular-ui-notification/dist/angular-ui-notification.min.js',
        // nodeModulesDir + 'angular-route/angular-route.min.js*'
    ])
        .pipe(gulp.dest(distDir + 'js/modules/'));
});
gulp.task('copy:angular_css', function () {
    return gulp.src([
        nodeModulesDir + 'angular-moment-picker/dist/angular-moment-picker.min.css'])
        .pipe(gulp.dest(distDir + 'css/'));
});

gulp.task('copy', ['copy:normalize', 'copy:angular', 'copy:angular_css'], function () {
    console.log("Copying files to dist directory")
});

gulp.task('compile_scss', function () {
    gulp.src(buildDir + 'scss/*.scss')
        .pipe(sass({style: 'expanded'}))
        .on('error', gutil.log)
        .pipe(gulp.dest(distDir + "css/"))
});

gulp.task('minify_css', function () {
    return gulp.src(distDir + 'css/*.css')
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest(distDir + 'css/'));
});

gulp.task('compress_js', function () {
    gulp.src(distDir + 'js/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest(distDir + "js/"))
});
gulp.task('browserify', function (done) {
    glob(buildDir + '/js/**/main.js', function (err, files) {
        if (err) done(err);

        var tasks = files.map(function (entry) {
            return browserify({entries: [entry]})
                .bundle()
                .pipe(source(entry))
                .pipe(rename(function (path) {
                    path.dirname = path.dirname.replace(buildDir + "js/", "");
                    path.extname = ".bundle.js";
                }))
                .pipe(gulp.dest(distDir + "js/"));
        });
        es.merge(tasks).on('end', done);
    })
});

gulp.task('watch', function () {
    gulp.watch(buildDir + 'js/**/*.js', ['browserify']);
    gulp.watch(buildDir + 'scss/*.scss', ['compile_scss']);
    gulp.watch(distDir + 'css/*.css', ['minify_css']);
    gulp.watch(distDir + 'js/**/*.js', ['compress_js']);

});

gulp.task('default', function (callback) {
    runSequence('copy', ['compile_scss', 'browserify'], ['compress_js', 'minify_css'], callback);
});