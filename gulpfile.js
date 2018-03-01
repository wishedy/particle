/**
 * @name:gulpfile.js
 * @desc:医鼎项目构建自动化工程
 * @example:
 *              gulp concat将目标文件压缩合并至build内
 *              gulp build遍历全部html文件并替换文件
 * @depend:
 * @date: 2017/1/17
 * @author: qiangkailiang
 */

var gulp = require("gulp"),
    sass = require("gulp-sass"),
    autoprefixer = require("gulp-autoprefixer"),
    cleancss = require("gulp-clean-css"),
    concat = require("gulp-concat"),
    uglify = require("gulp-uglify"),
    pump = require("pump"),
    htmlreplace = require('gulp-html-replace');

/*Gulp-Sass编译自动化工程*/
//Task:watch   监听Sass文件变化并自动编译
//Task:bs         hot-reload监听全项目文件，保存后浏览器自动刷新
gulp.task("watch", function() {
    gulp.watch("scss/**/*.scss", ['sass']);
});

gulp.task("sass", function() {
    return gulp.src("scss/**/*.scss").
    pipe(sass({ style: "expanded" })).
    pipe(cleancss({
        advanced: false,
        compatibility: 'ie8',
        keepBreaks: false,
        keepSpecialComments: '*'
    })).
    pipe(autoprefixer({
        browsers: ['Android >= 3.5', 'last 4 versions', 'ie >= 8', 'ie_mob >= 10', 'ff >= 30', 'chrome >= 34', 'safari >= 6', 'opera >= 12.1', 'ios >= 6', 'bb >= 10'],
        cascode: true
    })).
    pipe(gulp.dest("css/"));
});

gulp.task('bs', function() {
    var files = ['pages/**/*.html', 'design-html/**/*.html', 'css/**/*','js/**/*'];
    browserSync.init(files, {
        server: {
            baseDir: "/"
        }
    });
});

