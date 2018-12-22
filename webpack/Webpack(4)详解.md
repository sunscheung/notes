# Webpack(4)详解

webpack 是一个现代 JavaScript 应用程序的静态模块打包器(static module bundler)。
在 webpack 处理应用程序时，它会在内部创建一个依赖图(dependency graph)，用于映射到项目需要的每个模块，然后将所有这些依赖生成到一个或多个bundle。
除了打包模块，Webpack可以对你的文件做各种事情：例如，把SCSS转换为CSS，或者把Typescript转换为Javascript。
它甚至可以压缩你所有的图像文件！
从 webpack 4.0.0 版本开始，可以不用通过引入一个配置文件打包项目。然而，webpack 仍然还是 高度可配置的，并且能够很好的满足需求。
> 打包的目的:在之前，除了使用`<script>`标签，我们没有其他方法把浏览器使用的JavaScript拆分到多个文件。我们需要把用到的每一个JavaScript源文件链接放到HTML代码里。这样并不方便。社区找到了一些变通方案：CommonJS（在Node.js中实现了）和AMD。这里有篇文章是关于它们的介绍。而最终，ES6推出了一套全新的 import/export 语法。

## webpack的配置- [webpack.config.js](./webpack.config.js)

webpack配置中需要理解几个核心的概念Entry 、Output、Loaders 、Plugins、 Chunk

1. 入口(entry): 指示 webpack 应该使用哪个模块，来作为构建其内部依赖图的开始，webpack会找出有哪些模块和 library 是入口起点（直接和间接）依赖的。
    对比多页应用和单页应用（SPA）,最大的不同点，就在于入口的不同
    多页：最终打包生成多个入口（ html 页面），一般每个入口文件除了要引入公共的静态文件（ js/css ）
    还要另外引入页面特有的静态资源
    单页：只有一个入口( index.html )，页面中需要引入打包后的所有静态文件，
    所有的页面内容全由 JavaScript 控制
    【注意】上面说的入口指的都是最终打包到dist目录下的 html 文件，而我们在这里配置的 entry 其实是需要被 html 引入的js模块，这些js模块、连同抽离的公共js模块最终还需要利用 html-webpack-plugin 这个插件组合到html文件中：
    ``
    // 1....
    const config = require('./config'); // 多页面的配置项
    let HTMLPlugins = [];
    let Entries = {};
    config.HTMLDirs.forEach(item => {
      const htmlPlugin = new HTMLWebpackPlugin({
        title: item.title, // 生成的html页面的标题
        filename: `${item.page}.html`, // 生成到dist目录下的html文件名称，支持多级目录（eg: `${item.page}/index.html`）
        template: path.resolve(__dirname, `../src/template/index.html`), // 模板文件，不同入口可以根据需要设置不同模板
        chunks: [item.page, 'vendor'], // html文件中需要要引入的js模块，这里的 vendor 是webpack默认配置下抽离的公共模块的名称
      });
      HTMLPlugins.push(htmlPlugin);
      Entries[item.page] = path.resolve(__dirname, `../src/pages/${item.page}/index.js`); // 根据配置设置入口js文件
    });
    // 2.... config.js中多页的配置信息：
    module.exports = {
      HTMLDirs: [
        {
          page: 'index',
          title: '首页'
        },
        {
          page: 'list',
          title: '列表页'
        },
        {
          page: 'detail',
          title: '详情页'
        }
      ],
      // ...
    };
    // 3.... 最后再引入相关配置：
    module.exports = {
      entry: Entries,
      // ...
      plugins: [
        ...HTMLPlugins
      ]
      // ...
    }
    ``

2. 出口(output): 告诉webpack如何命名输出的文件以及输出的目录属性告诉 webpack 在哪里输出它所创建的 bundles，以及如何命名这些文件，主输出文件默认为 ./dist/main.js，其他生成文件的默认输出目录是 ./dist。
    配置出口的文件名和路径：
    ``
    module.exports = {
      entry: Entries,
      output: {
        filename: 'js/[name].[hash:8].js',
        path: path.resolve(__dirname, '../dist'),
      },
    }
    ``
    // 这里将生成的js文件挂上8位的MD5戳，以充分利用CDN缓存。

