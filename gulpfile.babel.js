/* HTML */
const htmlmin = require('gulp-htmlmin')

/* CSS */
const postcss = require('gulp-postcss')
const cssnano = require('cssnano')
const autoprefixer = require('autoprefixer')

/* JAVASCRIPT */
const gulp = require('gulp')
const babel = require('gulp-babel')
const terser = require('gulp-terser')

/* PUG */
const pug = require('gulp-pug')

/* SASS */
const sass = require('gulp-sass')(require('sass'));

/* 'COMMON' Concatena los archivos en uno solo */
const concat = require('gulp-concat')

/* CLEAN CSS */
const clean = require('gulp-purgecss')

/* Caché bust */
const cachebust = require('gulp-cache-bust')

/* Optimización de imágenes */
const imagemin = require('gulp-imagemin')

/* Browzer sync */
const browserSync = require('browser-sync').create();

/* Variables constantes */
const cssPlugins = [
    cssnano(),
    autoprefixer()
]

const production = false


/* TAREA PARA EL HTML */
gulp.task('htmlmin', () => {
    return gulp.src('./src/*.html')
        .pipe(htmlmin({
            /*         collapseWhitespace: true,
                    removeComments: true */
        }))
        .pipe(gulp.dest('./public'))
})

/* TAREA PARA EL CSS */
gulp.task('styles', () => {
    return gulp.src('./src/css/*.css')
        .pipe(concat('styeles-min.css'))
        .pipe(postcss(cssPlugins))
        .pipe(gulp.dest('./public/css'))
})

/* TAREA PARA TRASPILAR JAVASCRIPT */
gulp.task('babel', () => {
    return gulp.src('./src/js/*.js')
        .pipe(concat('scripts-min.js'))
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(terser())
        .pipe(gulp.dest('./public/js'))
})

/* TAREA PARA PUG */
gulp.task('views', () => {
    return gulp.src('./src/views/pages/*.pug')
        .pipe(pug({
            pretty: production ? false : true
        }))
        .pipe(cachebust({
            type: 'timestamp'
        }))
        .pipe(gulp.dest('./public'))
})

/* TAREA PARA SASS */
gulp.task('sass', () => {
    return gulp.src('./src/scss/styles.scss')
        .pipe(sass({
            outputStyle: "compressed"
        }))
        .pipe(postcss(cssPlugins))
        .pipe(gulp.dest('./public/css'))
})

/* TAREA PARA LIMPIAR EL CSS */
gulp.task('clean', () => {
    return gulp.src('./public/css/styles.css')
        .pipe(clean({
            content: ['./public/*.html']
        }))
        .pipe(gulp.dest('./public/css'))
})

/* TAREA PARA OPTIMIZAR IMAGENES */
gulp.task('imgmin', ()=>{
    return gulp.src('./src/images/*')
    .pipe(imagemin([
        imagemin.gifsicle({interlaced: true}),
        imagemin.mozjpeg({quality: 75, progressive: true}),
        imagemin.optipng({optimizationLevel: 5}),
        imagemin.svgo({
            plugins: [
                {removeViewBox: true},
                {cleanupIDs: false}
            ]
        })
    ]))
    .pipe(gulp.dest('./public/images'))
})

// Static server
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./public"
        }
    });
});


/* Tarea para vigilar los cambios realizados */
gulp.task('default', () => {
    //gulp.watch('./src/css/*.css', gulp.series('styles')) 
    gulp.watch('./src/views/**/*.pug', gulp.series('views'))
    gulp.watch('./src/scss/**/*.scss', gulp.series('sass'))
    gulp.watch('./src/js/*.js', gulp.series('babel'))
})