# Webpack揭秘——走向高阶前端的必经之路

> 随着前端工程化的不断发展，构建工具也在不断完善。作为大前端时代的新宠，webpack渐渐成为新时代前端工程师不可或缺的构建工具，随着webpack4的不断迭代，我们享受着构建效率不断提升带来的快感，配置不断减少的舒适，也一直为重写的构建事件钩子机制煞费苦心，为插件各种不兼容心灰意冷，虽然过程痛苦，但结果总是美好的。经历了一番繁琐的配置后，我常常会想，这样一个精巧的工具，在构建过程中做了什么？我也是抱着这样的好奇，潜心去翻阅相关书籍和官方文档，终于对其中原理有所了解，那么现在，就让我们一起来逐步揭开webpack这个黑盒的神秘面纱，探寻其中的运行机制吧。

> 本文将以三部分内容：Webpack运行机制、编写自定义webpack loader、编写自定义webpack plugin 直击webpack原理痛点，开启你通向高级前端工程师之路～
本次webpack系列文章可参照项目：[demo](https://link.juejin.im/?target=https%3A%2F%2Fgithub.com%2FjerryOnlyZRJ%2Fwebpack-loader)。

> 本系列文章使用的webpack版本为4，如有其他版本问题可提issue或者直接在文章下方的评论区留言。

## 1.Webpack运行机制

### 1.1.webpack运行机制概述
在阅读本文之前，我就默认电脑前的你已经掌握了webpack的基本配置，能够独立搭建一款基于webpack的前端自动化构建体系，所以这篇文章不会教你如何配置或者使用webpack，自然具体概念我就不做介绍了，直面主题，开始讲解webpack原理。
webpack的运行过程可以简单概述为如下流程：
初始化配置参数 -> 绑定事件钩子回调 -> 确定Entry逐一遍历 -> 使用loader编译文件 -> 输出文件
接下来，我们将对具体流程逐一介绍。
### 1.2.webpack运行流程
#### 1.2.1.webpack事件流初探
在分析webpack运行流程时，我们可以借助一个概念，便是webpack的事件流机制。
> 什么是webpack事件流？
Webpack 就像一条生产线，要经过一系列处理流程后才能将源文件转换成输出结果。 这条生产线上的每个处理流程的职责都是单一的，多个流程之间有存在依赖关系，只有完成当前处理后才能交给下一个流程去处理。 插件就像是一个插入到生产线中的一个功能，在特定的时机对生产线上的资源做处理。
Webpack 通过 Tapable 来组织这条复杂的生产线。 Webpack 在运行过程中会广播事件，插件只需要监听它所关心的事件，就能加入到这条生产线中，去改变生产线的运作。 Webpack 的事件流机制保证了插件的有序性，使得整个系统扩展性很好。     --吴浩麟《深入浅出webpack》
我们将webpack事件流理解为webpack构建过程中的一系列事件，他们分别表示着不同的构建周期和状态，我们可以像在浏览器上监听click事件一样监听事件流上的事件，并且为它们挂载事件回调。我们也可以自定义事件并在合适时机进行广播，这一切都是使用了webpack自带的模块 Tapable 进行管理的。我们不需要自行安装 Tapable ，在webpack被安装的同时它也会一并被安装，如需使用，我们只需要在文件里直接 require 即可。
Tapable的原理其实就是我们在前端进阶过程中都会经历的EventEmit，通过发布者-订阅者模式实现，它的部分核心代码可以概括成下面这样：
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
Tapable的具体内容可以参照文章：[《webpack4.0源码分析之Tapable》] (https://juejin.im/post/5abf33f16fb9a028e46ec352)。其使用方法我们会在后文中的“3.编写自定义webpack plugin”模块再做深入介绍。
因为webpack4重写了事件流机制，所以如果我们翻阅 [webpack hook](https://link.juejin.im/?target=https%3A%2F%2Fwebpack.js.org%2Fapi%2Fcompiler-hooks%2F) 的官方文档会发现信息特别繁杂，但是在实际使用中，我们只需要记住几个重要的事件就足够了。
#### 1.2.2.webpack运行流程详解
在讲解webpack流程之前先附上一张我自己绘制的执行流程图：
![流程图]("https://github.com/sunscheung/notes/tree/master/imgs/webpack流程.png")

首先，webpack会读取你在命令行传入的配置以及项目里的 webpack.config.js 文件，初始化本次构建的配置参数，并且执行配置文件中的插件实例化语句，生成Compiler传入plugin的apply方法，为webpack事件流挂上自定义钩子。
接下来到了entryOption阶段，webpack开始读取配置的Entries，递归遍历所有的入口文件
Webpack进入其中一个入口文件，开始compilation过程。先使用用户配置好的loader对文件内容进行编译（buildModule），我们可以从传入事件回调的compilation上拿到module的resource（资源路径）、loaders（经过的loaders）等信息；之后，再将编译好的文件内容使用acorn解析生成AST静态语法树（normalModuleLoader），分析文件的依赖关系逐个拉取依赖模块并重复上述过程，最后将所有模块中的require语法替换成__webpack_require__来模拟模块化操作。
emit阶段，所有文件的编译及转化都已经完成，包含了最终输出的资源，我们可以在传入事件回调的compilation.assets 上拿到所需数据，其中包括即将输出的资源、代码块Chunk等等信息。

#### 1.2.3.什么是AST?
在1.2.2中，我们看到了一个陌生的字眼——AST，上网一搜：
在计算机科学中，抽象语法树（Abstract Syntax Tree，AST），或简称语法树（Syntax tree），是源代码语法结构的一种抽象表示。它以树状的形式表现编程语言的语法结构，树上的每个节点都表示源代码中的一种结构。之所以说语法是“抽象”的，是因为这里的语法并不会表示出真实语法中出现的每个细节。比如，嵌套括号被隐含在树的结构中，并没有以节点的形式呈现；而类似于 if-condition-then 这样的条件跳转语句，可以使用带有两个分支的节点来表示。  --维基百科
其实，你只要记着，AST是一棵树，像这样：
![AST]("https://github.com/sunscheung/notes/tree/master/imgs/AST.png")

转换成AST的目的就是将我们书写的字符串文件转换成计算机更容易识别的数据结构，这样更容易提取其中的关键信息，而这棵树在计算机上的表现形式，其实就是一个单纯的Object。
![AST-tree]("https://github.com/sunscheung/notes/tree/master/imgs/AST-tree.png")

示例是一个简单的声明赋值语句，经过AST转化后各部分内容的含义就更为清晰明了了。
#### 1.2.4.webpack输出结果解析
接下来，我们来看看webpack的输出内容。如果我们没有设置splitChunk，我们只会在dist目录下看到一个main.js输出文件，过滤掉没用的注释还有一些目前不需要去考虑的Funciton，得到的代码大概是下面这样：
```
(function (modules) {
  //  缓存已经加载过的module的exports
  //  module在exports之前还是有js需要执行的，缓存的目的就是优化这一过程
  // The module cache
  var installedModules = {};

  // The require function
  /**
   * 模拟CommonJS require()
   * @param {String} moduleId 模块路径
   */
  function __webpack_require__(moduleId) {

    // Check if module is in cache
    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports;
    }
    // Create a new module (and put it into the cache)
    var module = installedModules[moduleId] = {
      i: moduleId,
      l: false,
      exports: {}
    };

    // 执行单个module JS Function并填充installedModules与module
    // function mudule(module, __webpack_exports__[, __webpack_require__])
    // Execute the module function
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

    // Flag the module as loaded
    module.l = true;

    // Return the exports of the module
    return module.exports;
  }

  // expose the modules object (__webpack_modules__)
  __webpack_require__.m = modules;

  // expose the module cache
  __webpack_require__.c = installedModules;

 ......

  // __webpack_public_path__
  __webpack_require__.p = "";

  // 加载Entry并返回Entry的exports
  // Load entry module and return exports
  return __webpack_require__(__webpack_require__.s = "./src/index.js");
})
  // modules其实就是一个对象，键是模块的路径，值就是模块的JS Function
  ({
    "./src/index.js": function (module, __webpack_exports__, __webpack_require__) {
      "use strict";
      eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _module_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./module.js */ \"./src/module.js\");\n/* harmony import */ var _module_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_module_js__WEBPACK_IMPORTED_MODULE_0__);\n{};\nconsole.log(_module_js__WEBPACK_IMPORTED_MODULE_0___default.a.s);\n\n//# sourceURL=webpack:///./src/index.js?");
    },
    "./src/module.js": function (module, exports) {
      eval("{};var s = 123;\nconsole.log(s);\nmodule.exports = {\n  s: s\n};\n\n//# sourceURL=webpack:///./src/module.js?");
    }
  });
```
我们都知道其实webpack在浏览器实现模块化的本质就是将所有的代码都注入到同一个JS文件里，现在我们可以清晰明了地看出webpack最后生成的也不过只是一个IIFE，我们引入的所有模块都被一个function给包起来组装成一个对象，这个对象作为IIFE的实参被传递进去。
但如果我们配置了splitChunk，这时候输出的文件就和你的Chunk挂钩了，代码也变了模样：
 //@file: dist/common/runtime.js
 // 当配置了splitChunk之后，此时IIFE的形参modules就成了摆设，
 // 真正的module还有chunk都被存放在了一个挂载在window上的全局数组`webpackJsonp`上了
 ```
 (function(modules) { // webpackBootstrap
	 // install a JSONP callback for chunk loading
	 /**
	  * webpackJsonpCallback 处理chunk数据
	  * @param {Array} data  [[chunkId(chunk名称)], modules(Object), [...other chunks(所有需要的chunk)]]
	  */
 	function webpackJsonpCallback(data) {
        // chunk的名称，如果是entry chunk也就是我们entry的key
 		var chunkIds = data[0];
        // 依赖模块
 		var moreModules = data[1];
 		var executeModules = data[2];

 		// add "moreModules" to the modules object,
 		// then flag all "chunkIds" as loaded and fire callback
 		var moduleId, chunkId, i = 0, resolves = [];
 		for(;i < chunkIds.length; i++) {
 			chunkId = chunkIds[i];
 			if(installedChunks[chunkId]) {
 				resolves.push(installedChunks[chunkId][0]);
 			}
 			installedChunks[chunkId] = 0;
 		}
 		for(moduleId in moreModules) {
 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
 				modules[moduleId] = moreModules[moduleId];
 			}
 		}
 		if(parentJsonpFunction) parentJsonpFunction(data);

 		while(resolves.length) {
 			resolves.shift()();
 		}

 		// add entry modules from loaded chunk to deferred list
 		deferredModules.push.apply(deferredModules, executeModules || []);

 		// run deferred modules when all chunks ready
 		return checkDeferredModules();
 	};
 	function checkDeferredModules() {
 		var result;
 		for(var i = 0; i < deferredModules.length; i++) {
 			var deferredModule = deferredModules[i];
 			var fulfilled = true;
 			for(var j = 1; j < deferredModule.length; j++) {
 				var depId = deferredModule[j];
 				if(installedChunks[depId] !== 0) fulfilled = false;
 			}
 			if(fulfilled) {
 				deferredModules.splice(i--, 1);
 				result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
 			}
 		}
 		return result;
 	}

 	// The module cache
 	var installedModules = {};

	// 缓存chunk，同理module
 	// object to store loaded and loading chunks
 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
 	// Promise = chunk loading, 0 = chunk loaded
 	var installedChunks = {
 		"common/runtime": 0
 	};

 	var deferredModules = [];

 	// The require function
 	function __webpack_require__(moduleId) {
 		// Check if module is in cache
 		if(installedModules[moduleId]) {
 			return installedModules[moduleId].exports;
 		}
 		// Create a new module (and put it into the cache)
 		var module = installedModules[moduleId] = {
 			i: moduleId,
 			l: false,
 			exports: {}
 		};
 		// Execute the module function
 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
 		// Flag the module as loaded
 		module.l = true;
 		// Return the exports of the module
 		return module.exports;
 	}


 	// expose the modules object (__webpack_modules__)
 	__webpack_require__.m = modules;

 	// expose the module cache
 	__webpack_require__.c = installedModules;

 	......

 	// __webpack_public_path__
 	__webpack_require__.p = "";

 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
 	jsonpArray.push = webpackJsonpCallback;
 	jsonpArray = jsonpArray.slice();
 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
 	var parentJsonpFunction = oldJsonpFunction;


 	// run deferred modules from other chunks
 	checkDeferredModules();
 })([]);
 ```
 ```
/@file: dist/common/utils.js
(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["common/utils"], {
  "./src/index.js": function (module, __webpack_exports__, __webpack_require__) {
    "use strict";
    eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _module_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./module.js */ \"./src/module.js\");\n/* harmony import */ var _module_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_module_js__WEBPACK_IMPORTED_MODULE_0__);\n{};\nconsole.log(_module_js__WEBPACK_IMPORTED_MODULE_0___default.a.s);\n\n//# sourceURL=webpack:///./src/index.js?");
  },
  "./src/module.js": function (module, exports) {
    eval("{};var s = 123;\nconsole.log(s);\nmodule.exports = {\n  s: s\n};\n\n//# sourceURL=webpack:///./src/module.js?");
  }
}]);
```
复制代码这时候，IIFE的形参也变成了摆设，所有我们的模块都被放在了一个名为 webpackJsonp 的全局数组上，通过IIFE里的 webpackJsonpCallback 来处理数据。
## 1.3.总结
纵观webpack构建流程，我们可以发现整个构建过程主要花费时间的部分也就是递归遍历各个entry然后寻找依赖逐个编译的过程，每次递归都需要经历 String->AST->String 的流程，经过loader还需要处理一些字符串或者执行一些JS脚本，介于node.js单线程的壁垒，webpack构建慢一直成为它饱受诟病的原因。这也是happypack之所以能大火的原因，我们可以来看一段happypack的示例代码:
```
// @file: webpack.config.js
const HappyPack = require('happypack');
const os = require('os');
// 开辟一个线程池
// 拿到系统CPU的最大核数，让happypack将编译工作灌满所有CPU核
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

module.exports = {
  // ...
  plugins: [
    new HappyPack({
      id: 'js',
      threadPool: happyThreadPool,
      loaders: [ 'babel-loader' ]
    }),

    new HappyPack({
      id: 'styles',
      threadPool: happyThreadPool,
      loaders: [ 'style-loader', 'css-loader', 'less-loader' ]
    })
  ]
};
```
大家如果有用过pm2的话就能很容易明白了，其实原理是一致的，都是利用了node.js原生的cluster模块去开辟多进程执行构建，不过在4之后大家就可以不用去纠结这一问题了，多进程构建已经被集成在webpack本身上了，除了增量编译，这也是4之所以能大幅度提升构建效率的原因之一。
## 2.编写自定义webpack loader
### 2.1.让webpack loader现出原型
在webpack中，真正起编译作用的便是我们的loader，也就是说，平时我们进行babel的ES6编译，SCSS、LESS等编译都是在loader里面完成的，在你不知道loader的本质之前你一定会觉得这是个很高大上的东西，正如计算机学科里的编译原理一样，里面一定有许多繁杂的操作。但实际上，loader只是一个普通的funciton，他会传入匹配到的文件内容(String)，你只需要对这些字符串做些处理就好了。一个最简单的loader大概是这样：
```
/**
 * loader Function
 * @param {String} content 文件内容
 */
module.exports = function(content){
    return "{};" + content
}
复制代码使用它的方式和babel-loader一样，只需要在webpack.config.js的module.rules数组里加上这么一个对象就好了：
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
这样，loader会去匹配所有以.js后缀结尾的文件并在内容前追加{};这样一段代码，我们可以在输出文件中看到效果：
![loader1]("https://github.com/sunscheung/notes/tree/master/imgs/loader1.png")
所以，拿到了文件内容，你想对字符串进行怎样得处理都由你自定义～你可以引入babel库加个 babel(content) ，这样就实现了编译，也可以引入uglifyjs对文件内容进行字符串压缩，一切工作都由你自己定义。
### 2.2.Loader实战常用技巧
#### 2.2.1.拿到loader的用户自定义配置
![loader2]("https://github.com/sunscheung/notes/tree/master/imgs/loader2.png")
在我们在webpack.config.js书写loader配置时，经常会见到 options 这样一个配置项，这就是webpack为用户提供的自定义配置，在我们的loader里，如果要拿到这样一个配置信息，只需要使用这个封装好的库 loader-utils 就可以了：
```
const loaderUtils = require("loader-utils");

module.exports = function(content){
    // 获取用户配置的options
    const options = loaderUtils.getOptions(this);
    console.log('***options***', options)
    return "{};" + content
}
````
#### 2.2.2.loader导出数据的形式
在前面的示例中，因为我们一直loader是一个Funtion，所以我们使用了return的方式导出loader处理后的数据，但其实这并不是我们最推荐的写法，在大多数情况下，我们还是更希望使用 this.callback 方法去导出数据。如果改成这种写法，示例代码可以改写为：
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

#### 2.2.3.异步loader
经过2.2.2我们可以发现，不论是使用return还是 this.callback 的方式，导出结果的执行都是同步的，假如我们的loader里存在异步操作，比如拉取请求等等又该怎么办呢？
熟悉ES6的朋友都知道最简单的解决方法便是封装一个Promise，然后用async-await完全无视异步问题，示例代码如下：
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
但如果node的版本不够，我们还有原始的土方案 this.async ，调用这个方法会返回一个callback Function，在适当时候执行这个callback就可以了，上面的示例代码可以改写为：
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
#### 2.2.4.loaders的执行顺序
还记得我们配置CSS编译时写的loader嘛，它们是长这样的：
![loader3]("https://github.com/sunscheung/notes/tree/master/imgs/loader3.png")
在很多时候，我们的 use 里不只有一个loader，这些loader的执行顺序是从后往前的，你也可以把它理解为这个loaders数组的出栈过程。
#### 2.2.5.loader缓存
webpack增量编译机制会观察每次编译时的变更文件，在默认情况下，webpack会对loader的执行结果进行缓存，这样能够大幅度提升构建速度，不过我们也可以手动关闭它（虽然我不知道为什么要关闭它，既然留了这么个API就蛮介绍下吧，欢迎补充），示例代码如下：
```
module.exports = function(content){
    //关闭loader缓存
    this.cacheable(false);
    return "{};" + content
}
```
#### 2.2.6.pitch钩子全程传参
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
## 2.3.总结
通过上述介绍，我们明白了，loader其实就是一个“平平无奇”的Funtion，能够传入本次匹配到的文件内容供我们自定义修改。
## 3.编写自定义webpack plugin
### 3.1.温习一下webpack事件流
还记得我们在前文讲到的webpack事件流，你还记得webpack有哪些常用的事件吗？webpack插件起到的作用，就是为这些事件挂载回调，或者执行指定脚本。
我们在文章里也提到，webpack的事件流是通过 Tapable 实现的，它就和我们的EventEmit一样，是这一系列的事件的生成和管理工具，它的部分核心代码就像下面这样：
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
webpack hook 上的所有钩子都是 Tapable 的示例，所以我们可以通过 tap 方法监听事件，使用 call 方法广播事件，就像官方文档介绍的这样：
compiler.hooks.someHook.tap(/* ... */);
复制代码几个比较常用的hook我们也已经在前文介绍过了，如果大家不记得了，可以回过头再看看哦～
### 3.2.什么是webpack plugin
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
这样就实现了一个简单的webpack plugin，如果我们要使用它，只需要在webpack.config.js 里 require 并实例化就可以了：
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
### 3.3.Tapable新用
如果我们想赋予webpack事件流我们的自定义事件能够实现嘛？
答案当然是必须可以啊老铁！
自定义webpack事件流事件需要几步？四步：


引入Tapable并找到你想用的hook，同步hook or 异步hook 在这里应有尽有 -> webpack4.0源码分析之Tapable
```
const { SyncHook } = require("tapable");
```

实例化Tapable中你所需要的hook并挂载在compiler或compilation上
```
compiler.hooks.myHook = new SyncHook(['data'])
```

在你需要监听事件的位置tap监听
```
compiler.hooks.myHook.tap('Listen4Myplugin', (data) => {
    console.log('@Listen4Myplugin', data)
})
```

在你所需要广播事件的时机执行call方法并传入数据
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
输出结果就是这样：
![loader4]("https://github.com/sunscheung/notes/tree/master/imgs/loader4.png")
我们拿到了call方法传入的数据，并且成功在environment时机里成功输出了。
## 3.4.实战剖析
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
如果你认真读完了上个板块的内容，你会发现，这个 htmlWebpackPluginAfterHtmlProcessing 不就是这个插件自己挂载在webpack事件流上的自定义事件嘛，它会在生成输出文件准备注入HTML时调用你自定义的回调，并向回调里传入本次编译后生成的资源文件的相关信息以及待注入的HTML文件的内容（字符串形式）供我们自定义操作。在项目搜一下这个钩子：
![loader6]("https://github.com/sunscheung/notes/tree/master/imgs/loader6.png")
这不和我们在3.2里说的一样嘛，先实例化我们所需要的hook，从名字就可以看出来只有第一个是同步钩子，另外几个都是异步钩子。然后再找找事件的广播：

![loader7]("https://github.com/sunscheung/notes/tree/master/imgs/loader7.png")
![loader8]("https://github.com/sunscheung/notes/tree/master/imgs/loader8.png")

和我们刚刚介绍的一模一样对吧，只不过异步钩子使用promise方法去广播，其他不就完全是我们自定义事件的流程。大家如果有兴趣可以去打下console看看 htmlWebpackPluginAfterHtmlProcessing 这个钩子向回调传入的数据，或许你能发现一片新大陆哦。

作者：jerryOnlyZRJ
链接：https://juejin.im/post/5badd0c5e51d450e4437f07a
来源：掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
