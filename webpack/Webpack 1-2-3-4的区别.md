# Webpack 1-2-3-4的区别

## 一、 Webpack2 VS Webpack1

Webpack2新增了许多新特性，需要处理配置语法兼容

1. 增加对 ES6 模块的原生支持
2. 可以混用 ES2015 和 AMD 和 CommonJS
3. 支持 tree-shaking（减少打包后的体积）
4. 新增更多的 CLI 参数项
> -p 指定当前的编译环境为生产环境，即设置 process.env.NODE_ENV 为 production
5. 配置选项语法有较大改动，且不向下兼容
    5.1 配置项 - resolve（解析）
    取消了 extensions 空字符串（表示导入文件无后缀名）
    Webpack1中：
      resolve: {
        extensions: ['', '.js', '.css'],
        modulesDirectories: ['node_modules', 'src']
      }
    Webpack2中：
      resolve: {
        extensions: ['.js', '.css'],
        modules: [
            path.resolve(__dirname, 'node_modules'),
            path.join(__dirname, './src')
        ]
      }
    5.2 配置项 - module（模块）
    外层 loaders 改为 rules
    内层 loader 改为 use
    所有插件必须加上 -loader，不再允许缩写
    不再支持使用!连接插件，改为数组形式
    json-loader 模块移除，不再需要手动添加，webpack2 会自动处理
    Webpack1中：
      module: {
          loaders: [{
              test: /\.(less|css)$/,
              loader: "style!css!less!postcss"
          }, {
              test: /\.json$/,
              loader: 'json'
          }]
      }
    Webpack2中：
      module: {
        rules: [{
          test: /\.(less|css)$/,
          use: [
            "style-loader",
            "css-loader",
            "less-loader",
            "postcss-loader"
          ]
        }]
      };
    5.3 配置项 - plugins（插件）
    移除了 OccurenceOrderPlugin 模块（已内置）、NoErrorsPlugin 模块（已内置）

## 二、 Webpack3 VS Webpack2

  两个版本几乎完全兼容，新增部分新特性
  1. 加入 Scope Hoisting（作用域提升）
    之前版本将每个依赖都分别封装在一个闭包函数中来独立作用域。这些包装函数闭包函数降低了浏览器 JS 引擎解析速度
    Webpack 团队参考 Closure Compiler 和 Rollup JS，将有联系的模块放到同一闭包函数中，从而减少闭包函数数量，使文件大小的少量精简，提高 JS 执行效率
    在 Webpack3 配置中加入 ModuleConcatenationPlugin 插件来启用作用域提升
    module.exports = {
        plugins: [
            new webpack.optimize.ModuleConcatenationPlugin()
        ]
    };
  2. 加入 Magic Comments（魔法注解）
    在 Webpack2 中引入了 Code Splitting-Async 的新方法 import()，用于动态引入 ES Module，Webpack 将传入 import 方法的模块打包到一个单独的代码块（chunk），但是却不能像 require.ensure 一样，为生成的 chunk 指定 chunkName。因此在 Webpack3 中提出了 Magic Comment 用于解决该问题
    import(/* webpackChunkName: "my-chunk-name" */ 'module');

## 二、 Webpack4 VS Webpack3

  1. Webpack 3.X -> 4.X 升级,先升级 webpack-cli
    ```
    npm install webpack-cli -D
    或者
    npm install -g yarn
    yarn add webpack-cli -D
    ```
  2. 启动服务，将会出现问题
    问题1：compilation.mainTemplate.applyPluginsWaterfall is not a function
      解决方案：请确保您更新了所有依赖项,然后 npm install html-webpack-plugin --save-dev
    问题2：Use Chunks.groupsIterable and filter by instanceof Entrypoint instead
      解决方案：去除，require(‘extract-text-webpack-plugin’)的引用
    问题3：webpack.optimize.CommonsChunkPlugin has been removed, please use config.optimization.splitChunks instead.
      目前，4.0中已经删除CommonsChunkPlugin，替换成了splitChunks.
      解决方案：去除 new webpack.optimize.CommonsChunkPlugin，修改为optimization:{splitChunks:{...}}
  3. 问题4：警告
      警告提示，表示 在启动服务的时候没有指定mode
      在 package.json 中加上--mode development或者--mode production即可，如下示例：
      "scripts": {
        "dev": "webpack --mode development",
        "build": "webpack --mode production"
      }
  4. 出现的问题就是不同点，且需要解决，其他都是优化
