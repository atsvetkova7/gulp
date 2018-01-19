var gulp       = require('gulp'), // Подключаем Gulp
    sass         = require('gulp-sass'), //Подключаем Sass пакет,
    browserSync  = require('browser-sync'), // Подключаем Browser Sync
    concat       = require('gulp-concat'), // Подключаем gulp-concat (для конкатенации файлов)
    uglify       = require('gulp-uglifyjs'), // Подключаем gulp-uglifyjs (для сжатия JS)
    cssnano      = require('gulp-cssnano'), // Подключаем пакет для минификации CSS
    rename       = require('gulp-rename'), // Подключаем библиотеку для переименования файлов
    del          = require('del'), // Подключаем библиотеку для удаления файлов и папок
    imagemin     = require('gulp-imagemin'), // Подключаем библиотеку для работы с изображениями
    pngquant     = require('imagemin-pngquant'), // Подключаем библиотеку для работы с png
    cache        = require('gulp-cache'), // Подключаем библиотеку кеширования
    autoprefixer = require('gulp-autoprefixer');// Подключаем библиотеку для автоматического добавления префиксов

//access to files
var path = {
    dist: { 
        html: 'dist/',
        js: 'dist/js/',
        css: 'dist/css/',
        img: 'dist/img/',
        fonts: 'dist/fonts/'
    },
     app: { 
        html: 'app/*.html', 
        js: 'app/js/**/*',
        sass: 'app/sass/**/*.scss',
        style: 'app/css',
        img: 'app/img/**/*'
    },
    watch: { 
        html: 'app/*.html',
        js: 'app/js/**/*.js',
        sass: 'app/sass/**/*.scss'
    },
    clean: './dist'
};

//-------------SASS------------------------
gulp.task('sass', function(){ 
    return gulp.src(path.app.sass) 
        .pipe(sass()) 
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) 
        .pipe(gulp.dest(path.app.style)) 
        .pipe(browserSync.reload({stream: true})) 
});
//---------------------BROWSER-SYNC----------------
gulp.task('browser-sync', function() { 
    browserSync({ 
        server: { 
            baseDir: 'app'
        },
        notify: false 
    });
});

//--minify js--------------------------
gulp.task('scripts', function() {
    return gulp.src([ 
        'app/libs/jquery/dist/jquery.min.js', // jQuery
        'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js' // Magnific Popup
        ])
        .pipe(concat('libs.min.js')) 
        .pipe(uglify()) 
        .pipe(gulp.dest('app/js')); 
});

//minify css libs
gulp.task('css-libs', ['sass'], function() {
    return gulp.src('app/css/libs.css') 
        .pipe(cssnano()) 
        .pipe(rename({suffix: '.min'})) 
        .pipe(gulp.dest(path.app.style)); 
});

//-------WATCH-----------------     
gulp.task('watch', ['browser-sync', 'css-libs', 'scripts'], function() {
    gulp.watch(path.watch.sass, ['sass']); 
    gulp.watch(path.watch.html, browserSync.reload); 
    gulp.watch(path.watch.js, browserSync.reload);   
});

gulp.task('clean', function() {
    return del.sync(path.clean);
});

//  minify image
gulp.task('img', function() {
    return gulp.src(path.app.img) 
        .pipe(cache(imagemin({  
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest(path.dist.img)); 
});

//--------------BUILD-----------------------

gulp.task('build', ['clean', 'img', 'sass', 'scripts'], function() {

    var buildCss = gulp.src([ 
        'app/css/main.css',
        'app/css/libs.min.css'
        ])
    .pipe(gulp.dest(path.dist.css))

    var buildFonts = gulp.src(path.app.fonts) 
    .pipe(gulp.dest(path.dist.fonts))

    var buildJs = gulp.src(path.app.js) 
    .pipe(gulp.dest(path.dist.js))

    var buildHtml = gulp.src(path.app.html) 
    .pipe(gulp.dest(path.dist.html));

});

gulp.task('clear', function () {
    return cache.clearAll();
})

gulp.task('default', ['watch']);