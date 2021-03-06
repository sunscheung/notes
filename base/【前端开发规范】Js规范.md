# js规范
## 避免全局命名空间污染
防止全局命名空间被污染，我们通常的做法是将代码包裹成一个 IIFE(Immediately-Invoked Function Expression)，创建独立隔绝的定义域。也使得内存在执行完后立即释放。

IIFE 还可确保你的代码不会轻易被其它全局命名空间里的代码所修改（i.e. 第三方库，window 引用，被覆盖的未定义的关键字等等）。
不推荐:
```
var x = 10, y = 100;
// Declaring variables in the global scope is resulting in global scope pollution. All variables declared like this
// will be stored in the window object. This is very unclean and needs to be avoided.
console.log(window.x + ' ' + window.y);
```
推荐:
```
// We declare a IIFE and pass parameters into the function that we will use from the global space
(function(log, w, undefined){
  'use strict';
 
  var x = 10,
      y = 100;
 
  // Will output 'true true'
  log((w.x === undefined) + ' ' + (w.y === undefined));
 
}(window.console.log, window));
```
推荐的IIFE写法:
```
(function(){
  'use strict';
 
  // Code goes here
 
}());
```
如果你想引用全局变量或者是外层 IIFE 的变量，可以通过下列方式传参：
```
(function($, w, d){
  'use strict';
 
  $(function() {
    w.alert(d.querySelectorAll('div').length);
  });
}(jQuery, window, document));
```
> **IIFE写法可以用块作用域代替**
`{// Code goes here}`

## 严格模式
ECMAScript 5 严格模式可在整个脚本或独个方法内被激活。它对应不同的 javascript 语境会做更加严格的错误检查。严格模式也确保了 javascript 代码更加的健壮，运行的也更加快速。
严格模式会阻止使用在未来很可能被引入的预留关键字。
你应该在你的脚本中启用严格模式，最好是在独立的 IIFE 中应用它。避免在你的脚本第一行使用它而导致你的所有脚本都启动了严格模式，这有可能会引发一些第三方类库的问题。
## 变量声明
总是使用 var 来声明变量。如不指定 var，变量将被隐式地声明为全局变量，例如:
`var a = b = 0; //b会被隐式的创建为全局变量`
所以，请总是使用 var 来声明变量，并且使用单var模式（将所有的变量在函数最前面只使用一个var定义）。例如：
```
(function (){
  'use strict'
  var a = 0,
      b = 0,
      c = 0,
      i,
      j,
      myObject();
}())
```
## js声明提前
javascript会自动将函数作用域内的变量和方法的定义提前（只是提前声明，赋值还是在原处）
例如：
```
(function(log){
  'use strict';
 
  var a = 10;
 
  for(var i = 0; i < a; i++) {
    var b = i * i;
    log(b);
  }
 
  if(a === 10) {
    var f = function() {
      log(a);
    };
    f();
  }
 
  function x() {
    log('Mr. X!');
  }
  x();
 
}(window.console.log));
```
提升后的js
```
(function(log){
  'use strict';
  // All variables used in the closure will be hoisted to the top of the function
  var a,
      i,
      b,
      f;
  // All functions in the closure will be hoisted to the top
  function x() {
    log('Mr. X!');
  }
 
  a = 10;
 
  for(i = 0; i < a; i++) {
    b = i * i;
    log(b);
  }
 
  if(a === 10) {
    // Function assignments will only result in hoisted variables but the function body will not be hoisted
    // Only by using a real function declaration the whole function will be hoisted with its body
    f = function() {
      log(a);
    };
    f();
  }
 
  x();
 
}(window.console.log));
```
>**ES6语法中用let申明不存在提升**
使用严格等
总是使用 === 精确的比较操作符，避免在判断的过程中，由 JavaScript 的强制类型转换所造成的困扰。例如：
```
(function(log){
  'use strict';
 
  log('0' == 0); // true
  log('' == false); // true
  log('1' == true); // true
  log(null == undefined); // true
 
  var x = {
    valueOf: function() {
      return 'X';
    }
  };
 
  log(x == 'X');
 
}(window.console.log));
```
## 等同== 和严格等===的区别
1. ==， 两边值类型不同的时候，要先进行类型转换，再比较。
2. ===，不做类型转换，类型不同的一定不等。

