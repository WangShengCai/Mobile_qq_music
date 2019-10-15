// gulp.task()      创建任务，执行队列
// gulp.src()       找到文件
// gulp.dest()      插入文件
// gulp.watch()     事件监听

var gulp = require('gulp');
// 防止以后更改开发路径名称，不用劳师动众
var folder = {
    src:"./src/",
    dist:"./dist/",
}
// 判断当前属于开发环境还是生产环境
var devMod = process.env.NODE_ENV == 'development';
// export NODE_ENV=development  要在命令行设置当前环境变量
console.log(devMod);//true      需要说明的是，我已经在命令行强行将所处的环境设置成了 开发者模式

// 压缩HTMlL               下载插件——》取到插件——》应用插件
var htmlClean = require('gulp-htmlclean');
// 将less转换为css         下载插件——》取到插件——》应用插件
var gulpLess = require('gulp-less');
// 自动添加前缀             下载插件——》取到插件——》应用插件
var postCss = require('gulp-postcss');
var autoPrefixer = require('autoprefixer');
// 压缩css                 下载插件——》取到插件——》应用插件
var cleanCss = require('gulp-clean-css');
// 压缩js                  下载插件——》取到插件——》应用插件
var uglify = require('gulp-uglify');
// 压缩图片                下载插件——》取到插件——》应用插件
var imageMin = require('gulp-imagemin');
// 压缩js中的调试语句       下载插件——》取到插件——》应用插件
var stripDebug = require('gulp-strip-debug');
// 开启本地服务器           下载插件——》取到插件——》应用插件
var connect = require('gulp-connect');



gulp.task("html",function () {
    var page = gulp.src(folder.src + "html/*")
        .pipe(connect.reload())/*自动刷新文件*/
        if(!devMod) {
            page.pipe(htmlClean());
        }
        page.pipe(gulp.dest(folder.dist + "html/"))
})

gulp.task("image",function () {
    gulp.src(folder.src + "image/*")
        .pipe(imageMin())
        .pipe(gulp.dest(folder.dist + "image/"))
})

gulp.task("css",function () {
    var page = gulp.src(folder.src + "css/*")
        .pipe(connect.reload())/*自动刷新文件*/
        .pipe(gulpLess())
        .pipe(postCss([autoPrefixer]))
        if(!devMod) {
            page.pipe(cleanCss());
        }
        page.pipe(gulp.dest(folder.dist + "css/"))
})

gulp.task("js",function () {
    var page = gulp.src(folder.src + "js/*")
        .pipe(connect.reload())/*自动刷新文件*/
        if(!devMod) {
            // page.pipe(stripDebug());
            page.pipe(uglify());
        }
        page.pipe(gulp.dest(folder.dist + "js/"))
})
// 开启本地服务器
gulp.task("server",function () {
    connect.server({
        livereload:true,/*自动刷新浏览器页面*/
        port:'8888',
    });
})
// 监听本地所有文件
gulp.task("watch",function () {
    gulp.watch(folder.src + "html/*",["html"]);
    gulp.watch(folder.src + "css/*",["css"]);
    gulp.watch(folder.src + "js/*",["js"]);
})

gulp.task("default",["html","css","js","image","server","watch"])