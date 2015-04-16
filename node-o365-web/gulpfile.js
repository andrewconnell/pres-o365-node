'use strict';

var gulp       = require('gulp'),
    debug      = require('gulp-debug'),
    inject     = require('gulp-inject'),
    tsc        = require('gulp-typescript'),
    tslint     = require('gulp-tslint'),
    sourcemaps = require('gulp-sourcemaps'),
    clean      = require('gulp-clean'),
    nodemon    = require('gulp-nodemon'),
    inspector  = require('gulp-node-inspector'),
    Config     = require('./gulpfile.config');

var config = new Config();

/**
 * Generates the server.d.ts references file dynamically from all application *.ts files.
 */
gulp.task('gen-server-tsrefs', function () {
  var target  = gulp.src(config.serverTsDefList);
  var sources = gulp.src([config.allServerTypeScript], {read: false});
  return target.pipe(inject(sources, {
    starttag : '//{',
    endtag   : '//}',
    transform: function (filepath) {
      return '/// <reference path="../..' + filepath + '" />';
    }
  })).pipe(gulp.dest(config.typings));
});

/**
 * Lint all custom TypeScript files.
 */
gulp.task('lint', function () {
  return gulp.src(config.allTypeScript)
      .pipe(tslint())
      .pipe(tslint.report('prose'));
});

/**
 * Compile TypeScript and include references ttsdo library and server.d.ts files.
 */
gulp.task('compile-server-ts', function () {
  var sourceTsFiles = [config.allServerTypeScript,  // path to typescript files
    config.libTsDefs,                               // typescript definitions
    config.libTsDefList,                            // reference to tsd.d.ts file
    config.serverTsDefList];                        // reference to server.d.ts file

  var tsResult = gulp.src(sourceTsFiles)
      .pipe(sourcemaps.init())
      .pipe(tsc({
        target           : 'ES5',
        module           : 'commonjs',
        declarationFiles : false,
        noExternalResolve: true
      }));

  tsResult.dts.pipe(gulp.dest(config.serverApp));
  return tsResult.js
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(config.serverApp));
});

/**
 * Remove all generated JavaScript files from TypeScript compilation.
 */
gulp.task('clean-ts', function () {
  var typeScriptGenFiles = [
    config.source + '**/*.js',    // path to all JS files auto gen'd by editor
    config.source + '**/*.js.map' // path to all sourcemap files auto gen'd by editor
  ];

  // delete the files
  return gulp.src(typeScriptGenFiles, {read: false})
      .pipe(clean());
});

/**
 * Setup node inspector to debug app.
 */
gulp.task('inspector', function () {
  // start node inspector
  gulp.src([])
      .pipe(inspector({
        debugPort      : 5858,
        webHost        : '127.0.0.1',
        webPort        : 8080,
        saveLiveEdit   : false,
        preload        : true,
        inject         : true,
        hidden         : [],
        stackTraceLimit: 50
      }));
});

/**
 * Watch for changes in TypeScript, linting, updating references & recompiling code.
 */
gulp.task('watch', function () {
  gulp.watch([config.allTypeScript], ['lint', 'gen-server-tsrefs', 'compile-server-ts']);
});

/**
 * Watches all server side file changes (TypeScript & Handlebars views) for changes.
 * When detected, lints, generates TypeScript references in *.d.ts files & compiles
 * all TypeScript to JavaScript, then restarts the Node.js server.
 */
gulp.task('watch-nodemon', function () {
  // start nodemon
  nodemon({
    script : 'src/server/server.js',
    ext    : 'hbs js',
    execMap: {
      "js": "node --debug"
    },
    tasks  : ['lint', 'gen-server-tsrefs', 'compile-server-ts']
  }).on('message', function (event) {
    if (event.type === 'start') {
      console.log('>>>>>>>>>>>>> STARTED NODE.JS WEBSERVER <<<<<<<<<<<<<');
    } else if (event.type === 'restart') {
      console.log('>>>>>>>>>>>>> RESTARTED NODE.JS WEBSERVER <<<<<<<<<<<<<');
    } else if (event.type === 'crash') {
      console.log('!!!!!!!!!!!!! NODE.JS SERVER CRASHED FOR SOME REASON !!!!!!!!!!!!!');
    }
  });
});

/* default gulp task */
gulp.task('default', ['lint', 'gen-server-tsrefs', 'compile-server-ts', 'watch']);
