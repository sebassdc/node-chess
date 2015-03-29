var gulp = require("gulp");
var typescript = require("gulp-tsc");

gulp.task("default", function(){
	gulp.src(["src/**/*.ts", "test/**/*.ts"])
	.pipe(typescript({
		sourcemap: false,
		module: "commonjs",
		target: "es5"
	}))
	.pipe(gulp.dest("dist/"));
});