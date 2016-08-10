"use strict";

var gulp = require("gulp"),
    zip = require("gulp-zip"),
    sass = require("gulp-sass"),
    server = require("gulp-express"),
    minifier = require("gulp-uglify/minifier"),
    uglifyjs = require("uglify-js-harmony"),
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
        .pipe(sass({
            outputStyle: "compressed"
        }).on("error", sass.logError))
        .pipe(gulp.dest("dist"));
});

gulp.task("uglify", ["clean"], function (cb) {
    var options = {
        mangle: true
    };
    pump([
        gulp.src("src/*.js"),
        minifier(options, uglifyjs),
        gulp.dest("dist")
    ], cb);
});

gulp.task("zip", ["clean", "sass", "uglify", "copy"], function () {
    return gulp.src("dist/*")
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