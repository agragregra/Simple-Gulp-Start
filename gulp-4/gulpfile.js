var gulp           = require('gulp'),
		sass           = require('gulp-sass')(require('sass')),
		browserSync    = require('browser-sync'),
		concat         = require('gulp-concat'),
		uglify         = require('gulp-uglify'),
		cleanCSS       = require('gulp-clean-css'),
		rename         = require('gulp-rename'),
		autoprefixer   = require('gulp-autoprefixer'),
		notify         = require("gulp-notify");

// Сервер и автообновление страницы Browsersync
gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false,
		// tunnel: true,
		// tunnel: "projectmane", //Demonstration page: http://projectmane.localtunnel.me
	});
});

// Минификация пользовательских скриптов проекта и JS библиотек в один файл
gulp.task('js', function() {
	return gulp.src([
		'app/libs/jquery/dist/jquery.min.js',
		'app/js/common.js', // Всегда в конце
		])
	.pipe(concat('scripts.min.js'))
	.pipe(uglify()) // Минимизировать весь js (на выбор)
	.pipe(gulp.dest('app/js'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('sass', function() {
	return gulp.src('app/sass/**/*.sass')
	.pipe(sass({outputStyle: 'expanded'}).on("error", notify.onError()))
	.pipe(rename({suffix: '.min', prefix : ''}))
	.pipe(autoprefixer(['last 15 versions']))
	.pipe(cleanCSS()) // Опционально, закомментировать при отладке
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('code', function() {
	return gulp.src('app/**/*.html')
	.pipe(browserSync.reload({ stream: true }))
});

gulp.task('watch', function() {
	gulp.watch('app/sass/**/*.sass', gulp.parallel('sass'));
	gulp.watch(['libs/**/*.js', 'app/js/common.js'], gulp.parallel('js'));
	gulp.watch('app/*.html', gulp.parallel('code'));
});

gulp.task('default', gulp.parallel('sass', 'js', 'browser-sync', 'watch'));
