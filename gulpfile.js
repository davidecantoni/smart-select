var gulp = require('gulp'),
    connect = require('gulp-connect'),
    babel = require('gulp-babel');

gulp.task('connect', function() {
    connect.server({
        root: './',
        livereload: true
    });
});

gulp.task('babel', function () {
    return gulp.src('src/*.js')
        .pipe(babel())
        .pipe(gulp.dest('dist'));
});

gulp.task('html', function () {
    gulp.src('./*.html')
        .pipe(connect.reload());
});

gulp.task('watch', function () {
    gulp.watch(['./*.html'], ['html']);
    gulp.watch(['./src/*.js'], ['babel']);
});

gulp.task('default', ['connect', 'watch']);