3. Loaders: 作为开箱即用的自带特性，webpack自身只支持JavaScript。而loader能够让 webpack处理那些非 JavaScript文件，并且先将它们转换为有效模块，然后添加到依赖图中，这样就可以提供给应用程序使用。---loader 用于对模块的源代码进行转换，负责把某种文件格式的内容转换成 webpack 可以支持打包的模块，例如将sass预处理转换成 css 模块；将 TypeScript 转换成 JavaScript；或将内联图像转换为 data URL等
> 【1】注意，loader 能够 import 导入任何类型的模块（例如 .css 文件），这是 webpack 特有的功能，其他打包程序或任务执行器的可能并不支持。我们认为这种语言扩展是有很必要的，因为这可以使开发人员创建出更准确的依赖关系图。【2】重要的是要记得，在 webpack 配置中定义 loader 时，要定义在 module.rules 中，而不是 rules。为了使你受益于此，如果没有按照正确方式去做，webpack 会给出警告。

4. 插件(plugins): 在webpack打包流程中，模块代码转换的工作由 loader 来处理，除此之外的其他工作都可以交由 plugin 来完成。常用的有：
    uglifyjs-webpack-plugin， 处理js代码压缩
    mini-css-extract-plugin， 将css抽离成单文件 // 抽取css extract-text-webpack-plugin不再支持webpack4
    clean-webpack-plugin， 用于每次build时清理dist文件夹
    copy-webpack-plugin， copy文件
    webpack.HotModuleReplacementPlugin， 热加载
    webpack.DefinePlugin，定义环境变量

5. Chunk(代码块): webpack中Chunk实际上就是输出的 .js 文件，可能包含多个模块，主要的作用是为了优化异步加载。coding split(异步加载)的产物，我们可以对一些代码打包成一个单独的chunk，比如某些公共模块，去重，更好的利用缓存。或者按需加载某些功能模块，优化加载时间。在webpack3及以前我们都利用CommonsChunkPlugin将一些公共代码分割成一个chunk，实现单独加载。在webpack4 中CommonsChunkPlugin被废弃，使用SplitChunksPlugin。

6. mode(模式)：通过将 mode 参数设置为 development、production或none可以启用对应环境下 webpack 内置的优化。默认值为
    development: 开发模式,会将 process.env.NODE_ENV 设置成 development
      启用 NamedChunksPlugin、NamedModulesPlugin 插件
    production: 生产模式,会将 process.env.NODE_ENV 设置成 production
      会启用最大化的优化（模块的压缩、串联等）
    none: 这种模式不会进行优化处理
    mode设置的两种方式:
    a、 package.json 中通过shell命令参数形式设置webpack --mode=production
    b、通过配置mode配置项
        module.exports = {
          mode: 'production'
        };

## webpack运行机制

1. webpack运行机制概述
    webpack的运行过程可以简单概述为如下流程：
    初始化配置参数 -> 绑定事件钩子回调 -> 确定Entry逐一遍历 -> 使用loader编译文件 -> 输出文件

