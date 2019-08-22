##【JavaScript】深入理解Babel原理及其使用

##Babel的包构成

### 核心包

* babel-core：babel转译器本身，提供了babel的转译API，如babel.transform等，用于对代码进行转译。像webpack的babel-loader就是调用这些API来完成转译过程的。
* babylon：js的词法解析器
* babel-traverse：用于对AST（抽象语法树，想了解的请自行查询编译原理）的遍历，主要给plugin用
* babel-generator：根据AST生成代码

### 功能包

* babel-types：用于检验、构建和改变AST树的节点
* babel-template：辅助函数，用于从字符串形式的代码来构建AST树节点
* babel-helpers：一系列预制的babel-template函数，用于提供给一些plugins使用
* babel-code-frames：用于生成错误信息，打印出错误点源代码帧以及指出出错位置
* babel-plugin-xxx：babel转译过程中使用到的插件，其中babel-plugin-transform-xxx是transform步骤使用的
* babel-preset-xxx：transform阶段使用到的一系列的plugin
* babel-polyfill：JS标准新增的原生对象和API的shim，实现上仅仅是core-js和regenerator-runtime两个包的封装
* babel-runtime：功能类似babel-polyfill，一般用于library或plugin中，因为它不会污染全局作用域

### 工具包
* babel-cli：babel的命令行工具，通过命令行对js代码进行转译
* babel-register：通过绑定node.js的require来自动转译require引用的js代码文件

### babel的配置
使用形式
如果是以命令行方式使用babel，那么babel的设置就以命令行参数的形式带过去；
还可以在package.json里在babel字段添加设置；
但是建议还是使用一个单独的.babelrc文件，把babel的设置都放置在这里，所有babel API的options（除了回调函数之外）都能够支持，具体的options见babel的API options文档
常用options字段说明

env：指定在不同环境下使用的配置。比如production和development两个环境使用不同的配置，就可以通过这个字段来配置。env字段的从process.env.BABEL_ENV获取，如果BABEL_ENV不存在，则从process.env.NODE_ENV获取，如果NODE_ENV还是不存在，则取默认值"development"
plugins：要加载和使用的插件列表，插件名前的babel-plugin-可省略；plugin列表按从头到尾的顺序运行
presets：要加载和使用的preset列表，preset名前的babel-preset-可省略；presets列表的preset按从尾到头的逆序运行（为了兼容用户使用习惯）
同时设置了presets和plugins，那么plugins的先运行；每个preset和plugin都可以再配置自己的option

### 配置文件的查找
babel会从当前转译的文件所在目录下查找配置文件，如果没有找到，就顺着文档目录树一层层往上查找，一直到.babelrc文件存在或者带babel字段的package.json文件存在为止。

## babel的工作原理
babel是一个转译器，感觉相对于编译器compiler，叫转译器transpiler更准确，因为它只是把同种语言的高版本规则翻译成低版本规则，而不像编译器那样，输出的是另一种更低级的语言代码。
但是和编译器类似，babel的转译过程也分为三个阶段：parsing、transforming、generating，以ES6代码转译为ES5代码为例，babel转译的具体过程如下：

>> ES6代码输入 ==》 babylon进行解析 ==》 得到AST
==》 plugin用babel-traverse对AST树进行遍历转译 ==》 得到新的AST树
==》 用babel-generator通过AST树生成ES5代码

此外，还要注意很重要的一点就是，babel只是转译新标准引入的语法，比如ES6的箭头函数转译成ES5的函数；而新标准引入的新的原生对象，部分原生对象新增的原型方法，新增的API等（如Proxy、Set等），这些babel是不会转译的。需要用户自行引入polyfill来解决
### plugins
插件应用于babel的转译过程，尤其是第二个阶段transforming，如果这个阶段不使用任何插件，那么babel会原样输出代码。
我们主要关注transforming阶段使用的插件，因为transform插件会自动使用对应的词法插件，所以parsing阶段的插件不需要配置。
presets
如果要自行配置转译过程中使用的各类插件，那太痛苦了，所以babel官方帮我们做了一些预设的插件集，称之为preset，这样我们只需要使用对应的preset就可以了。以JS标准为例，babel提供了如下的一些preset：

* es2015
* es2016
* es2017
* env
es20xx的preset只转译该年份批准的标准，而env则代指最新的标准，包括了latest和es20xx各年份
另外，还有 stage-0到stage-4的标准成形之前的各个阶段，这些都是实验版的preset，建议不要使用。

### polyfill
polyfill是一个针对ES2015+环境的shim，实现上来说babel-polyfill包只是简单的把core-js和regenerator runtime包装了下，这两个包才是真正的实现代码所在（后文会详细介绍core-js）。
使用babel-polyfill会把ES2015+环境整体引入到你的代码环境中，让你的代码可以直接使用新标准所引入的新原生对象，新API等，一般来说单独的应用和页面都可以这样使用。
### 使用方法

先安装包： npm install --save babel-polyfill
要确保在入口处导入polyfill，因为polyfill代码需要在所有其他代码前先被调用
代码方式： import "babel-polyfill"
webpack配置： module.exports = { entry: ["babel-polyfill", "./app/js"] };


