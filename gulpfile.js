var gulp = require('gulp'),
  cleanCSS = require('gulp-clean-css'),
  jshint = require('gulp-jshint'),
  stylish = require('jshint-stylish'),
  uglify = require('gulp-uglify'),
  usemin = require('gulp-usemin'),
  imagemin = require('gulp-imagemin'),
  rename = require('gulp-rename'),
  concat = require('gulp-concat'),
  cache = require('gulp-cache'),
  changed = require('gulp-changed'),
  rev = require('gulp-rev'),
  browserSync = require('browser-sync'),
  del = require('del'),
  ngannotate = require('gulp-ng-annotate'),
  bower = require("gulp-bower"),
  sourcemaps = require('gulp-sourcemaps');

var APP_FOLDER_SOURCE = process.argv[4];
var APP_FOLDER_TARGET = process.argv[6];
var BOWER_FOLDER = process.argv[8];


//download libs
gulp.task('bower', function () {
  return bower(BOWER_FOLDER);
});

gulp.task('jshint', function () {
  return gulp.src([APP_FOLDER_SOURCE + '/scripts/**/*.js', APP_FOLDER_SOURCE + '/view/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

// Clean
gulp.task('clean', function () {
  /*del([APP_FOLDER_TARGET + "/*", '!' + APP_FOLDER_TARGET + "/META-INF", '!' + APP_FOLDER_TARGET + "/WEB-INF"], {
      force: true
    }).then(paths => {
    console.log('Deleted files and folders:\n', paths.join('\n'));
  });*/
  /*return del([APP_FOLDER_TARGET+"/" , '!'+APP_FOLDER_TARGET + "/META-INF/*", '!'+APP_FOLDER_TARGET + "/WEB-INF/*"], {
  //return del([APP_FOLDER_TARGET], {
    force: true
  });*/
});

// Default task
gulp.task('default', ['clean', 'bower'], function () {
  gulp.start('usemin', 'imagemin', 'copyfonts', 'copyview', 'copymockapi');
});


gulp.task('usemin', ['jshint'], function () {
  return gulp.src(APP_FOLDER_SOURCE + '/index.jsp')
    .pipe(usemin({
      css: [cleanCSS({
        compatibility: 'ie8'
      }), rev()],
      js_scripts: [ /*sourcemaps.init(), ngannotate(), uglify(), rev() /*, sourcemaps.write()*/ ],
      js_vendor: [ /*sourcemaps.init(),*/ ngannotate(), uglify(), rev() /*,sourcemaps.write()*/ ]
    }))
    .pipe(gulp.dest(APP_FOLDER_TARGET));
});

// Images
gulp.task('imagemin', function () {
  return del([APP_FOLDER_TARGET + '/images']), gulp.src(APP_FOLDER_SOURCE + '/images/**/*')
    .pipe(cache(imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest(APP_FOLDER_TARGET + '/images'));
  gulp.src(APP_FOLDER_SOURCE + '/images/favicon.ico').pipe(gulp.dest(APP_FOLDER_TARGET + '/images'));
});

gulp.task('copyview', function () {
  gulp.src([APP_FOLDER_SOURCE + '/view/**/*.jsp', APP_FOLDER_SOURCE + '/view/**/*.html', APP_FOLDER_SOURCE + '/components/**/*.html'])
    .pipe(gulp.dest(APP_FOLDER_TARGET + '/view'));

  gulp.src([APP_FOLDER_SOURCE + '/components/**/*.html'])
    .pipe(gulp.dest(APP_FOLDER_TARGET + '/components'));
});

gulp.task('copymockapi', function () {
  gulp.src(APP_FOLDER_SOURCE + '/mock-api-data/**/*')
    .pipe(gulp.dest(APP_FOLDER_TARGET + '/mock-api-data'));
});

gulp.task('copyWEB-INF', function () {
  gulp.src('../WEB-INF/**/*')
    .pipe(gulp.dest(APP_FOLDER_TARGET + '/WEB-INF'));
});

gulp.task('copyfonts', ['clean'], function () {
  gulp.src(BOWER_FOLDER + '/font-awesome/fonts/**/*.{ttf,woff,eof,svg}*')
    .pipe(gulp.dest(APP_FOLDER_TARGET + '/fonts'));
  gulp.src(BOWER_FOLDER + '/bootstrap/dist/fonts/**/*.{ttf,woff,eof,svg}*')
    .pipe(gulp.dest(APP_FOLDER_TARGET + '/fonts'));
});

//TODO: capire come sistemarlo

// Watch
gulp.task('watch', ['sync-tomcat'], function () {
  // Watch .js files
  gulp.watch('{app/scripts/**/*.js,app/styles/**/*.css,app/**/*.jsp}', ['usemin']);

  gulp.watch('app/view/**/*.*.js', ['usemin']);

  // Watch image files
  gulp.watch('app/images/**/*', ['imagemin']);

  gulp.watch('app/view/**/*.jsp', ['copyview']);

});

gulp.task('watch-file', function () {
  gulp.watch([APP_FOLDER_SOURCE + "/**"]).on('change', function () {
    gulp.start('sync-tomcat');
  });
});

gulp.task('sync-tomcat', ['usemin', 'imagemin', 'copyfonts', 'copyview', 'copymockapi'], function () {
  console.log("copy");
  gulp.src(APP_FOLDER_TARGET + "/**").pipe(gulp.dest("/myprg/01-AS/Tomcat/0011-ARAMIS-tomcat-7.0.55/webapps/crossfilter-dashboard"));
});

gulp.task('browser-sync', ['default'], function () {
  var files = [
    'app/**/*.jsp',
    'app/styles/**/*.css',
    'app/images/**/*.png',
    'app/scripts/**/*.js',
    'app/view/**/*.js',
    'app/view/**/*.jsp',
    'dist/**/*.*',
    'dist/**/*.jsp',
    'dist/*.jsp'
  ];

  setTimeout(function () {
    browserSync.init(files, {
      server: {
        baseDir: "../webapp",
        index: "index.jsp"
      }
    });
  }, 3600);

  // Watch any files in dist/, reload on change
  gulp.watch(['dist/**']).on('change', browserSync.reload);

});