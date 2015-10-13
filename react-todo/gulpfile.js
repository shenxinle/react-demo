var gulp = require('gulp');
var react = require('gulp-react');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('react', function () {
    gulp.src('script/*.jsx')
        .pipe(react())
        .pipe(gulp.dest('script/dist'));
});

gulp.task('sass', function () {
    gulp.src('style/*.scss')
        .pipe(sass())
        .pipe(autoprefixer({
            broswers: ['> 1%', 'ie 9', 'firefox > 18', 'safari 5', 'iso 6', 'android 3']
        }))
        .pipe(gulp.dest('style'));
});

gulp.task('default', ['react', 'sass'], function () {
    gulp.watch('script/*.jsx', ['react']);
    gulp.watch('style/*.scss', ['sass']);
});