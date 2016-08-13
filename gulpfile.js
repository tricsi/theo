"use strict";

let gulp = require("gulp"),
    zip = require("gulp-zip"),
    sass = require("gulp-sass"),
    size = require("gulp-size"),
    concat = require("gulp-concat"),
    insert = require("gulp-insert"),
    server = require("gulp-express"),
    minifier = require("gulp-uglify/minifier"),
    uglifyjs = require("uglify-js-harmony"),
    sourcemaps = require('gulp-sourcemaps'),
    pump = require("pump"),
    del = require("del");

gulp.task("clean", function () {
    return del(["dist"]);
});

gulp.task("copy", ["clean"], function () {
    gulp.src("src/*.html")
        .pipe(gulp.dest("dist"));
});

gulp.task("sass", ["clean"], function () {
    return gulp.src("src/*.scss")
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: "compressed"
        }).on("error", sass.logError))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("dist"));
});

gulp.task("uglify", ["clean"], function (cb) {
    pump([
        gulp.src(["src/js/*.js", "src/script.js"]),
        concat("script.js"),
        insert.transform(function(contents, file) {
            return 'onload = function () {\n' + contents + '};';
        }),
        sourcemaps.init(),
        minifier({mangle: true}, uglifyjs),
        insert.prepend('"use strict";\n'),
        sourcemaps.write("."),
        gulp.dest("dist")
    ], cb);
});

gulp.task("zip", ["clean", "sass", "uglify", "copy"], function () {
    return gulp.src(["dist/*.html", "dist/*.js", "dist/*.css"])
        .pipe(zip("dist.zip"))
        .pipe(size({title: "Build", pretty: false}))
        .pipe(gulp.dest("."));
});

gulp.task("server", ["default"], function () {
    server.stop();
    server.run(["index.js"]);
});

gulp.task("watch", ["server"], function () {
    gulp.watch("src/**/*.*", ["server"]);
});

gulp.task("default", ["clean", "sass", "uglify", "copy", "zip"]);