2. webpack运行流程

    2.1.webpack事件流初探
      在分析webpack运行流程时，我们可以借助一个概念，便是webpack的事件流机制。
      【什么是webpack事件流?】
      Webpack 就像一条生产线，要经过一系列处理流程后才能将源文件转换成输出结果。
      这条生产线上的每个处理流程的职责都是单一的，多个流程之间有存在依赖关系，
      只有完成当前处理后才能交给下一个流程去处理。 插件就像是一个插入到生产线中的一个功能，
      在特定的时机对生产线上的资源做处理。
      Webpack 通过 Tapable 来组织这条复杂的生产线。 Webpack 在运行过程中会广播事件，
      插件只需要监听它所关心的事件，就能加入到这条生产线中，去改变生产线的运作。
      Webpack 的事件流机制保证了插件的有序性，使得整个系统扩展性很好。     --吴浩麟《深入浅出webpack》

      我们将webpack事件流理解为webpack构建过程中的一系列事件，他们分别表示着不同的构建周期和状态，
      我们可以像在浏览器上监听click事件一样监听事件流上的事件，并且为它们挂载事件回调。
      我们也可以自定义事件并在合适时机进行广播，这一切都是使用了webpack自带的模块 Tapable 进行管理的。
      我们不需要自行安装 Tapable ，在webpack被安装的同时它也会一并被安装，如需使用，我们只需要在文件里直接 require 即可。
      Tapable的原理其实就是我们在前端进阶过程中都会经历的EventEmit，
      通过发布者-订阅者模式实现，它的部分核心代码可以概括成下面这样：
      ``
      class SyncHook{
          constructor(){
              this.hooks = [];
          }

          // 订阅事件
          tap(name, fn){
              this.hooks.push(fn);
          }

          // 发布
          call(){
              this.hooks.forEach(hook => hook(...arguments));
          }
      }
      ``
      Tapable的具体内容可以参照文章：
      [《webpack4.0源码分析之Tapable》](https://juejin.im/post/5abf33f16fb9a028e46ec352)。
      其使用方法我们会在后文中的“3.编写自定义webpack plugin”模块再做深入介绍。
      因为webpack4重写了事件流机制，
      所以翻阅[webpack hook](https://link.juejin.im/?target=https%3A%2F%2Fwebpack.js.org%2Fapi%2Fcompiler-hooks%2F) 
      的官方文档会发现信息特别繁杂，但是在实际使用中，我们只需要记住几个重要的事件就足够了。

    2.2.webpack运行流程详解
      a. 首先，webpack会读取你在命令行传入的配置以及项目里的 webpack.config.js 文件，初始化本次构建的配置参数，
      并且执行配置文件中的插件实例化语句，生成Compiler传入plugin的apply方法，为webpack事件流挂上自定义钩子。
      b. 接下来到了entryOption阶段，webpack开始读取配置的Entries，递归遍历所有的入口文件
      Webpack进入其中一个入口文件，开始compilation过程。先使用用户配置好的loader对文件内容进行编译（buildModule），我们可以从传入事件回调的compilation上拿到module的resource（资源路径）、
      loaders（经过的loaders）等信息；之后，再将编译好的文件内容使用acorn解析生成AST静态语法树（normalModuleLoader），分析文件的依赖关系逐个拉取依赖模块并重复上述过程，
      最后将所有模块中的require语法替换成__webpack_require__来模拟模块化操作。
      c. emit阶段，所有文件的编译及转化都已经完成，包含了最终输出的资源，我们可以在传入事件回调的compilation.assets 上拿到所需数据，其中包括即将输出的资源、代码块Chunk等等信息

    2.3.什么是AST?
      2.2中，我们看到了一个陌生的字眼——AST，上网一搜：
      在计算机科学中，抽象语法树（Abstract Syntax Tree，AST），或简称语法树（Syntax tree），
      是源代码语法结构的一种抽象表示。它以树状的形式表现编程语言的语法结构，
      树上的每个节点都表示源代码中的一种结构。之所以说语法是“抽象”的，是因为这里的语法并不会表示出真实
      语法中出现的每个细节。比如，嵌套括号被隐含在树的结构中，并没有以节点的形式呈现；而类似于 if-condition-then 这样的条件跳转语句，可以使用带有两个分支的节点来表示。  --维基百科
      转换成AST的目的就是将我们书写的字符串文件转换成计算机更容易识别的数据结构，这样更容易提取其中的关键信息，而这棵树在计算机上的表现形式，其实就是一个单纯的Object。
    2.4.webpack输出结果解析
      接下来，我们来看看webpack的输出内容。如果我们没有设置splitChunk，我们只会在dist目录下看到一个main.js输出文件，过滤掉没用的注释还有一些目前不需要去考虑的Funciton。
      我们都知道其实webpack在浏览器实现模块化的本质就是将所有的代码都注入到同一个JS文件里，现在我们可以清晰明了地看出webpack最后生成的也不过只是一个IIFE，我们引入的所有模块都被一个function给包起来组装成一个对象，这个对象作为IIFE的实参被传递进去。
      但如果我们配置了splitChunk，这时候输出的文件就和你的Chunk挂钩了，这时候，IIFE的形参也变成了摆设，所有我们的模块都被放在了一个名为 webpackJsonp 的全局数组上，通过IIFE里的 webpackJsonpCallback 来处理数据。

3. 总结
    纵观webpack构建流程，我们可以发现整个构建过程主要花费时间的部分也就是递归遍历各个entry然后寻找依赖
    逐个编译的过程，每次递归都需要经历 String->AST->String 的流程，经过loader还需要处理一些字符串或者
    执行一些JS脚本，介于node.js单线程的壁垒，webpack构建慢一直成为它饱受诟病的原因。
    这也是happypack之所以能大火的原因，我们可以来看一段happypack的示例代码:

## 编写自定义webpack loader

  1. 让webpack loader现出原型
    在webpack中，真正起编译作用的便是我们的loader，也就是说，平时我们进行babel的ES6编译，SCSS、LESS等编译都是在loader里面完成的，在你不知道loader的本质之前你一定会觉得这是个很高大上的东西，正如计算机学科里的编译原理一样，里面一定有许多繁杂的操作。但实际上，loader只是一个普通的funciton，他会传入匹配到的文件内容(String)，你只需要对这些字符串做些处理就好了。一个最简单的loader大概是这样：
    ```
    /**
    * loader Function
    * @param {String} content 文件内容
    */
    module.exports = function(content){
        return "{};" + content
    }
    ```
    使用它的方式和babel-loader一样，只需要在webpack.config.js的module.rules数组里加上这么一个对象就好了：
    ```
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        //这里是我的自定义loader的存放路径
        loader: path.resolve('./loaders/index.js'),
        options: {
          test: 1
        }
      }
    }
    ```
    loader会去匹配所有以.js后缀结尾的文件并在内容前追加{};
    所以，拿到了文件内容，你想对字符串进行怎样得处理都由你自定义～你可以引入babel库加个 babel(content) ，这样就实现了编译，也可以引入uglifyjs对文件内容进行字符串压缩，一切工作都由你自己定义。
  2. Loader实战常用技巧
    2.1.拿到loader的用户自定义配置
      在我们在webpack.config.js书写loader配置时，经常会见到 options 这样一个配置项，
      这就是webpack为用户提供的自定义配置，在我们的loader里，如果要拿到这样一个配置信息，
      只需要使用这个封装好的库 loader-utils 就可以了：
      ```
      const loaderUtils = require("loader-utils");
      module.exports = function(content){
          // 获取用户配置的options
          const options = loaderUtils.getOptions(this);
          console.log('***options***', options)
          return "{};" + content
      }
      ```

    2.2.loader导出数据的形式
      在前面的示例中，因为我们一直loader是一个Funtion，所以我们使用了return的方式导出loader处理后的数据，
      但其实这并不是我们最推荐的写法，在大多数情况下，我们还是更希望使用 this.callback 方法去导出数据。
      如果改成这种写法，示例代码可以改写为：
      ```
      module.exports = function(content){
          //return "{};" + content
          this.callback(null, "{};" + content)
      }
      ```
      this.callback 可以传入四个参数（其中后两个参数可以省略），他们分别是：
      error：Error | null，当loader出错时向外跑出一个Error
      content：String | Buffer，经过loader编译后需要导出的内容
      sourceMap：为方便调试生成的编译后内容的source map
      ast: 本次编译生成的AST静态语法树，之后执行的loader可以直接使用这个AST，可以省去重复生成AST的过程

    2.3.异步loader
      经过2.2我们可以发现，不论是使用return还是 this.callback 的方式，导出结果的执行都是同步的，假如我们的loader里存在异步操作，比如拉取请求等等又该怎么办呢？
      熟悉ES6的朋友都知道最简单的解决方法便是封装一个Promise，然后用async-await完全无视异步问题，
      示例代码如下：
      ```
      module.exports = async function(content){
          function timeout(delay) {
              return new Promise((resolve, reject) => {
                  setTimeout(() => {
                      resolve("{};" + content)
                  }, delay)
              })
          }
          const data = await timeout(1000)
          return data
      }
      ```
      但如果node的版本不够，我们还有原始的土方案 this.async ，调用这个方法会返回一个callback Function，
      在适当时候执行这个callback就可以了，上面的示例代码可以改写为：
      ```
      module.exports = function(content){
          function timeout(delay) {
              return new Promise((resolve, reject) => {
                  setTimeout(() => {
                      resolve("{};" + content)
                  }, delay)
              })
          }
          const callback = this.async()
          timeout(1000).then(data => {
              callback(null, data)
          })
      }
      ```
      更老版本的node同此。
    2.4 loaders的执行顺序
      还记得我们配置CSS编译时写的loader嘛，它们是长这样的：
      在很多时候，我们的 use 里不只有一个loader，这些loader的执行顺序是从后往前的，你也可以把它理解为这个loaders数组的出栈过程。
    2.5 loader缓存
      webpack增量编译机制会观察每次编译时的变更文件，在默认情况下，webpack会对loader的执行结果进行缓存，这样能够大幅度提升构建速度，不过我们也可以手动关闭它（虽然我不知道为什么要关闭它，既然留了这么个API就蛮介绍下吧，欢迎补充），示例代码如下：
      module.exports = function(content){
          //关闭loader缓存
          this.cacheable(false);
          return "{};" + content
      }

    2.6 pitch钩子全程传参
      在loader文件里你可以exports一个命名为 pitch 的函数，它会先于所有的loader执行，就像这样：
      ```
      module.exports.pitch = (remaining, preceding, data) => {
          console.log('***remaining***', remaining)
          console.log('***preceding***', preceding)
          // data会被挂在到当前loader的上下文this上在loaders之间传递
          data.value = "test"
      }
      ```
      它可以接受三个参数，最重要的就是第三个参数data，你可以为其挂在一些所需的值，一个rule里的所有的loader在执行时都能拿到这个值。
      ```
        module.exports = function(content){
            //***this data*** test
            console.log('***this data***', this.data.value)
            return "{};" + content
        }

        module.exports.pitch = (remaining, preceding, data) => {
            data.value = "test"
        }
      ```
  3. 总结
    通过上述介绍，我们明白了，loader其实就是一个“平平无奇”的Funtion，
    能够传入本次匹配到的文件内容供我们自定义修改。

## 编写自定义webpack plugin

  1. 温习一下webpack事件流
      还记得我们在前文讲到的webpack事件流，你还记得webpack有哪些常用的事件吗？webpack插件起到的作用，
      就是为这些事件挂载回调，或者执行指定脚本。
      我们在文章里也提到，webpack的事件流是通过 Tapable 实现的，它就和我们的EventEmit一样，
      是这一系列的事件的生成和管理工具，它的部分核心代码就像下面这样：
      ```
      class SyncHook{
          constructor(){
              this.hooks = [];
          }

          // 订阅事件
          tap(name, fn){
              this.hooks.push(fn);
          }

          // 发布
          call(){
              this.hooks.forEach(hook => hook(...arguments));
          }
      }
      ```
      在 webpack hook 上的所有钩子都是 Tapable 的示例，所以我们可以通过 tap 方法监听事件，使用 call 方法广播事件，就像官方文档介绍的这样：
      compiler.hooks.someHook.tap(/* ... */);
      几个比较常用的hook我们也已经在前文介绍过了，如果大家不记得了，可以回过头再看看哦～
  2. 什么是webpack plugin
    如果剖析webpack plugin的本质，它实际上和webpack loader一样简单，其实它只是一个带有apply方法的class。
    ```
    //@file: plugins/myplugin.js
    class myPlugin {
        constructor(options){
            //用户自定义配置
            this.options = options
            console.log(this.options)
        }
        apply(compiler) {
            console.log("This is my first plugin.")
        }
    }

    module.exports = myPlugin
    ```
    这样就实现了一个简单的webpack plugin，如果我们要使用它，只需要在webpack.config.js
     里 require 并实例化就可以了：
     ```
      const MyPlugin = require('./plugins/myplugin-4.js')

      module.exports = {
          ......,
          plugins: [
              new MyPlugin("Plugin is instancing.")
          ]
      }
      ```
    大家现在肯定也都想起来了，每次我们需要使用某个plugin的时候都需要new一下实例化，自然，实例过程中传递的参数，也就成为了我们的构造函数里拿到的options了。
    而实例化所有plugin的时机，便是在webpack初始化所有参数的时候，也就是事件流开始的时候。所以，如果配合 shell.js 等工具库，我们就可以在这时候执行文件操作等相关脚本，这就是webpack plugin所做的事情。
    如果你想在指定时机执行某些脚本，自然可以使用在webpack事件流上挂载回调的方法，在回调里执行你所需的操作。
  3. Tapable新用
    如果我们想赋予webpack事件流我们的自定义事件能够实现嘛？答案当然是必须可以啊老铁！
    自定义webpack事件流事件需要几步？四步：
    a. 引入Tapable并找到你想用的hook，
      同步hook or 异步hook 在这里应有尽有 -> webpack4.0源码分析之Tapable
      ```const { SyncHook } = require("tapable");```
    b. 实例化Tapable中你所需要的hook并挂载在compiler或compilation上
      ```compiler.hooks.myHook = new SyncHook(['data'])```
    c. 在你需要监听事件的位置tap监听
      ```
      compiler.hooks.myHook.tap('Listen4Myplugin', (data) => {
          console.log('@Listen4Myplugin', data)
      })
      ```
    d. 在你所需要广播事件的时机执行call方法并传入数据
      ```
      compiler.hooks.environment.tap(pluginName, () => {
            //广播自定义事件
            compiler.hooks.myHook.call("It's my plugin.")
      });
      ```

    完整代码实现可以参考我在文章最前方贴出的项目，大概就是下面这样：
    现在我的自定义插件里实例化一个hook并挂载在webpack事件流上
    ```
    // @file: plugins/myplugin.js
    const pluginName = 'MyPlugin'
    // tapable是webpack自带的package，是webpack的核心实现
    // 不需要单独install，可以在安装过webpack的项目里直接require
    // 拿到一个同步hook类
    const { SyncHook } = require("tapable");
    class MyPlugin {
        // 传入webpack config中的plugin配置参数
        constructor(options) {
            // { test: 1 }
            console.log('@plugin constructor', options);
        }

        apply(compiler) {
            console.log('@plugin apply');
            // 实例化自定义事件
            compiler.hooks.myPlugin = new SyncHook(['data'])

            compiler.hooks.environment.tap(pluginName, () => {
                //广播自定义事件
                compiler.hooks.myPlugin.call("It's my plugin.")
                console.log('@environment');
            });

            // compiler.hooks.compilation.tap(pluginName, (compilation) => {
                // 你也可以在compilation上挂载hook
                // compilation.hooks.myPlugin = new SyncHook(['data'])
                // compilation.hooks.myPlugin.call("It's my plugin.")
            // });
        }
    }
    module.exports = MyPlugin
    ```
    在监听插件里监听我的自定义事件
    ```
    // @file: plugins/listen4myplugin.js
    class Listen4Myplugin {
        apply(compiler) {
            // 在myplugin environment 阶段被广播
            compiler.hooks.myPlugin.tap('Listen4Myplugin', (data) => {
                console.log('@Listen4Myplugin', data)
            })
        }
    }

    module.exports = Listen4Myplugin
    ```
    在webpack配置里引入两个插件并实例化
    ```
    // @file: webpack.config.js
    const MyPlugin = require('./plugins/myplugin-4.js')
    const Listen4Myplugin = require('./plugins/listen4myplugin.js')

    module.exports = {
        ......,
        plugins: [
            new MyPlugin("Plugin is instancing."),
            new Listen4Myplugin()
        ]
    }
    ```
    输出结果就是这样: @Listen4Myplugin It's my plugin
    我们拿到了call方法传入的数据，并且成功在environment时机里成功输出了。
  4. 实战剖析
    来看一看已经被众人玩坏的 html-webpack-plugin ，我们发现在readme底部有这样一段demo：
    ```
    function MyPlugin(options) {
      // Configure your plugin with options...
    }

    MyPlugin.prototype.apply = function (compiler) {
      compiler.hooks.compilation.tap('MyPlugin', (compilation) => {
        console.log('The compiler is starting a new compilation...');

        compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tapAsync(
          'MyPlugin',
          (data, cb) => {
            data.html += 'The Magic Footer'

            cb(null, data)
          }
        )
      })
    }

    module.exports = MyPlugin
    ```
    如果你认真读完了上个板块的内容，你会发现，这个 htmlWebpackPluginAfterHtmlProcessing
    不就是这个插件自己挂载在webpack事件流上的自定义事件嘛，它会在生成输出文件准备注入HTML时
    调用你自定义的回调，并向回调里传入本次编译后生成的资源文件的相关信息以及待注入的HTML文件
    的内容（字符串形式）供我们自定义操作。在项目搜一下这个钩子：
    这不和我们在3.2里说的一样嘛，先实例化我们所需要的hook，从名字就可以看出来只有第一个是同步钩子，
    另外几个都是异步钩子。然后再找找事件的广播：
    和我们刚刚介绍的一模一样对吧，只不过异步钩子使用promise方法去广播，其他不就完全是我们自定义事件的流程。
    大家如果有兴趣可以去打下console看看 htmlWebpackPluginAfterHtmlProcessing 这个钩子向回调传入的数据，
    或许你能发现一片新大陆哦。
