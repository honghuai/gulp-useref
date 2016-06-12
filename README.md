# gulp-useref
##gulp-useref rev rev-collector sequence
###使用：
* 1.执行server，合并压缩css/js代码，输出到dist文件目录下，同时清除其他目录的多余的css/js文件
* 2.执行revCss+toHtml，给css加MD5后缀，同时改变html代码引用的路径
* 3.执行revJs+toHtml,给js加MD5后缀，同时改变html代码引用的路径

##原理：基于文件内容的hash版本冗余机制：根据a.js的文件内容进行hash运算得到的，只有文件内容发生变化了才会有更改。
以文件内容的hash值为依据生产新文件的非覆盖式发布策略是解决静态资源缓存更新最有效的手段。
