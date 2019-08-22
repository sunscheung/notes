## 无用的typeof
typeof  首先需要注意的是，typeof方法返回一个字符串，来表示数据的类型。
语法讲解： 各个数据类型对应typeof的值：
```
数据类型	         Type
Undefined	        "undefined"
Null	            "object"
布尔值	            "boolean"
数值	             "number"
字符串	            "string"
Symbol (es6 新增)	 "symbol"
宿主对象(比如浏览器)	Implementation-dependent
函数对象	          "function"
任何其他对象	       "object"
```
```
// Numbers
typeof 37 === 'number';
typeof 3.14 === 'number';
typeof Math.LN2 === 'number';
typeof Infinity === 'number';
typeof NaN === 'number'; // 尽管NaN是"Not-A-Number"的缩写,意思是"不是一个数字"
typeof Number(1) === 'number'; // 不要这样使用!

// Strings
typeof "" === 'string';
typeof "bla" === 'string';
typeof (typeof 1) === 'string'; // typeof返回的肯定是一个字符串
typeof String("abc") === 'string'; // 不要这样使用!

// Booleans
typeof true === 'boolean';
typeof false === 'boolean';
typeof Boolean(true) === 'boolean'; // 不要这样使用!

// Symbols
typeof Symbol() === 'symbol';
typeof Symbol('foo') === 'symbol';
typeof Symbol.iterator === 'symbol';

// Undefined
typeof undefined === 'undefined';
typeof blabla === 'undefined'; // 一个未定义的变量,或者一个定义了却未赋初值的变量

// Objects
typeof {a:1} === 'object';

// 使用Array.isArray或者Object.prototype.toString.call方法可以从基本的对象中区分出数组类型
typeof [1, 2, 4] === 'object';

typeof new Date() === 'object';

// 下面的容易令人迷惑，不要这样使用！
typeof new Boolean(true) === 'object';
typeof new Number(1) ==== 'object';
typeof new String("abc") === 'object';

// 函数
typeof function(){} === 'function';
typeof Math.sin === 'function';
```

用typeof来判断数据类型其实并不准确。js一切皆对象，除了基本类型其他都是很容易出现问题是我。
比如数组、正则、日期、对象的typeof返回值都是object，这就会造成一些误差。

所以在typeof判断类型的基础上，我们还需要利用Object.prototype.toString方法来进一步判断数据类型。

在相同数据类型的情况下，toString方法和typeof方法返回值的区别：
```
数据	              toString	    typeof
“foo”	              String	      string
new String(“foo”)	  String	      object
new Number(1.2)	    Number	      object
true	              Boolean	      boolean
new Boolean(true)	  Boolean	      object
new Date()	        Date	        object
new Error()	        Error	        object
new Array(1, 2, 3)	Array	        object
/abc/g	            RegExp	      object
new RegExp(“meow”)	RegExp	      object
```

可以看到利用toString方法可以正确区分出Array、Error、RegExp、Date等类型。
## instanceof
instanceof运算符可以用来判断某个构造函数的prototype属性是否存在于另外一个要检测对象的原型链上。 
```
// 定义构造函数
function C(){} 
function D(){} 

var o = new C();

// true，因为 Object.getPrototypeOf(o) === C.prototype
o instanceof C; 

// false，因为 D.prototype不在o的原型链上
o instanceof D; 

o instanceof Object; // true,因为Object.prototype.isPrototypeOf(o)返回true
C.prototype instanceof Object // true,同上

C.prototype = {};
var o2 = new C();

o2 instanceof C; // true

o instanceof C; // false,C.prototype指向了一个空对象,这个空对象不在o的原型链上.

D.prototype = new C(); // 继承
var o3 = new D();
o3 instanceof D; // true
o3 instanceof C; // true
```
但是这里我们需要注意构造函数的原型被覆盖的情况：
```
function fun(){ return fun; }
console.log(new f() instanceof f);//false
function fun2(){}
console.log(new fun2() instanceof fun2);//true
```
## 推荐使用Object.prototype.toString.call()来检测类型

```
console.log(Object.prototype.toString.call(obj) === "[object Object]");
//使用以上方式可以很好的区分各种类型：
//（无法区分自定义对象类型，自定义类型可以采用instanceof区分）
console.log(Object.prototype.toString.call("jerry"));//[object String]
console.log(Object.prototype.toString.call(12));//[object Number]
console.log(Object.prototype.toString.call(true));//[object Boolean]
console.log(Object.prototype.toString.call(undefined));//[object Undefined]
console.log(Object.prototype.toString.call(null));//[object Null]
console.log(Object.prototype.toString.call({name: "jerry"}));//[object Object]
console.log(Object.prototype.toString.call(function(){}));//[object Function]
console.log(Object.prototype.toString.call([]));//[object Array]
console.log(Object.prototype.toString.call(new Date));//[object Date]
console.log(Object.prototype.toString.call(/\d/));//[object RegExp]
function Person(){};
console.log(Object.prototype.toString.call(new Person));//[object Object]
```
为什么这样就能区分呢？于是我去看了一下toString方法的用法：toString方法返回反映这个对象的字符串。

那为什么不直接用obj.toString()呢？
```
console.log("jerry".toString());//jerry
console.log((1).toString());//1
console.log([1,2].toString());//1,2
console.log(new Date().toString());//Wed Dec 21 2016 20:35:48 GMT+0800 (中国标准时间)
console.log(function(){}.toString());//function (){}
console.log(null.toString());//error
console.log(undefined.toString());//error
```
同样是检测对象obj调用toString方法，
obj.toString()的结果和Object.prototype.toString.call(obj)的结果不一样，这是为什么？

这是因为toString为Object的原型方法，而Array ，function等类型作为Object的实例，都重写了toString方法。
不同的对象类型调用toString方法时，根据原型链的知识，调用的是对应的重写之后的toString方法（function类型返回内容为函数体的字符串，
Array类型返回元素组成的字符串.....），而不会去调用Object上原型toString方法（返回对象的具体类型），
所以采用obj.toString()不能得到其对象类型，只能将obj转换为字符串类型；因此，在想要得到对象的具体类型时，应该调用Object上原型toString方法。

我们可以验证一下，将数组的toString方法删除，看看会是什么结果：
```
var arr=[1,2,3];
console.log(Array.prototype.hasOwnProperty("toString"));//true
console.log(arr.toString());//1,2,3
delete Array.prototype.toString;//delete操作符可以删除实例属性
console.log(Array.prototype.hasOwnProperty("toString"));//false
console.log(arr.toString());//"[object Array]"
```
删除了Array的toString方法后，同样再采用arr.toString()方法调用时，不再有屏蔽Object原型方法的实例方法，
因此沿着原型链，arr最后调用了Object的toString方法，返回了和Object.prototype.toString.call(arr)相同的结果。


