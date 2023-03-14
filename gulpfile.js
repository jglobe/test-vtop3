import pkj from 'gulp';
const { src, dest, watch, series } = pkj;
import nunjucksRender from 'gulp-nunjucks-render';
import less from 'gulp-less';
import image from 'gulp-image';
import autoprefixer from 'gulp-autoprefixer';
import cssnano from 'gulp-cssnano';
import uglify from 'gulp-uglify';
import concat from 'gulp-concat';
import jsonFormat  from 'gulp-json-format';
import browsersync from 'browser-sync';

const path = {
  src: {
    html: 'src/pages/**/*.html',
    css: 'src/styles/layouts/**.css',
    images: 'src/images/*.{jpg,png,svg,gif,ico,webp}',
    js: 'src/scripts/*.js',
    json: 'src/scripts/*.json'
  },
  build: {
    html: 'dist',
    css: 'dist/styles',
    images: 'dist/images',
    js: 'dist/scripts',
  },
  server: {
    baseDir: './dist',
  },
  watcher: {
    html: 'src/**/*.html',
    css: 'src/styles/**/*.{less, css}',
    images: 'src/images/*.{jpg,png,svg,gif,ico,webp}',
    js: 'src/scripts/*.js',
    json: 'src/scripts/*.json',
  }
}

function htmlTask() {
  return src(path.src.html)
    .pipe(nunjucksRender({
      path: 'src/',
    })
  )
    .pipe(dest(path.build.html));
}

function cssTask() {
  return src(path.src.css, { sourcemaps: true })
    .pipe(less())
    .pipe(autoprefixer({
      Browserslist: ['last 8 versions'],
      cascade: true
    }))
    .pipe(cssnano({
      zindex: false,
      discardComments: {
          removeAll: true
      }
    }))
    .pipe(dest(path.build.css, { sourcemaps: '.' }))
}

function imagesTask() {
  return src(path.src.images)
    .pipe(image())
    .pipe(dest(path.build.images));
}

function jsTask() {
  return src(['node_modules/vivus/dist/vivus.min.js', path.src.js])
    .pipe(concat('index.js'))
    .pipe(uglify())
    .pipe(dest(path.build.js));
}

function jsonTask() {
  return src(path.src.json)
    .pipe(jsonFormat())
    .pipe(dest(path.build.js));
}

function browsersyncServe(cb) {
  browsersync.init({
    server: {
      baseDir: path.server.baseDir,
    }
  });
  cb();
}

function browsersyncReload(cb) {
  browsersync.reload();
  cb();
}

function watchTask(){
  watch(path.watcher.html, series(htmlTask, browsersyncReload));
  watch(path.watcher.images, series(imagesTask, browsersyncReload));
  watch(path.watcher.css, series(cssTask, browsersyncReload));
  watch(path.watcher.js, series(jsTask, browsersyncReload));
  watch(path.watcher.json, series(jsonTask, browsersyncReload));
}

const build = series(
  htmlTask,
  cssTask,
  imagesTask,
  jsTask,
  jsonTask
);

export { build };

export default series(
  htmlTask,
  cssTask,
  imagesTask,
  jsTask,
  jsonTask,
  browsersyncServe,
  watchTask
);
