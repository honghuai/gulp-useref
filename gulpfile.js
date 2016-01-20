var gulp = require('gulp'),
    useref = require('gulp-useref'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    clean = require('gulp-clean'),
    rev = require('gulp-rev'),
    revCollector = require('gulp-rev-collector'),
    rename = require('gulp-rename'),
    minifyCss = require('gulp-minify-css'),
    runSequence = require('gulp-sequence');
var myPath = {
    cssPath:"dist/css/*.css",
    jsPath:"dist/js/*.js",
    toCssPath:"dist/css",
    toJsPath:"dist/js",
    htmlPath:"asset/*/*.html",
    toHtmlPath:"dist/html/*.html"
}
var gulpBuild = {
    rev:function(path,toPath) {
       return gulp.src(path)
            .pipe(clean())
            .pipe(rev())
            .pipe(gulp.dest(toPath))
            .pipe(rev.manifest())
            .pipe(gulp.dest("dist/rev/"))
    },
    toHtml:function(path,toPath) {
        return gulp.src(["dist/rev/*.json",path])
            .pipe(revCollector())
            .pipe(gulp.dest(toPath))
    }
}
gulp.task("myUseref",function() {//合并css/js，压缩，输出到dist发布环境
    return gulp.src(myPath.htmlPath)
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(gulp.dest('dist'));
})
//移动css文件夹
gulp.task("transformCss",["cleanJsCss"],function() {
    return gulp.src(["css/*"])
        .pipe(gulp.dest(myPath.toCssPath));
})
//移动js文件夹
gulp.task("transformJs",function() {
    return gulp.src(["js/*"])
        .pipe(gulp.dest(myPath.toJsPath));
})
gulp.task("revCss",function() {
    gulpBuild.rev(myPath.cssPath,myPath.toCssPath);
})
gulp.task("revJs",function() {
    gulpBuild.rev(myPath.jsPath,myPath.toJsPath);
})
gulp.task("toHtml",function() {
    return gulp.src(["dist/rev/*.json",myPath.toHtmlPath])
        .pipe(revCollector())
        .pipe(gulp.dest("dist/html"))
})
/*清空css/js*/
gulp.task("cleanJsCss",function() {
    return gulp.src([myPath.cssPath,myPath.jsPath])
        .pipe(clean())
})
gulp.task("cleanJsCssAfter",function() {
    return gulp.src(["js","css"])
        .pipe(clean())
})
gulp.task("serve",function(cb) {
    runSequence("myUseref","cleanJsCss",["transformCss","transformJs","cleanJsCssAfter"],cb);
})

/*使用：
* 1.执行server，合并压缩css/js代码，输出到dist文件目录下，同时清除其他目录的多余的css/js文件
* 2.执行revCss+toHtml，给css加MD5后缀，同时改变html代码引用的路径
* 3.执行revJs+toHtml,给js加MD5后缀，同时改变html代码引用的路径*/

/*附带rename的使用：测试如下*/
gulp.task("rename",function() {
    return gulp.src("dist/css/detail.min.css")
        .pipe(rename(function(path) {
            path.basename += "-honghuai";
            //path.extname =".md";
        }))
        .pipe(gulp.dest("dist/DETAIL"))

})
