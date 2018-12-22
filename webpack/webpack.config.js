```
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
module.exports = {
  mode: "production", // "production" | "development" | "none"
  // mode: "production", // enable many optimizations for production builds
  // mode: "development", // enabled useful tools for development
  // mode: "none", // no defaults

  // 默认为 ./src
  // 这里应用程序开始执行
  // webpack 开始打包
  // Chosen mode tells webpack to use its built-in optimizations accordingly.
  entry: "./app/entry", // string | object | array
    entry: ["./app/entry1", "./app/entry2"],
    entry: {
      a: "./app/entry-a",
      b: ["./app/entry-b1", "./app/entry-b2"]
  },
  output: {
    // webpack 如何输出结果的相关选项
    path: path.resolve(__dirname, "dist"), // string
    // 所有输出文件的目标路径
    // 必须是绝对路径（使用 Node.js 的 path 模块）
    filename: "bundle.js", // string
      filename: "[name].js", // 用于多个入口点(entry point)（出口点？）
      filename: "[chunkhash].js", // 用于长效缓存
    // 「入口分块(entry chunk)」的文件名模板
    publicPath: "/assets/", // string
      publicPath: "",
      publicPath: "https://cdn.example.com/",
    // 输出解析文件的目录，url 相对于 HTML 页面
    library: "MyLibrary", // string,
    // 导出库(exported library)的名称
    libraryTarget: "umd", // 通用模块定义
      libraryTarget: "umd2", // 通用模块定义
      libraryTarget: "commonjs2", // exported with module.exports
      libraryTarget: "commonjs", // 作为 exports 的属性导出
      libraryTarget: "amd", // 使用 AMD 定义方法来定义
      libraryTarget: "this", // 在 this 上设置属性
      libraryTarget: "var", // 变量定义于根作用域下
      libraryTarget: "assign", // 盲分配(blind assignment)
      libraryTarget: "window", // 在 window 对象上设置属性
      libraryTarget: "global", // property set to global object
      libraryTarget: "jsonp", // jsonp wrapper
    // 导出库(exported library)的类型
    /* 高级输出配置（点击显示） */
    pathinfo: true, // boolean
    // 在生成代码时，引入相关的模块、导出、请求等有帮助的路径信息。
    chunkFilename: "[id].js",
      chunkFilename: "[chunkhash].js", // 长效缓存(/guides/caching)
    // 「附加分块(additional chunk)」的文件名模板
    jsonpFunction: "myWebpackJsonp", // string
    // 用于加载分块的 JSONP 函数名
    sourceMapFilename: "[file].map", // string
      sourceMapFilename: "sourcemaps/[file].map", // string
    // 「source map 位置」的文件名模板
    devtoolModuleFilenameTemplate: "webpack:///[resource-path]", // string
    // 「devtool 中模块」的文件名模板
    devtoolFallbackModuleFilenameTemplate: "webpack:///[resource-path]?[hash]", // string
    // 「devtool 中模块」的文件名模板（用于冲突）
    umdNamedDefine: true, // boolean
    // 在 UMD 库中使用命名的 AMD 模块
    crossOriginLoading: "use-credentials", // 枚举
      crossOriginLoading: "anonymous",
      crossOriginLoading: false,
    // 指定运行时如何发出跨域请求问题
    /* 专家级输出配置（自行承担风险） */
  },
  module: {
    // 关于模块配置
    rules: [
      // 模块规则（配置 loader、解析器等选项）
      {
        test: /\.vue$/, // 处理vue模块
        use: 'vue-loader',
      },
      {
        test: /\.js$/, //处理es6语法
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.(png|svg|jpg|gif)$/, // 处理图片
        use: {
          loader: 'file-loader', // 解决打包css文件中图片路径无法解析的问题
          options: {
            // 打包生成图片的名字
            name: '[name].[ext]',
            // 图片的生成路径
            outputPath: config.imgOutputPath,
          }
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/, // 处理字体
        use: {
          loader: 'file-loader',
          options: {
            outputPath: config.fontOutputPath,
          }
        }
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          'vue-style-loader', // 开发环境处理vue文件中的css样式
          MiniCssExtractPlugin.loader, // 生产环境
          'css-loader',
          'postcss-loader',
        ]
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [ // 这些loader会按照从右到左的顺序处理样式
          'vue-style-loader',
          'css-loader',
          'sass-loader',
          'postcss-loader',
          { 
            loader: 'sass-resources-loader', // 将定义的sass变量、mix等统一样式打包到每个css文件中，避免在每个页面中手动手动引入
            options: {
              resources: path.resolve(__dirname, '../src/styles/lib/main.scss'),
            }
          }
        ]
      },
      {
        test: /\.(js|vue)$/,
        enforce: 'pre', // 强制先进行 ESLint 检查
        exclude: /node_modules|lib/,
        loader: 'eslint-loader',
        options: {
          // 启用自动修复
          fix: true,
          // 启用警告信息
          emitWarning: true,
        }
      },
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, "app")
        ],
        exclude: [
          path.resolve(__dirname, "app/demo-files")
        ],
        // 这里是匹配条件，每个选项都接收一个正则表达式或字符串
        // test 和 include 具有相同的作用，都是必须匹配选项
        // exclude 是必不匹配选项（优先于 test 和 include）
        // 最佳实践：
        // - 只在 test 和 文件名匹配 中使用正则表达式
        // - 在 include 和 exclude 中使用绝对路径数组
        // - 尽量避免 exclude，更倾向于使用 include
        issuer: { test, include, exclude },
        // issuer 条件（导入源）
        enforce: "pre",
        enforce: "post",
        // 标识应用这些规则，即使规则覆盖（高级选项）
        loader: "babel-loader",
        // 应该应用的 loader，它相对上下文解析
        // 为了更清晰，`-loader` 后缀在 webpack 2 中不再是可选的
        // 查看 webpack 1 升级指南。
        options: {
          presets: ["es2015"]
        },
        // loader 的可选项
      },
      {
        test: /\.html$/,
        use: [
          // 应用多个 loader 和选项
          "htmllint-loader",
          {
            loader: "html-loader",
            options: {
              /* ... */
            }
          }
        ]
      },
      { oneOf: [ /* rules */ ] },
      // 只使用这些嵌套规则之一
      { rules: [ /* rules */ ] },
      // 使用所有这些嵌套规则（合并可用条件）
      { resource: { and: [ /* 条件 */ ] } },
      // 仅当所有条件都匹配时才匹配
        // { resource: { or: [ /* 条件 */ ] } },
        // { resource: [ /* 条件 */ ] },
        // // 任意条件匹配时匹配（默认为数组）
        // { resource: { not: /* 条件 */ }}
      // 条件不匹配时匹配
    ],
    /* 高级模块配置（点击展示） */
    noParse: [
      /special-library\.js$/
    ],
    // 不解析这里的模块
    unknownContextRequest: ".",
    unknownContextRecursive: true,
    unknownContextRegExp: /^\.\/.*$/,
    unknownContextCritical: true,
    exprContextRequest: ".",
    exprContextRegExp: /^\.\/.*$/,
    exprContextRecursive: true,
    exprContextCritical: true,
    wrappedContextRegExp: /.*/,
    wrappedContextRecursive: true,
    wrappedContextCritical: false,
    // specifies default behavior for dynamic requests
  },
  resolve: {
    // 解析模块请求的选项
    // （不适用于对 loader 解析）
    modules: [
      "node_modules",
      path.resolve(__dirname, "app")
    ],
    // 用于查找模块的目录
    extensions: [".js", ".json", ".jsx", ".css"],
    // 使用的扩展名
    alias: {
      // 模块别名列表
      "module": "new-module",
      // 起别名："module" -> "new-module" 和 "module/path/file" -> "new-module/path/file"
      "only-module$": "new-module",
      // 起别名 "only-module" -> "new-module"，但不匹配 "only-module/path/file" -> "new-module/path/file"
      "module": path.resolve(__dirname, "app/third/module.js"),
      // 起别名 "module" -> "./app/third/module.js" 和 "module/file" 会导致错误
      // 模块别名相对于当前上下文导入
    },
    /* 可供选择的别名语法（点击展示） */
    alias: [
      {
        name: "module",
        // 旧的请求
        alias: "new-module",
        // 新的请求
        onlyModule: true
        // 如果为 true，只有 "module" 是别名
        // 如果为 false，"module/inner/path" 也是别名
      }
    ],
    /* 高级解析选项（点击展示） */
    symlinks: true,
    // 遵循符号链接(symlinks)到新位置
    descriptionFiles: ["package.json"],
    // 从 package 描述中读取的文件
    mainFields: ["main"],
    // 从描述文件中读取的属性
    // 当请求文件夹时
    aliasFields: ["browser"],
    // 从描述文件中读取的属性
    // 以对此 package 的请求起别名
    enforceExtension: false,
    // 如果为 true，请求必不包括扩展名
    // 如果为 false，请求可以包括扩展名
    moduleExtensions: ["-module"],
    enforceModuleExtension: false,
    // 类似 extensions/enforceExtension，但是用模块名替换文件
    unsafeCache: true,
      unsafeCache: {},
    // 为解析的请求启用缓存
    // 这是不安全，因为文件夹结构可能会改动
    // 但是性能改善是很大的
    cachePredicate: (path, request) => true,
    // predicate function which selects requests for caching
    plugins: [
      // ...
    ]
    // 应用于解析器的附加插件
  },
  performance: {
    // 性能
    hints: "warning", // 枚举 false-关闭性能提示 | "error"-性能提示中抛出错误 | "warning"-默认警告
    maxAssetSize: 200000, // 整数类型（以字节为单位）
    maxEntrypointSize: 400000, // 整数类型（以字节为单位）
    assetFilter: function(assetFilename) {
      // 提供资源文件名的断言函数
      return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
    }
  },
  devtool: "source-map", // enum  // 通过在浏览器调试工具(browser devtools)中添加元信息(meta info)增强调试
  // 牺牲了构建速度的 `source-map' 是最详细的。
  context: __dirname, // string（绝对路径！）基础目录，绝对路径，用于从配置中解析入口起点(entry point)和 loader
  // webpack 的主目录
  // entry 和 module.rules.loader 选项
  // 相对于此目录解析
  // 构建目标-告知 webpack 为目标(target)指定一个环境。
  target: "web", // 枚举  // bundle 应该运行的环境
  // 更改 块加载行为(chunk loading behavior) 和 可用模块(available module)
  externals: ["react", /^@angular\//],  // 不要遵循/打包这些模块，而是在运行时从环境中请求他们
  serve: { // object
    port: 1337,
    content: './dist'
  },
  // 为 webpack-serve 提供选项
  // 统计信息
  stats: "errors-only", // string-只在发生错误时输出
  stats: { // object
    assets: true,
    colors: true,
    errors: true,
    errorDetails: true,
    hash: true,
    // ...
  },
  // 精确控制要显示的 bundle 信息
  /** @description 本地开发server(devServer)
   * 日常开发的时候我们需要在本地启动一个静态服务器，以方便开发调试，我们使用 webpack-dev-server 这个
   * webpack 官方提供的一个工具，基于当前的 webpack 构建配置快速启动一个静态服务。
   * 当 mode 为 development 时，会具备 hot reload 的功能，所以不需要再手动引入 
  **/
  devServer: {
    proxy: { // proxy URLs to backend development server
      '/api': 'http://localhost:3000'
    },
    contentBase: path.join(__dirname, 'public'), // boolean | string | array, static file location
    compress: true, // enable gzip compression
    historyApiFallback: true, // true for index.html upon 404, object for multiple paths
    hot: true, // hot module replacement. Depends on HotModuleReplacementPlugin
    https: false, // true for self-signed, object for cert authority
    noInfo: true, // only errors & warns on hot reload
    // ...
  },
  plugins: [
    // ...插件
    // vue-loader要配合 VueLoaderPlugin 插件一起使用。 babel-loader 要配合 .babelrc 使用。
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[chunkhash:8].css' // css最终以单文件形式抽离到 dist/css目录下
    })
  ],
  optimization: {
    /**
     * 优化
     * splitChunks配置 webpack 4 移除了 CommonsChunkPlugin，
     * 取而代之的是两个新的配置项（ optimization.splitChunks 和 optimization.runtimeChunk ）用于抽取
     * 公共js模块。 通过 optimization.runtimeChunk: true 选项，webpack 会添加一个只包含运行时(runtime)额
     * 外代码块到每一个入口。（注：这个需要看场景使用，会导致每个入口都加载多一份运行时代码）。
     * 
     * */ 
    splitChunks: {
      chunks: 'async', // 控制webpack选择哪些代码块用于分割（其他类型代码块按默认方式打包）。有3个可选的值：initial、async和all。
      minSize: 30000, // 形成一个新代码块最小的体积
      maxSize: 0,
      minChunks: 1, // 在分割之前，这个代码块最小应该被引用的次数（默认配置的策略是不需要多次引用也可以被分割）
      maxAsyncRequests: 5, // 按需加载的代码块，最大数量应该小于或者等于5
      maxInitialRequests: 3, // 初始加载的代码块，最大数量应该小于或等于3
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: { // 将所有来自node_modules的模块分配到一个叫vendors的缓存组
          test: /[\\/]node_modules[\\/]/,
          priority: -10 // 缓存组的优先级(priotity)是负数，因此所有自定义缓存组都可以有比它更高优先级
        },
        default: { 
          minChunks: 2, // 所有重复引用至少两次的代码，会被分配到default的缓存组。
          priority: -20, // 一个模块可以被分配到多个缓存组，优化策略会将模块分配至跟高优先级别（priority）的缓存组
          reuseExistingChunk: true // 允许复用已经存在的代码块，而不是新建一个新的，需要在精确匹配到对应模块时候才会生效。
        }
      }
    }
  },
  // 附加插件列表
  /* 高级配置（点击展示） */
  resolveLoader: { /* 等同于 resolve */ },
  // 独立解析选项的 loader
  parallelism: 1, // number
  // 限制并行处理模块的数量
  profile: true, // boolean
  // 捕获时机信息
  bail: true, //boolean
  // 在第一个错误出错时抛出，而不是无视错误。
  cache: false, // boolean
  // 禁用/启用缓存
  watch: true, // boolean
  // 启用观察
  watchOptions: {
    aggregateTimeout: 1000, // in ms
    // 将多个更改聚合到单个重构建(rebuild)
    poll: true,
     poll: 500, // 间隔单位 ms
    // 启用轮询观察模式
    // 必须用在不通知更改的文件系统中
    // 即 nfs shares（译者注：Network FileSystem，最大的功能就是可以透過網路，讓不同的機器、不同的作業系統、可以彼此分享個別的檔案 ( share file )）
  },
  node: {
    // Polyfills and mocks to run Node.js-
    // environment code in non-Node environments.
    console: false, // boolean | "mock"
    global: true, // boolean | "mock"
    process: true, // boolean
    __filename: "mock", // boolean | "mock"
    __dirname: "mock", // boolean | "mock"
    Buffer: true, // boolean | "mock"
    setImmediate: true // boolean | "mock" | "empty"
  },
  recordsPath: path.resolve(__dirname, "build/records.json"),
  recordsInputPath: path.resolve(__dirname, "build/records.json"),
  recordsOutputPath: path.resolve(__dirname, "build/records.json"),
  // TODO
}
```
