// Connect gulp modules
const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
const watch = require('gulp-watch');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');

const cssFiles = [
    './src/css/main.css',
    './src/css/media.css',
];

const jsFiles = [
    './src/js/lib.js',
    './src/js/main.js'
];


// Function for all styles
function styles() {
    // Template for search css files
    return gulp.src(cssFiles)

        .pipe(concat('style.css'))

        .pipe(autoprefixer({
            browsers: ['Last 2 version'],
            cascade: false
        }))

        .pipe(cleanCSS({
            level: 2
        }))


    // Folder for styles
    .pipe(gulp.dest('./build/css'))
    .pipe(browserSync.stream());
}

// Function for all scripts
function scripts() {


    return gulp.src(jsFiles)

        .pipe(concat('script.js'))

        .pipe(uglify({
            toplevel: true
        }))

        .pipe(gulp.dest('./build/js'))
        .pipe(browserSync.stream());

}

function clean() {
    return del(['build/*'])
}
function compiles() {
    return gulp.src('./src/scss/**/*.scss')

        .pipe(sourcemaps.init())
        .pipe(sass()).on('error', sass.logError)
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./src/css'))
}
function watchs() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch('./src/scss/**/*.scss', compiles)
    gulp.watch('./src/css/**/*.css', styles)
    gulp.watch('./src/js/**/*.js', scripts)


    gulp.watch("./*.html").on('change', browserSync.reload);
}

// Create task for function
gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('clean', clean);
gulp.task('watchs', watchs);
gulp.task('compiles', compiles );
gulp.task('build', gulp.series(clean, compiles, gulp.parallel(compiles, styles, scripts)));
gulp.task('dev', gulp.series('build', 'watchs'));