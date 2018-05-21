var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var cssnano = require('gulp-cssnano');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var clean = require('gulp-clean');
var uglify = require('gulp-uglify');
var wiredep = require('gulp-wiredep');
var useref = require('gulp-useref');
var browserSync = require('browser-sync');

gulp.task('sass', function(){            //компиляция и конкатенация scss файлов на деве
    gulp.src(['_dev/css/_misc/*.scss', '_dev/css/blocks/**/*.scss'])
    .pipe(plumber({
        errorHandler: notify.onError(function(err){
            return{
                title: 'sass',
                message:err.message
            }
        })
    }))
    .pipe(sourcemaps.init())
    .pipe(concat('styles.scss'))
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('_dev/css'));
});

gulp.task('watchSass', function(){ //слежение за изменением scss файлов на деве
    gulp.watch('_dev/css/**/*.scss', ['sass']);
});

gulp.task('browser-sync', function(){ //запуск browser sync на деве
    browserSync.init({
        server: {
            baseDir: "./_dev"
        }
    });
    gulp.watch('./_dev/**/*.{html,css,js}').on('change', browserSync.reload);
});

gulp.task('cleanBuild', function(){ //удаление папки Build
    gulp.src('./build')
    .pipe(clean());
});

//таски переноса разных типов файлов
gulp.task('buildTransCss', function(){
    return gulp.src('./_dev/css/**/*.css')
    .pipe(plumber({
        errorHandler: notify.onError(function(err){
            return{
                title: 'buildTransCss',
                message:err.message
            }
        })
    }))
    .pipe(gulp.dest('./build/css'));
});

gulp.task('buildTransAssets', function(){   
    return gulp.src('./_dev/assets/**/*.*')
    .pipe(plumber({
        errorHandler: notify.onError(function(err){
            return{
                title: 'buildTransAssets',
                message:err.message
            }
        })
    }))
    .pipe(gulp.dest('./build/assets'));
})

gulp.task('buildTransJs', function(){
    return gulp.src('./_dev/js/**/*.js')
    .pipe(plumber({
        errorHandler: notify.onError(function(err){
            return{
                title: 'buildTransJs',
                message:err.message
            }
        })
    }))
    .pipe(gulp.dest('./build/js'));
})

gulp.task('buildTransHtml', function(){
    return gulp.src('./_dev/*.html')
    .pipe(plumber({
        errorHandler: notify.onError(function(err){
            return{
                title: 'buildTransHtml',
                message:err.message
            }
        })
    }))
    .pipe(wiredep({
        "overrides":{
            "normalize.css":{
                "main": "normalize.css"
            }
        }
    }))
    .pipe(useref())
    .pipe(gulp.dest('./build/'))
    });


gulp.task('build', ['buildTransAssets','buildTransHtml'], function(){ //выполняется бтлд
    gulp.src('./build/css/**/*.css')
    .pipe(plumber({
        errorHandler: notify.onError(function(err){
            return{
                title: 'build',
                message:err.message
            }
        })
    }))
    .pipe(cssnano())
    .pipe(gulp.dest('./build/css/'));

    gulp.src('./build/JS/**/*.js')
    .pipe(plumber({
        errorHandler: notify.onError(function(err){
            return{
                title: 'build',
                message:err.message
            }
        })
    }))
    .pipe(uglify())
    .pipe(gulp.dest('./build/JS'));
});


gulp.task('buildWiredep', function(){ //подключение компонентов Bower на билде
    return gulp.src('./build/*.html')
    .pipe(wiredep())
    .pipe(gulp.dest('./build'));
});

gulp.task('buildUseref', function(){ //объединение js и css на билде
    gulp.src('./build/*.html')
    .pipe(useref())
    .pipe(gulp.dest('./build'));
});