如果只是需要引入部分新原生对象或API，那么可以按需引入，而不必导入全部的环境，具体见下文的core-js
### runtime
polyfill和runtime的区别
直接使用babel-polyfill对于应用或页面等环境在你控制之中的情况来说，并没有什么问题。但是对于在library中使用polyfill，就变得不可行了。因为library是供外部使用的，但外部的环境并不在library的可控范围，而polyfill是会污染原来的全局环境的（因为新的原生对象、API这些都直接由polyfill引入到全局环境）。这样就很容易会发生冲突，所以这个时候，babel-runtime就可以派上用场了。
transform-runtime和babel-runtime
babel-plugin-transform-runtime插件依赖babel-runtime，babel-runtime是真正提供runtime环境的包；也就是说transform-runtime插件是把js代码中使用到的新原生对象和静态方法转换成对runtime实现包的引用，举个例子如下：
// 输入的ES6代码
var sym = Symbol();
// 通过transform-runtime转换后的ES5+runtime代码 
var _symbol = require("babel-runtime/core-js/symbol");
var sym = (0, _symbol.default)();

从上面这个例子可见，原本代码中使用的ES6新原生对象Symbol被transform-runtimec插件转换成了babel-runtime的实现，既保持了Symbol的功能，同时又没有像polyfill那样污染全局环境（因为最终生成的代码中，并没有对Symbol的引用）
另外，这里我们也可以隐约发现，babel-runtime其实也不是真正的实现代码所在，真正的代码实现是在core-js中，后面我们再说
transform-runtime插件的功能

把代码中的使用到的ES6引入的新原生对象和静态方法用babel-runtime/core-js导出的对象和方法替代
当使用generators或async函数时，用babel-runtime/regenerator导出的函数取代（类似polyfill分成regenerator和core-js两个部分）
把Babel生成的辅助函数改为用babel-runtime/helpers导出的函数来替代（babel默认会在每个文件顶部放置所需要的辅助函数，如果文件多的话，这些辅助函数就在每个文件中都重复了，通过引用babel-runtime/helpers就可以统一起来，减少代码体积）

上述三点就是transform-runtime插件所做的事情，由此也可见，babel-runtime就是一个提供了regenerator、core-js和helpers的运行时库。
建议不要直接使用babel-runtime，因为transform-runtime依赖babel-runtime，大部分情况下都可以用transform-runtime达成目的。
此外，transform-runtime在.babelrc里配置的时候，还可以设置helpers、polyfill、regenerator这三个开关，以自行决定runtime是否要引入对应的功能。
最后补充一点：由于runtime不会污染全局空间，所以实例方法是无法工作的（因为这必须在原型链上添加这个方法，这是和polyfill最大的不同） ，比如：
var arr = ['a', 'b', 'c'];
arr.fill(7);  // 实例方法不行
Array.prototype.fill.apply(arr, 7);  // 用原型链来调用也是不行

## 通过core-js实现按需引入polyfill或runtime
core-js包才上述的polyfill、runtime的核心，因为polyfill和runtime其实都只是对core-js和regenerator的再封装，方便使用而已。
但是polyfill和runtime都是整体引入的，不能做细粒度的调整，如果我们的代码只是用到了小部分ES6而导致需要使用polyfill和runtime的话，会造成代码体积不必要的增大（runtime的影响较小）。所以，按需引入的需求就自然而然产生了，这个时候就得依靠core-js来实现了。
### core-js的组织结构
首先，core-js有三种使用方式：

* 默认方式：require('core-js')
这种方式包括全部特性，标准的和非标准的
* 库的形式： var core = require('core-js/library')
这种方式也包括全部特性，只是它不会污染全局名字空间
* 只是shim： require('core-js/shim')或var shim = require('core-js/library/shim')
这种方式只包括标准特性（就是只有polyfill功能，没有扩展的特性）

core-js的结构是高度模块化的，它把每个特性都组织到一个小模块里，然后再把这些小模块组合成一个大特性，层层组织。比如：
core-js/es6（core-js/library/es6）就包含了全部的ES6特性，而core-js/es6/array（core-js/library/es6/array）则只包含ES6的Array特性，而core-js/fn/array/from（core-js/library/fn/array/from）则只有Array.from这个实现。
实现按需使用，就是自己选择使用到的特性，然后导入即可。具体的每个特性和对应的路径可以直接查看core-js的github
### core-js的按需使用
1、类似polyfill，直接把特性添加到全局环境，这种方式体验最完整
```
require('core-js/fn/set');
require('core-js/fn/array/from');
require('core-js/fn/array/find-index');

Array.from(new Set([1, 2, 3, 2, 1])); // => [1, 2, 3]
[1, 2, NaN, 3, 4].findIndex(isNaN);   // => 2
```
2、类似runtime一样，以库的形式来使用特性，这种方式不会污染全局名字空间，但是不能使用实例方法
```
var Set       = require('core-js/library/fn/set');
var from      = require('core-js/library/fn/array/from');
var findIndex = require('core-js/library/fn/array/find-index');

from(new Set([1, 2, 3, 2, 1]));      // => [1, 2, 3]
findIndex([1, 2, NaN, 3, 4], isNaN); // => 2
```
3、因为第二种库的形式不能使用prototype方法，所以第三种方式使用了一个小技巧，通过::这个符号而不是.来调用实例方式，从而达到曲线救国的目的。这种方式的使用，路径中都会带有/virtual/
```
import {fill, findIndex} from 'core-js/library/fn/array/virtual';

Array(10)::fill(0).map((a, b) => b * b)::findIndex(it => it && !(it % 8)); // => 4

// 对比下polyfill的实现 
// Array(10).fill(0).map((a, b) => b * b).findIndex(it => it && !(it % 8));
```
## 总结
Babel使用的难点主要在于理解polyfill、runtime和core-js，通过本文，把这三者的概念和关系理清楚了，对babel的使用就不存在问题！
 

