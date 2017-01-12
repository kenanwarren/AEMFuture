'use strict';

//////////////////////////////////////////////////////////
// Configuration variables
//////////////////////////////////////////////////////////

var paths = {
    precompiledScripts: ['**/clientlibs/es6/*.es6'],
    compiledScripts: ['**/clientlibs/js/*.js'],
    precompiledStyles: ['**/clientlibs/sass/*.scss'],
    compiledStyles: ['**/clientlibs/css/*.css'],
    noCompFileTypes: ['**/*.jsp', '**/*.txt'],
    tests: ['**/clientlibs/es6/test/*.es6'],
    libs: [],
    html: [],
    images: [],
    extras: [],
};

var properties = {
    username: 'admin',
    password: 'admin',
    repoName: 'myproject',
    jcrRootName: 'jcr_root'
}



// Imports for tasks
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    rename = require('gulp-rename'),
    babel = require('gulp-babel'),
    mocha = require('gulp-mocha'),
    runSequence = require('run-sequence'),
    autoprefixer = require('gulp-autoprefixer'),
    shell = require('gulp-shell'),
    uglify = require('gulp-uglify'),
    livereload = require('gulp-livereload'),
    jssourcemaps = require('gulp-sourcemaps'),
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber'),
    gutil = require('gulp-util');


gulp.task('default', ['watch']);

var filePath;

var beepError = function(err) {
    gutil.beep();
    console.log(err);
}

//////////////////////////////////////////////////////////
// Watch Tasks
//////////////////////////////////////////////////////////

gulp.task('watch', function() {
    livereload.listen();
    gulp.watch(paths.precompiledStyles, function(event) {
        filePath = event.path.split(properties.jcrRootName)[1]
            .replace(/sass/g, 'css')
            .replace(/scss/g, 'css');
        gulp.start('curl-vault-css');
    });

    gulp.watch(paths.precompiledScripts, function(event) {
        filePath = event.path.split(properties.jcrRootName)[1]
            .replace(/es6/g, 'js');
        runSequence('test', 'curl-vault-js');
    });

    gulp.watch(paths.noCompFileTypes, function(event) {
        filePath = event.path.split(properties.jcrRootName)[1];
        gulp.start('curl-general-livereload');
    });

    gulp.watch(paths.tests, ['test']);
});

gulp.task('curl-general-livereload', function() {
  return gulp.src('')
      .pipe(plumber({
          errorHandler: beepError
      }))
      .pipe(shell([
          'curl -u ' + properties.username + ':' + properties.password + ' -s -T ' + '.' + filePath + ' http://localhost:4502' + filePath,
      ]))
      .pipe(notify({
          onLast: true,
          title: 'JSP/TXT complete',
          message: ' ',
          icon: "./growl-icons/jsp.png"
      }))
      .pipe(livereload());
});

//////////////////////////////////////////////////////////
// SaSS Tasks
//////////////////////////////////////////////////////////
gulp.task('sass', function() {
    return gulp.src(paths.precompiledStyles)
        .pipe(sass().on('error', sass.logError))
        .pipe(rename(function(path) {
            path.dirname += "/../css";
            return path;
        }))
        .pipe(autoprefixer({
            browsers: ['> 1%', 'last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest(''));
});

gulp.task('curl-vault-css', ['sass'], function() {
    return gulp.src('')
        .pipe(plumber({
            errorHandler: beepError
        }))
        .pipe(shell([
            'curl -u ' + properties.username + ':' + properties.password + ' -s -T ' + '.' + filePath + ' http://localhost:4502' + filePath,
        ]))
        .pipe(notify({
            onLast: true,
            title: 'CSS complete',
            message: ' ',
            icon: "./growl-icons/css.jpg"
        }))
        .pipe(livereload());
});


//////////////////////////////////////////////////////////
// ES2015 Tasks
// This does not include promises, generators, and
// the new static methods yet. To do this I need to
// figure out how to get the polyfills in as a global js
// file. Similar to jQuery being pulled in.
//////////////////////////////////////////////////////////
gulp.task('babel', function() {
    return gulp.src(paths.precompiledScripts)
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(rename(function(path) {
            path.dirname += "/../js";
            return path;
        }))
        .pipe(gulp.dest(''));
});

gulp.task('curl-vault-js', ['babel'], function() {
    return gulp.src('')
        .pipe(plumber({
            errorHandler: beepError
        }))
        .pipe(shell([
            'curl -u ' + properties.username + ':' + properties.password + ' -s -T ' + '.' + filePath + ' http://localhost:4502' + filePath,
        ]))
        .pipe(notify({
            onLast: true,
            title: 'JS complete',
            message: ' ',
            icon: "./growl-icons/js.png"
        }))
        .pipe(livereload());
});

gulp.task('compressjs', function() {
    return gulp.src(paths.compiledScripts)
        .pipe(uglify())
        .pipe(gulp.dest(''));
});


//////////////////////////////////////////////////////////
// Testing Tasks
//////////////////////////////////////////////////////////
gulp.task('test', function() {
    var babelHook = require('babel-core/register');
    return gulp.src(paths.tests)
        .pipe(mocha({
            reporter: 'nyan',
            compilers: {
                js: babelHook
            }
        }));
});

//////////////////////////////////////////////////////////
// Combined Tasks
//////////////////////////////////////////////////////////
gulp.task('build', function(callback) {
    runSequence('test', ['sass', 'babel'],
        callback);
});


//////////////////////////////////////////////////////////
// Build Scripts
// Not yet working
//////////////////////////////////////////////////////////

gulp.task('build-publish', function() {
    return gulp.src('')
        .pipe(shell([
            'mvn clean install -Dcrx.url=http://localhost:4502 -Dsling.install.skip=true -Dcq5.install.skip=false'
        ], {
            cwd: './' + properties.repoName + '/'
        }));
});

gulp.task('build-publish-3rdpartyjars', function() {
    return gulp.src('')
        .pipe(shell([
            'mvn clean install sling:install -Dcrx.url=http://localhost:4502 -Dsling.install.skip=false'
        ], {
            cwd: './' + properties.repoName + '/'
        }));
});

gulp.task('build-author', function() {
    return gulp.src('')
        .pipe(shell([
            'mvn clean install -Dsling.install.skip=true -Dcq5.install.skip=false'
        ], {
            cwd: './' + properties.repoName + '/'
        }));
});

gulp.task('build-author-3rdpartyjars', function() {
    return gulp.src('')
        .pipe(shell([
            'mvn clean install sling:install -Dsling.install.skip=false'
        ], {
            cwd: './' + properties.repoName + '/'
        }));
});
