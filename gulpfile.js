"use strict";

let gulp = require("gulp"),
    zip = require("gulp-zip"),
    sass = require("gulp-sass"),
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
    var options = {
        mangle: true
    };
    pump([
        gulp.src("src/*.js"),
        sourcemaps.init(),
        minifier(options, uglifyjs),
        sourcemaps.write("."),
        gulp.dest("dist")
    ], cb);
});

gulp.task("zip", ["clean", "sass", "uglify", "copy"], function () {
    return gulp.src(["dist/*.html", "dist/*.js", "dist/*.css"])
        .pipe(zip("dist.zip"))
        .pipe(gulp.dest("."));
});

gulp.task("server", ["default"], function () {
    server.stop();
    server.run(["index.js"]);
});

gulp.task("watch", ["server"], function () {
    gulp.watch("src/*.*", ["server"]);
});

gulp.task("default", ["clean", "sass", "uglify", "copy", "zip"]);