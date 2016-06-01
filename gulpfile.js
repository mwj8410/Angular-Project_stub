var concat = require('gulp-concat-util');
var embedTemplates = require('gulp-angular-embed-templates');
var gulp = require('gulp');
var minifyCss = require('gulp-clean-css');
var htmlmin = require('gulp-html-minifier');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');

var stagingPath = 'build/staging/html5/',
  prepPath = 'build/prep/html5/',

  htmlPattern = ['src_ui/index.html', 'src_ui/**/*.html', '!src_ui/**/*.template.html'],
  jsPattern = ['src_ui/**/*.js', '!src_ui/**/*.spec.js'];

gulp.task('default', ['stage'])

  // Composit Tasks
  .task('watch', ['stage', 'html:watch', 'style:watch', 'js:watch'])
  
  .task('stage', ['html:stage', 'style:stage', 'js:stage', 'lib:stage'])
  .task('prep', ['html:prep', 'style:prep', 'js:prep', 'lib:prep'])
  .task('build', ['stage', 'prep'])
  
  // HTML
  .task('html:stage', function () {
    return gulp.src(htmlPattern)
      .pipe(gulp.dest(stagingPath));
  })
  .task('html:prep', function () {
    return gulp.src(stagingPath + 'index.html')
      .pipe(htmlmin({
        collapseWhitespace: true,
        removeComments: true
      }))
      .pipe(gulp.dest(prepPath));
  })
  .task('html:watch', function () {
    gulp.watch(htmlPattern, ['html:stage']);
  })

  // Styles
  .task('style:stage', function () {
    return gulp.src(
      [
        'src_ui/core/style/*.style.scss',
        'src_ui/core/style/**/*.style.scss',
        'src_ui/core/index.style.scss', // Index must be the last of core.
        'src_ui/components/**/*.style.scss',
        'src_ui/views/**/*.style.scss'
      ])
      .pipe(concat(''))
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest(stagingPath));
  })
  .task('style:prep', function () {
    return gulp.src(stagingPath + 'index.style.css')
      .pipe(minifyCss())
      .pipe(gulp.dest(prepPath))
  })
  .task('style:watch', function () {
    gulp.watch('src_ui/**/*.scss', ['style:stage']);
  })

  // Javascript
  .task('js:stage', function () {
    return gulp.src(
      [
        'src_ui/app.js',
        'src_ui/services/**/*.js', '!src_ui/services/**/*.spec.js',
        'src_ui/components/**/*.component.js',
        'src_ui/modules/**/*.js', '!src_ui/modules/**/*.spec.js',
        'src_ui/views/**/*.js', '!src_ui/views/**/*.spec.js',
      ])
      .pipe(embedTemplates())
      .pipe(concat('app.js'))
      .pipe(gulp.dest(stagingPath));
  })
  .task('js:prep', function() {
    return gulp.src(stagingPath + 'app.js')
      .pipe(uglify())
      // .pipe(rename({ suffix: '.min' }))
      .pipe(gulp.dest(prepPath));
  })
  .task('js:watch', function () {
    gulp.watch(jsPattern, ['js:stage']);
  })

  // Other Assets
  .task('lib:stage', function() {
    return gulp.src([
      'node_modules/angular/angular.min.js',
      'node_modules/lodash/lodash.min.js'
      ])
      .pipe(gulp.dest(stagingPath + 'lib/'));
  })
  .task('lib:prep', function() {
    return gulp.src([
      'node_modules/angular/angular.min.js',
      'node_modules/lodash/lodash.min.js'
      ])
      .pipe(gulp.dest(prepPath + 'lib/'));
  })
;
