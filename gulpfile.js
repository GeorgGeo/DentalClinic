const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create(); // Создание экземпляра
const autoprefixer = require('gulp-autoprefixer');
const del = require('del');
const spritesmith = require('gulp.spritesmith');
const merge = require('merge-stream');
const { inputPaths, outputPath } = require('./styles.config.js'); // Импорт конфигурации
const uglify = require('gulp-uglify-es').default;

// const imagemin = require('gulp-imagemin');
// const imagemin = await import('gulp-imagemin').then(module => module.default);

function browsersync() {
  browserSync.init({
    server: {
      baseDir: 'app/',
      serveStaticOptions: {
        extensions: ['html']
      }
    },
    port: 3000,
    files: ['app/css/*.css']
  });
}

function cleanDist() {
  return del('dist');
}

// function images() {
//   return src('app/images/**/*.*')
//     .pipe(
//       imagemin([
//         imagemin.gifsicle({ interlaced: true }),
//         imagemin.mozjpeg({ quality: 75, progressive: true }),
//         imagemin.optipng({ optimizationLevel: 5 }),
//         imagemin.svgo({
//           plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
//         }),
//       ])
//     )
//     .pipe(dest('dist/images'));
// }

async function images() {
  const imagemin = await import('gulp-imagemin').then(module => module.default);
  const imageminGifsicle = await import('imagemin-gifsicle').then(module => module.default);
  const imageminMozjpeg = await import('imagemin-mozjpeg').then(module => module.default);
  const imageminOptipng = await import('imagemin-optipng').then(module => module.default);
  const imageminSvgo = await import('imagemin-svgo').then(module => module.default);

  return src('app/images/**/*.*')
    .pipe(
      imagemin([
        imageminGifsicle({ interlaced: true }),
        imageminMozjpeg({ quality: 75, progressive: true }),
        imageminOptipng({ optimizationLevel: 5 }),
        imageminSvgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
        }),
      ])
    )
    .pipe(dest('dist/images'));
}



function scripts() {
  return src([
      'node_modules/jquery/dist/jquery.js',
      'node_modules/slick-carousel/slick/slick.js',
      'node_modules/slick-carousel/slick/slick.min.js',
      'node_modules/wow.js/dist/wow.js',
      'node_modules/wow.js/dist/wow.min.js',
      'app/js/jquery.selectric.js',
      'app/js/main.js',
    ])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('app/js'))
    .pipe(browserSync.stream());
}

function styles() {
  return src(inputPaths)
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(concat(outputPath))
    .pipe(
      autoprefixer({
        overrideBrowserslist: ['> 0.5%', 'last 2 versions', 'not dead', 'not ie <= 11'],
        grid: 'autoplace',
      })
    )
    .pipe(dest('app/css'))
    .pipe(browserSync.stream());
}

function buildApp() {
  return src(
    [
      'app/css/style.min.css',
      'app/fonts/**/*',
      'app/js/main.min.js',
      'app/*.html',
    ],
    { base: 'app' },
  ).pipe(dest('dist'));
}

function generateSprite() {
  const spriteData = src('app/sprite/**/*.*').pipe(
    spritesmith({
      imgName: 'sprite.png',
      imgPath: '../images/sprite.png',
      cssName: '_sprite.scss',
      padding: 5,
    }),
  );
  const imgStream = spriteData.img.pipe(dest('app/images'));
  const cssStream = spriteData.css.pipe(dest('app/scss/mixins'));

  return merge(imgStream, cssStream);
}

function fontsFontAwesome() {
  return src('node_modules/@fortawesome/fontawesome-free/webfonts/*').pipe(
    dest('app/fonts'),
  );
}

function watching() {
  browsersync();
  watch('app/fonts/**/*.*', fontsFontAwesome);
  watch('app/sprite/**/*.*', generateSprite);
  watch(['app/scss/**/*.scss'], styles);
  watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts);
  watch(['app/*.html']).on('change', browserSync.reload);
}


// Определение задачи build
const build = series(cleanDist, images, buildApp);

exports.styles = styles;
exports.watching = watching;
exports.browsersync = browsersync;
exports.scripts = scripts;
exports.images = images;
exports.cleanDist = cleanDist;
exports.generateSprite = generateSprite;
exports.fontsFontAwesome = fontsFontAwesome;
exports.build = build;  // Экспорт задачи build
exports.default = parallel(generateSprite, styles, scripts, browsersync, watching);