==等同操作符
1. 如果两个值具有相同类型，会进行===比较，返回===的比较值
2. 如果两个值不具有相同类型，也有可能返回true
3. 如果一个值是null另一个值是undefined，返回true
4. 如果一个值是string另个是number，会把string转换成number再进行比较
5. 如果一个值是true，会把它转成1再比较，false会转成0
```
console.log( false == null )      // false
console.log( false == undefined ) // false
console.log( false == 0 )         // true
console.log( false == '' )        // true
console.log( false == NaN )       // false
 
console.log( null == undefined ) // true
console.log( null == 0 )         // false
console.log( null == '' )        // false
console.log( null == NaN )       // false
 
console.log( undefined == 0)   // false
console.log( undefined == '')  // false
console.log( undefined == NaN) // false
 
console.log( 0 == '' )  // true
console.log( 0 == NaN ) // false
```
总结一下==

1. false 除了和自身比较为 true 外，和 0，”” 比较也为 true
2. null 只和 undefined 比较时为 true， 反过来 undefined 也仅和 null 比较为 true，没有第二个
3. 0 除了和 false 比较为 true，还有空字符串 ‘’” 和空数组 []
4. 空字符串 ‘’ 除了和 false 比较为 true，还有一个数字 0
>==, >, <, +, -, … 这些操作符所造成的隐式类型转换都是无副作用的，它不会改变变量本身保存的值。，但是，如果你覆写某个对象的 valueOf/toString的话，==就会产生副作用.
例如：
```
Array.prototype.valueOf = function() {
  this[0]++;
  return this;
}
var x = [1, 2, 3];
x == 0;
console.log(x);   // [2, 2, 3]
```
===操作符：

1. 要是两个值类型不同，返回false
2. 要是两个值都是number类型，并且数值相同，返回true
3. 要是两个值都是stirng，并且两个值的String内容相同，返回true
4. 要是两个值都是true或者都是false，返回true
5. 要是两个值都是指向相同的Object，Arraya或者function，返回true
6. 要是两个值都是null或者都是undefined，返回true
## 真假判断
js中以下内容为假：
false
null
undefined
0
‘’ (空字符串)
NaN

## 设置默认参数
辑操作符 || 和 && 也可被用来返回布尔值。如果操作对象为非布尔对象，那每个表达式将会被自左向右地做真假判断。基于此操作，最终总有一个表达式被返回回来。这在变量赋值时，是可以用来简化你的代码的。例如:如果x不存在且y不存在，x=1；如果x存在y存在，x = y
```
if(!x) {
  if(!y) {
    x = 1;
  } else {
    x = y;
  }
}
```
等同于
`x = x || y || 1;`
这一小技巧经常用来给方法设定默认的参数。
```
(function(log){
  'use strict';
 
  function multiply(a, b) {
    a = a || 1;
    b = b || 1;
 
    log('Result ' + a * b);
  }
 
  multiply(); // Result 1
  multiply(10); // Result 10
  multiply(3, NaN); // Result 3
  multiply(9, 5); // Result 45
 
}(window.console.log));
```
## 不使用eval()函数
就如eval的字面意思来说，恶魔，使用eval()函数会带来安全隐患。
eval()函数的作用是返回任意字符串，当作js代码来处理。

## this关键字
只在对象构造器、方法和在设定的闭包中使用 this 关键字。this 的语义在此有些误导。它时而指向全局对象（大多数时），时而指向调用者的定义域（在 eval 中），时而指向 DOM 树中的某一节点（当用事件处理绑定到 HTML 属性上时），时而指向一个新创建的对象（在构造器中），还时而指向其它的一些对象（如果函数被 call() 和 apply() 执行和调用时）。