/*End*/
/*压缩合并工程*/
/*all comm => comm.js*/
gulp.task('compress-comm', function (cb) {
    pump([
            gulp.src([
                'js/common/main.js',
                "js/common/documentLink.js",
                'js/common/common.js',
                'js/common/comm.func.js',
                'js/common/comm-customer.js',
                'js/common/comm-data.js',
                'js/common/comm.file.js',
                'js/common/comm_service.js',
                'js/common/comm.cutArray.js',
                "js/common/comm.autoHeight.js",
                "js/common/comm.lightBox.js",
                "js/common/jweixin-1.0.0.js",
                'js/common/comm.log.js',
                "js/common/log.js",
                //"js/common/shareAll.js",
                "js/common/comm.date.js",
                'js/scene/authority/authBuild.js',
                'js/scene/authority/login.js',
                'js/scene/authority/register.js'
            ]),
            uglify(),
            concat('common.js'),
            gulp.dest('build')
        ],cb);
});
gulp.task('compress-course-comm', function (cb) {
    pump([
        gulp.src([
            "js/common/documentLink.js",
            'js/common/main.js',
            'js/common/common.js',
            'js/common/comm-customer.js',
            'js/common/comm-data.js',
            'js/common/comm.file.js',
            'js/common/comm_service.js',
            'js/common/comm.cutArray.js',
            "js/common/comm.autoHeight.js",
            "js/common/jweixin-1.0.0.js",
            'js/common/comm.log.js',
            "js/common/log.js",
            //"js/common/shareAll.js",
            "js/common/comm.date.js",
            'js/scene/authority/authentication.js',
            'js/scene/authority/login.js',
            'js/scene/authority/register.js'
        ]),
        uglify(),
        concat('course-common.js'),
        gulp.dest('build')
    ],cb);
});
/*压缩合并工程*/
/*all comm => comm.js*/
gulp.task('compress-comm-new', function (cb) {
    pump([
        gulp.src([
            "js/common/documentLink.js",
            "js/common/fastclick.js",
            'js/common/main.js',
            'js/common/common.js',
            'js/common/comm.func.js',
            'js/common/comm-customer.js',
            'js/common/comm-data.js',
            'js/common/comm.file.js',
            'js/common/comm_service.js',
            'js/common/comm.cutArray.js',
            "js/common/comm.autoHeight.js",
            "js/common/jweixin-1.0.0.js",
            'js/common/comm.log.js',
            "js/common/log.js",
            //"js/common/shareAll.js",
            "js/common/comm.date.js",
            'js/scene/authority/authentication.js',
            'js/scene/authority/revision.login.js',
            'js/scene/authority/revision.register.js'
        ]),
        uglify(),
        concat('newcommon.js'),
        gulp.dest('build')
    ],cb);
});
/*all jquery => jqAll.js*/
gulp.task('compress-jq', function (cb) {
    pump([
            gulp.src([
                'js/third-party/jquery/jquery.json-2.4.js',
                'js/third-party/jqueryscrollpagination/js/scrollpagination.js',
                'js/third-party/jquery-form/jquery.form.js',
                //'js/third-party/jquery-qrcode-master/jquery.qrcode.min.js'
            ]),
            uglify(),
            concat('jqAll.js'),
            gulp.dest('build')
        ], cb);
});
/*all authority => login.js*/
gulp.task('compress-login', function (cb) {
    pump([
            gulp.src([
                'js/scene/authority/authBuild.js',
                'js/scene/authority/login.js',
                'js/scene/authority/register.js'
            ]),
            uglify(),
            concat('login.js'),
            gulp.dest('build')
        ], cb);
});
/*all compatility => compatility.js*/
gulp.task('compress-compat', function (cb) {
    pump([
            gulp.src([
                'js/common/html5shiv.js',
                'js/common/respond.min.js',
            ]),
            uglify(),
            concat('compatibility.js'),
            gulp.dest('build')
        ], cb);
});
gulp.task('compress-index', function (cb) {
    pump([
        gulp.src([
            "/js/third-party/jquery/jquery-1.8.0.min.js",
            "/js/third-party/jquery/jquery.json-2.4.js",
            "/js/third-party/jqueryscrollpagination/js/scrollpagination.js",
            "/js/third-party/jquery-form/jquery.form.js",
            "/js/third-party/fastclick.js",
            "/js/common/mobile-util.js",
            "/js/common/rem.js",
            "/js/common/html5shiv.js",
            "/js/common/respond.min.js",
            "/js/common/main.js",
            "/js/common/common.js",
            "/js/common/comm.func.js",
            "/js/common/comm-customer.js",
            "/js/common/comm-data.js",
            "/js/common/comm_service.js",
        ]),
        uglify(),
        concat('index.js'),
        gulp.dest('build')
    ], cb);
});
gulp.task('compress-exercise', function (cb) {
    pump([
        gulp.src([
            "js/scene/exercises/exerciseCommon.js"
        ]),
        uglify(),
        concat('exerciseCommon.min.js'),
        gulp.dest('js/scene/exercises')
    ], cb);
});
/*all mobile => mobile.js*/
gulp.task('compress-mobile', function (cb) {
    pump([
        gulp.src([
            'js/third-party/fastclick.js',
            'js/common/mobile-util.js',
        ]),
        uglify(),
        concat('mobile.js'),
        gulp.dest('build')
    ], cb);
});
/*all mobile => courseTalk.jszhenghui*/
gulp.task('compress-talk', function (cb) {
    pump([
        gulp.src([
            "js/scene/exercises/json2.js",
            "js/scene/exercises/talk.js",
            "js/scene/discuss/discuss.js",
            "js/scene/classes/videojs.disableProgress.js"
        ]),
        uglify(),
        concat('courseTalk.js'),
        gulp.dest('build')
    ], cb);
});
/*all mobile => courseTalkAbout.jszhenghui*/
gulp.task('compress-new-talk', function (cb) {
    pump([
        gulp.src([
            "js/scene/exercises/json2.js",
            "js/scene/exercises/talk.js",
            "js/scene/discuss/discuss.js"
        ]),
        uglify(),
        concat('courseNewTalk.js'),
        gulp.dest('build')
    ], cb);
});
//有关认证的模块=>authBuild.js
gulp.task('compress-auth', function (cb) {
    pump([
        gulp.src([
            "js/plugins/medicalTitle/plugin.medicalTitleV3.js",
            "js/plugins/areaExpertise-select/plugin.areaExpertiseSelect.js",
            "js/third-party/jquery-autocomplete/jquery.autocomplete.js",
            "js/third-party/jquery-autocomplete/jquery.lenovo.js",
            "js/third-party/uploadReplace/uploadReplace.js",
            "js/third-party/ymd.js",
            "js/scene/authority/authentication_v2.js"
        ]),
        uglify(),
        concat('authBuild.js'),
        gulp.dest('js/scene/authority')
    ], cb);
});
/*build*/
gulp.task('build', function () {
    gulp.src('pages/**/*.html')
        .pipe(htmlreplace({
            'comm': '/build/common.js',
            'login': '/build/login.js',
            'jq': '/build/jqAll.js',
            'compatility':'/build/compatibility.js',
            'mobile':'/build/mobile.js',
            'courseTalk':'/build/courseTalk.js',
        }))
        .pipe(gulp.dest('pages/**/'));
});
/*all concat task*/

gulp.task("concat",['compress-jq','compress-comm','compress-login','compress-compat','compress-mobile','compress-auth','compress-new-talk','compress-talk','compress-exercise','compress-index','compress-login','compress-compat','compress-course-comm'],function () {
    return true;
});
/*End*/
