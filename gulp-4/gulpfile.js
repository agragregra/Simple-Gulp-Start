import pkg from 'gulp'
const { src, dest, parallel, series, watch } = pkg

import browserSync   from 'browser-sync'
import gulpSass      from 'gulp-sass'
import * as dartSass from 'sass'
const  sassModule    = gulpSass(dartSass)
import postCss       from 'gulp-postcss'
import cssnano       from 'cssnano'
import concat        from 'gulp-concat'
import uglify        from 'gulp-uglify'
import autoprefixer  from 'autoprefixer'

function browsersync() {
	browserSync.init({
		server: {
			baseDir: 'app/'
		},
		ghostMode: { clicks: false },
		notify: false,
		online: true,
		// tunnel: 'yousutename', // Attempt to use the URL https://yousutename.loca.lt
	})
}

function js() {
	return src([
		'app/libs/jquery/dist/jquery.min.js',
		'app/js/common.js', // Always at the end
		])
	.pipe(concat('scripts.min.js'))
	.pipe(uglify()) // Mifify js (opt.)
	.pipe(dest('app/js'))
	.pipe(browserSync.stream())
}

function sass() {
	return src('app/sass/**/*.sass')
		.pipe(sassModule({ 'include css': true }))
		.pipe(postCss([
			autoprefixer({ grid: 'autoplace' }),
			cssnano({ preset: ['default', { discardComments: { removeAll: true } }] })
		]))
		.pipe(concat('main.min.css'))
		.pipe(dest('app/css'))
		.pipe(browserSync.stream())
}

function startwatch() {
	watch(['app/sass/**/*.sass'], { usePolling: true }, sass)
	watch(['app/js/common.js', 'app/libs/**/*.js'], { usePolling: true }, js)
	watch(['app/*.html'], { usePolling: true }).on('change', browserSync.reload)
}

export { sass, js }
export let assets = series(sass, js)

export default series(sass, js, parallel(browsersync, startwatch))