正因为它是如此容易地被搞错，请限制它的使用场景：
>在构造函数中
在对象的方法中（包括由此创建出的闭包内）

## 首选函数式风格
函数式编程让你可以简化代码并缩减维护成本，因为它容易复用，又适当地解耦和更少的依赖。
接下来的例子中，在一组数字求和的同一问题上，比较了两种解决方案。第一个例子是经典的程序处理，而第二个例子则是采用了函数式编程和 ECMA Script 5.1 的数组方法。
不推荐
```
(function(log){
  'use strict';
  var arr = [10, 3, 7, 9, 100, 20],
        sum = 0,
         i; 
  for(i = 0; i < arr.length; i++) {
    sum += arr[i];
  } 
  log('The sum of array ' + arr + ' is: ' + sum) 
}(window.console.log));
```
推荐(函数式编程)：
```
(function(log){
  'use strict';
  var arr = [10, 3, 7, 9, 100, 20];
  var sum = arr.reduce(function(prevValue, currentValue) {
    return prevValue + currentValue;
  }, 0);
  log('The sum of array ' + arr + ' is: ' + sum);
}(window.console.log));
```
## 修改内建对象的原型链
修改内建的诸如 Object.prototype 和 Array.prototype 是被严厉禁止的。修改其它的内建对象比如 Function.prototype，虽危害没那么大，但始终还是会导致在开发过程中难以 debug 的问题，应当也要避免。

## 三元条件判断（if 的快捷方法）
用三元操作符分配或返回语句。在比较简单的情况下使用，避免在复杂的情况下使用。没人愿意用 10 行三元操作符把自己的脑子绕晕。
不推荐：
```
if(x === 10) {
  return 'valid';
} else {
  return 'invalid';
}
```
推荐：
`return x === 10 ? 'valid' : 'invalid'`

# JSHint
在js规范中，有很多规范都是样式上的规范而不是逻辑上的规范，比如尽量使用===而不是==，我们可以使用JSHint或者JSLint，Javascript代码验证工具，这种工具可以检查你的代码并提供相关的代码改进意见。我个人使用的是JSHint，所以就以这个为例:
ESLint 在vscode编辑器中 搭建
1. 先在vscode中安装ESlint ,在扩展中搜索eslint并且安装
![image](https://user-images.githubusercontent.com/9931345/35262799-1bff78c2-0051-11e8-8fa4-753a547721a9.png)

2. 安装完成后打开终端控制台输入一下命令
>npm i eslint -g          //先全局安装eslint
>cd yourDocumentPath      //进入你的文件目录
> eslint --init        //初始化eslint 
![image](https://user-images.githubusercontent.com/9931345/35262814-36e9c390-0051-11e8-9303-8826f7cf7399.png)

即可使用， 可以去eslint官网根据具体情况配置对.eslintrc.json 进行配置 
![image](https://user-images.githubusercontent.com/9931345/35262780-0c64df10-0051-11e8-8457-c50649435ebc.png)

这些规范都是什么意思呢，这里列出一些常用的，剩下的大家可以参考[官方文档](http://jshint.com/docs/)


|名称    | 含义    |
|------|--------|
|curly | 循环或者条件语句必须使用花括号包住  |
|eqeqeq | 使用强制等===  |
|newcap | 对于首字母大写的函数（声明的类），强制使用new  |
|noarg | 禁用arguments.caller和arguments.callee  |
|sub | 对于属性使用aaa.bbb而不是aaa[‘bbb’]  |
|undef | 查找所有未定义的变量  |
|boss | 查找类似与if(a = 0)这样的代码  |
|node | 指定运行环境为node  |
|strict | 必须使用严格模式  |
|asi | 允许省略分号  |
|bitwise | 禁止使用位运算符，比如经常把&&写错& 规避此错误  |
|jquery | 定义全局暴露的jQuery库  |
|evil | 禁止使用eval  |
|maxdepth | 嵌套的最大深度  |
|maxparams | 参数的最大个数  |



[来源](http://cherryblog.site/developing-guideline.html)