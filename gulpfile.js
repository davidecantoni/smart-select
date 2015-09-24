var gulp    = require('gulp'),
    connect = require('gulp-connect'),
    babel   = require('gulp-babel'),
    uglify  = require('gulp-uglify'),
    sass    = require('gulp-sass'),
    jshint  = require('gulp-jshint'),
    rename  = require('gulp-rename'),
    minify  = require('gulp-minify-css'),
    jeditor = require("gulp-json-editor");

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

gulp.task('publish', function () {
    var data = {
        "name": "smart-select",
        "version": "0.1.0",
        "description": "Smart select is replacing and beautifying standard selects while keeping them async",
        "keywords": [
            "select",
            "multi-select",
            "standalone",
            "jquery",
            "library",
            "micro",
            "smart"
        ]
    };
    gulp.src("./package.json")
        .pipe(jeditor(data))
        .pipe(gulp.dest("./"));

    gulp.src("./bower.json")
        .pipe(jeditor(data))
        .pipe(gulp.dest("./"));

    gulp.src("./smartSelect.jquery.json")
        .pipe(jeditor(data))
        .pipe(gulp.dest("./"));
});

gulp.task('watch', function () {
    gulp.watch(['./helper/*.html'], ['html']);
    gulp.watch(['./src/scss/*.scss'], ['sass']);
    gulp.watch(['./src/js/*.js'], ['js']);
});

gulp.task('default', ['sass', 'js', 'connect', 'watch']);
