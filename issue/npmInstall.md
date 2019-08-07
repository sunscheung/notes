# npm install 常见错误解决：
## 安装 chromedriver 失败的解决办法：
npm install chromedriver --chromedriver_cdnurl=http://cdn.npm.taobao.org/dist/chromedriver

## node-sass 安装失败的解决办法：
解决方法一：使用淘宝镜像源
设置变量 sass_binary_site，指向淘宝镜像地址。示例：
```
npm i node-sass --sass_binary_site=https://npm.taobao.org/mirrors/node-sass/
// 也可以设置系统环境变量的方式。示例
// linux、mac 下
SASS_BINARY_SITE=https://npm.taobao.org/mirrors/node-sass/ npm install node-sass
// window 下
set SASS_BINARY_SITE=https://npm.taobao.org/mirrors/node-sass/ && npm install node-sass
或者设置全局镜像源：
npm config set sass_binary_site https://npm.taobao.org/mirrors/node-sass/
之后再涉及到 node-sass 的安装时就会从淘宝镜像下载。
【补充】如果还报错，可能是因为安装的版本需要rebuild才能生效 npm rebuild node-sass
```
解决方法二：使用 cnpm
另外，使用 cnpm 安装 node-sass 会默认从淘宝镜像源下载，也是一个办法(也可以解决安装 chromedriver 失败的问题)：
```
cnpm install node-sass
```
解决方法三：下载 .node 到本地
到这里去根据版本号、系统环境，选择下载 .node 文件：
https://github.com/sass/node-sass/releases
然后安装时，指定变量 sass_binary_path，如：
```
npm i node-sass --sass_binary_path=/Users/lzwme/Downloads/darwin-x64-48_binding.node
```
