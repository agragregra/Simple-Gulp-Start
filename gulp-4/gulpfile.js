import pkg from 'gulp'
const { src, dest, parallel, series, watch } = pkg

import browserSync   from 'browser-sync'
import gulpSass      from 'gulp-sass'
import * as dartSass from 'sass'
const  sassfn        = gulpSass(dartSass)
import postCss       from 'gulp-postcss'
import cssnano       from 'cssnano'
import concat        from 'gulp-concat'
import rename        from 'gulp-rename'
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
		'app/js/common.js', // Всегда в конце
		])
	.pipe(concat('scripts.min.js'))
	.pipe(uglify()) // // Minify libs.js
	.pipe(dest('app/js'))
	.pipe(browserSync.stream())
}

function sass() {
	return src(['app/sass/**/*.sass'])
		.pipe(sassfn({ 'include css': true }))
		.pipe(postCss([
			autoprefixer({ grid: 'autoplace' }),
			cssnano({ preset: ['default', { discardComments: { removeAll: true } }] })
		]))
		.pipe(rename({suffix: '.min', prefix : ''}))
		.pipe(dest('app/css'))
		.pipe(browserSync.stream())
}

function startwatch() {
	watch(['app/sass/**/*.sass'], { usePolling: true }, sass)
	watch(['app/js/common.js', 'app/libs/**/*.js'], { usePolling: true }, js)
	watch(['app/*.html'], { usePolling: true }).on('change', browserSync.reload)
}

export { js, sass }
export let assets = series(js, sass)

export default series(js, sass, parallel(browsersync, startwatch))
