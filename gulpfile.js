var gulp    = require('gulp'),
    connect = require('gulp-connect'),
    babel   = require('gulp-babel'),
    uglify  = require('gulp-uglify'),
    sass    = require('gulp-sass'),
    jshint  = require('gulp-jshint'),
    rename  = require('gulp-rename'),
    minify  = require('gulp-minify-css');

gulp.task('connect', function() {
    connect.server({
        root: [
            'helper',
            'dist',
            'node_modules'
        ],
        livereload: true
    });
});

gulp.task('sass', function () {
    gulp.src('./src/scss/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('dist/css'))
        .pipe(minify({compatibility: 'ie8'}))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('js', function () {
    return gulp.src('./src/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default', {
            verbose: true
        }))
        .pipe(babel())
        .pipe(gulp.dest('dist/js'))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('html', function () {
    gulp.src('./helper/*.html')
        .pipe(connect.reload());
});

gulp.task('watch', function () {
    gulp.watch(['./helper/*.html'], ['html']);
    gulp.watch(['./src/scss/*.scss'], ['sass']);
    gulp.watch(['./src/js/*.js'], ['js']);
});

gulp.task('default', ['sass', 'js', 'connect', 'watch']);
