
let projectFolder = 'dist';
let sourceFolder = '#src';

let path = {
    build: {
        html: `${projectFolder}/`,
        css: `${projectFolder}/css/`,
        js: `${projectFolder}/js/`,
        img: `${projectFolder}/img/`,
        fonts: `${projectFolder}/fonts/`,
    },
    src: {
        html: [`${sourceFolder}/*.html`, `!${sourceFolder}/_*.html`],
        css: `${sourceFolder}/scss/style.scss`,
        js: `${sourceFolder}/js/script.js`,
        img: `${sourceFolder}/img/**/*.{jpg,jpeg,png,svg,gif,ico,webp}`,
        fonts: `${sourceFolder}/fonts/**/*.{ttf}`,
    },
    watch: {
        html: `${sourceFolder}/**/*.html`,
        css: `${sourceFolder}/scss/**/*.scss`,
        js: `${sourceFolder}/**/*.js`,
        img: `${sourceFolder}/img/**/*.{jpeg,png,svg,gif,ico,webp}`,
    },
    clean: `./${projectFolder}/`
}

let {src, dest} = require('gulp'),
    gulp = require('gulp'),
    browsersync = require('browser-sync').create(),
    fileinclude = require('gulp-file-include'),
    del = require('del'),
    scss = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    groupMedia = require('gulp-group-css-media-queries'),
    cleanCss = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify-es').default,
    imagemin = require('gulp-imagemin'),
    webp = require('gulp-webp');
    webphtml = require('gulp-webp-html'),
    ttftowoff = require('gulp-ttf2woff'),
    ttftowoff2 = require('gulp-ttf2woff2');



function browserSync() {
    browsersync.init({
        server: {
            baseDir: `./${projectFolder}/`
        },
        port: 3000,
        notify: false
    });
}

function html() {
    return src(path.src.html)
        .pipe(fileinclude())
        .pipe(webphtml())
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream())
}

function css() {
    return src(path.src.css)
        .pipe(scss({
            outputStyle: 'expanded'
        }))
        .pipe(groupMedia())
        .pipe(autoprefixer({
            overrideBrowserlist: ["last 5 versions"],
            cascade: true
        }))
        .pipe(dest(path.build.css))
        .pipe(cleanCss())
        .pipe(rename({
            extname: ".min.css"
        }))
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream())
}

function js() {
    return src(path.src.js)
        .pipe(fileinclude())
        .pipe(dest(path.build.js))
        .pipe(uglify())
        .pipe(rename({
            extname: ".min.js"
        }))
        .pipe(dest(path.build.js))
        .pipe(browsersync.stream())
}

function images() {
    return src(path.src.img)
        .pipe(webp({
            quality: 70
        }))
        .pipe(dest(path.build.img))
        .pipe(src(path.src.img))
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            interlaced: true,
            optimizationLevel: 3
        }))
        .pipe(dest(path.build.img))
        .pipe(browsersync.stream())
}

function fonts() {
    src(path.src.fonts)
        .pipe(ttftowoff())
        .pipe(dest(path.build.fonts))
    return src(path.src.fonts)
        .pipe(ttftowoff2())
        .pipe(dest(path.build.fonts))
}

function watchfiles() {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.img], images);
}

function clean() {
    return del(path.clean);
}

let build = gulp.series(clean, gulp.parallel(js, css, html, images, fonts))
let watch = gulp.parallel(build, watchfiles, browserSync);


exports.fonts = fonts;
exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;
