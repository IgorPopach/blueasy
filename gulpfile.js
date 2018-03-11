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
	autoprefixer = require('gulp-autoprefixer'),// Подключаем библиотеку для автоматического добавления префиксов
	notify				= require('gulp-notify');

var DIST = "./dist/";
var APP = "./app/";

gulp.task('common-js', function() {
	return gulp.src([
		APP + 'js/common.js',
		])
	.pipe(concat('common.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest(DIST + 'js'));
});

gulp.task('js', ['common-js'], function() {
	return gulp.src([
		APP + 'libs/jquery/dist/jquery.min.js', // завжди на початку
		APP + 'libs/mmenu/js/jquery.mmenu.js',
		APP + 'js/common.min.js', // завжди в кінці
		])
	.pipe(concat('scripts.min.js'))
	// .pipe(uglify()) мінімізувати весь js (на вибір)
	.pipe(gulp.dest(DIST + 'js'))
	// .pipe(browserSync.reload({stream: true}));
});

gulp.task('scss', function(){ // Создаем таск Sass
	return gulp.src(APP + 'scss/style.scss') // Берем источник
		.pipe(sass({outputStyle:'expand'}).on("error", notify.onError())) // Преобразуем Sass в CSS посредством gulp-sass
		.pipe(rename({sufix: '.min', prefix : ''}))
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Создаем префиксы
		.pipe(cssnano())
		.pipe(gulp.dest(DIST + 'css')) // Выгружаем результата в папку app/css
		// .pipe(browserSync.reload({stream: true})); // Обновляем CSS на странице при изменении
});

gulp.task('fonts', function(){
	return gulp.src(APP + 'fonts/**/*.*')
	.pipe(gulp.dest(DIST + 'fonts/'));
});

gulp.task('html', function(){
	return gulp.src(APP + '*.html')
	.pipe(gulp.dest(DIST));
});

gulp.task('browser-sync', function() { // Создаем таск browser-sync
	browserSync({ // Выполняем browserSync
		server: { // Определяем параметры сервера
			baseDir: DIST // Директория для сервера - app
		},
		notify: false // Отключаем уведомления
	});
});

gulp.task('scripts', function() {
	return gulp.src([ // Берем все необходимые библиотеки
		APP + 'libs/jquery/dist/jquery.min.js', // Берем jQuery
		APP + 'libs/magnific-popup/dist/jquery.magnific-popup.min.js' // Берем Magnific Popup
		])
		.pipe(concat('libs.min.js')) // Собираем их в кучу в новом файле libs.min.js
		.pipe(uglify()) // Сжимаем JS файл
		.pipe(gulp.dest(DIST + 'js')); // Выгружаем в папку app/js
});

gulp.task('watch', ['scss', 'html', 'scripts'], function() {
	gulp.watch([
		APP + 'scss/**/*.scss',
		APP + '*.html',
		APP + 'js/**/*.js'
		], [browserSync.reload]);
// 	gulp.watch(APP + 'scss/**/*.scss', ['scss', browserSync.reload]); // Наблюдение за sass файлами в папке sass
// 	gulp.watch(APP + '*.html', browserSync.reload); // Наблюдение за HTML файлами в корне проекта
// 	gulp.watch(APP + 'js/**/*.js', browserSync.reload);   // Наблюдение за JS файлами в папке js
});

gulp.task('clean', function() {
	return del.sync(DIST); // Удаляем папку dist перед сборкой
});

gulp.task('img', function() {
	return gulp.src(APP + 'img/**/*') // Берем все изображения из app
		.pipe(cache(imagemin({ // С кешированием
		// .pipe(imagemin({ // Сжимаем изображения без кеширования
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		}))/**/)
		.pipe(gulp.dest(DIST + 'img')); // Выгружаем на продакшен
});

gulp.task('build', ['clean', 'img', 'scss', 'scripts', 'fonts', 'html']);

gulp.task('clear', function (callback) {
	return cache.clearAll();
})

gulp.task('default', ['watch', 'browser-sync', 'build']);
