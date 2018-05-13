## 构造函数的属性
首先看三个例子
1、函数内部使用this添加属性
  function Person(){
      this.name = 'Tom';
  }
2、直接在函数上添加属性
  function Person(){}
  Person.name = 'Tom';
3、在函数原型上添加属性
  function Person(){}
  Person.prototype.name = 'Tom'
  
>  
1. 是公有属性 
2. 是静态属性 //这是在函数对象上直接定义了 name 属性。 
3. 是原型共享属性  
//每个函数都会有一个 prototype 的属性（箭头函数除外）。 name 是放到原型属性上。
//每个用 new 调用生成的对象，都可以访问到它们构造函数原型上的 name 属性
对于第一种方式，因为 JS 里， 函数也是对象， 是 Function 的实例。这时候一般把 person 当作构造函数。
对于第二种方式，为什么可以直接在函数上增加属性呢？
其实Js里一切皆是对象，函数也是对象。
函数其实也有另一个写法就是 ：
用 Function 类直接创建函数的语法如下：
```
//var function_name = new function(arg1, arg2, ..., argN, function_body)
var Person = new function (name) {   
      this.name = name;
}('Tom');
//还可以这样定义它：
// var sayHi = new Function("sName", "sMessage", "alert(\"Hello \" + sName + sMessage);");
//虽然由于字符串的关系，这种形式写起来有些困难，但有助于理解函数只不过是一种引用类型，它们的行为与用 Function 类明确创建的函数行为是相同的。
var Person = new Function ('name', 'return name');  
console.log( Person('Tom') ); //Tom 
```
## JavaScript对象的创建方式
在JavaScript中，创建对象的方式包括两种：对象字面量和使用new表达式。
对象字面量是一种灵活方便的书写方式，例如：

var obj = {
    name:'Tom',
    fn:function(){
        alert(this.name);
    }
}
这种写法不需要定义构造函数，灵活一般开发过程中使用也很多。
但缺点是，每创建一个新的对象都需要写出完整的定义语句，不便于创建大量相同类型的对象，不利于使用继承等高级特性。

new表达式是配合构造函数使用的，例如new String('tom')，调用内置的String函数构造了一个字符串对象。
下面我们用构造函数的方式来重新创建一个实现同样功能的对象，首先是定义构造函数，然后是调用new表达式：

function Person(){
    this.name = 'tom';
    this.fn = function(){
        alert(this.name);
    }
}
var obj = new Person();
在使用new操作符来调用一个构造函数的时候，发生了什么呢？其实很简单，就发生了四件事：
```
var obj  = {};
obj.__proto__ = Person.prototype;
Person.call(obj);
return obj;
```
第一行，创建一个空对象obj。
第二行，将这个空对象的__proto__成员指向了构造函数对象的prototype成员对象，这是最关键的一步，具体细节将在下文描述。
第三行，将构造函数的作用域赋给新对象，因此CA函数中的this指向新对象obj，然后再调用Person函数。于是我们就给obj对象赋值了一个成员变量name，这个成员变量的值是'tom'。
第四行，返回新对象obj。当构造函数里包含返回语句时情况比较特殊，这种情况会在下文中说到。


## 正确定义JavaScript构造函数

不同于其它的主流编程语言，JavaScript的构造函数并不是作为类的一个特定方法存在的；
当任意一个普通函数用于创建一类对象时，它就被称作构造函数，或构造器。一个函数要作为一个真正意义上的构造函数，需要满足下列条件：

1、 在函数内部对新对象（this）的属性进行设置，通常是添加属性和方法。

2、 构造函数可以包含返回语句（不推荐），但返回值必须是this，或者其它非对象类型的值。

上文定义的构造函数Person就是一个标准的、简单的构造函数。
下面例子定义的函数Animal返回了一个对象，我们可以使用new表达式来调用它，该表达式可以正确返回一个对象：
	
function Animal(){
    var o = {
        name:'it is a Animal' 
    }
    return o;
}
var o1 = new Animal();
console.log(o1.name);//it is a Animal

但这种方式并不是值得推荐的方式，因为对象o1的原型是函数Animal内部定义的对象o的原型，也就是Object.prototype。
这种方式相当于执行了正常new表达式的前三步，而在第四步的时候返回了Animal函数的返回值。该方式同样不便于创建大量相同类型的对象，
不利于使用继承等高级特性，并且容易造成混乱，应该摒弃。

一个构造函数在某些情况下完全可以作为普通的功能函数来使用，这是JavaScript灵活性的一个体现。下例定义的Animal2就是一个“多用途”函数：

	
function Add(a, b){
    this.num = a + b;
    this.addFn = function(){
        alert(this.num);
    }
    return this.num;//此返回语句在Add作为构造函数时没有意义
}
var getAdd = new Add(2,3);
getAdd.addFn();//结果为5
alert(getAdd(2, 3)); //结果为5

该函数既可以用作构造函数来构造一个对象，也可以作为普通的函数来使用。用作普通函数时，它接收两个参数，并返回两者的相加的结果。
为了代码的可读性和可维护性，建议作为构造函数的函数不要掺杂除构造作用以外的代码；同样的，一般的功能函数也不要用作构造对象。

 
## 为什么要使用构造函数

根据上文的定义，在表面上看来，构造函数似乎只是对一个新创建的对象进行初始化，增加一些成员变量和方法；
然而构造函数的作用远不止这些。为了说明使用构造函数的意义，我们先来回顾一下前文提到的例子。
执行var obj = new Person();创建对象的时候，发生了四件事情：
var obj  = {};
obj.__proto__ = Person.prototype;
Person.call(obj);
return obj;

我们说最重要的是第二步，将新生成的对象的__prop__属性赋值为构造函数的prototype属性，
使得通过构造函数创建的所有对象可以共享相同的原型。这意味着同一个构造函数创建的所有对象都继承自一个相同的对象，
因此它们都是同一个类的对象。在JavaScript标准中，并没有__prop__这个属性，
不过它现在已经是一些主流的JavaScript执行环境默认的一个标准属性，用于指向构造函数的原型。
该属性是默认不可见的，而且在各执行环境中实现的细节不尽相同，例如IE浏览器中不存在该属性。
我们只要知道JavaScript对象内部存在指向构造函数原型的指针就可以了，这个指针是在调用new表达式的时候自动赋值的，
并且我们不应该去修改它。
在构造对象的四个步骤中，我们可以看到，除第二步以外，别的步骤我们无须借助new表达式去实现，
因此new表达式不仅仅是对这四个步骤的简化，也是要实现继承的必经之路。

## 容易混淆的地方

关于JavaScript的构造函数，有一个容易混淆的地方，那就是原型的constructor属性。在JavaScript中，
每一个函数都有默认的原型对象属性prototype，该对象默认包含了两个成员属性：constructor和__proto__。

按照面向对象的习惯性思维，我们说构造函数相当于“类”的定义，从而可能会认为constructor属性就是该类实际意义上的构造函数，
在new表达式创建一个对象的时候，会直接调用constructor来初始化对象，那就大错特错了。
new表达式执行的实际过程已经在上文中介绍过了（四个步骤），其中用于初始化对象的是第三步，
调用的初始化函数正是“类函数”本身，而不是constructor。如果没有考虑过这个问题，这一点可能不太好理解，
那就让我们举个例子来说明一下吧：
```
function Add(a, b){
    this.num = a + b;
    this.addFn = function(){
        alert(this.num);
    }
}
//我们定义一个函数来覆盖Add原型中的constructor，试图改变属性num的值
function fake(){
    this.num = 100;
}
Add.prototype.constructor = fake; //覆盖Add原型中的constructor
var getAdd = new Add(2,3);
getAdd.addFn();//结果仍然为5
```
上述代码手动改变了Add原型中的constructor函数，然而却没有对getAdd对象的创建产生实质的影响，可见在new表达式中，
起初始化对象作用的只能是构造函数本身。那么constructor属性的作用是什么呢？一般来说，我们可以使用constructor属性来测试对象的类型：
```
var myArray = [1,2,3];
(myArray.constructor == Array); // true
```
 
这招对于简单的对象是管用的，涉及到继承或者跨窗口等复杂情况时，可能就没那么灵光了：
	
function f() { this.foo = 1;}
function s() { this.bar = 2; }
s.prototype = new f(); // s继承自f
var son = new s(); // 用构造函数s创建一个子类对象
(son.constructor == s); // false
(son.constructor == f); // true

这样的结果可能跟你的预期不相一致，所以使用constructor属性的时候一定要小心，或者干脆不要用它。
这里实在是让人难以理解。

## JS构造函数内的方法与构造函数prototype属性上方法的对比

函数内的方法:使用函数内的方法我们可以 访问到函数内部的私有变量 ,如果我们通过构造函数 new 出来的对象
需要我们操作构造函数内部的私有变量的话,我们这个时候就要考虑使用函数内的方法.

prototype上的方法:当我们需要 通过一个函数创建大量的对象 ,并且这些对象还都有许多的方法的时候;
这时我们就要考虑在函数的 prototype 上添加这些方法.这种情况下我们代码的 内存占用 就比较小.

在实际的应用中,这两种方法往往是结合使用的;所以我们要首先了解我们需要的是什么,然后再去选择如何使用.

我们还是根据下面的代码来说明一下这些要点吧,下面是代码部分 :
```
// 构造函数A
function A(name) {
    this.name = name || 'a';
    this.sayHello = function() {
        console.log('Hello, my name is: ' + this.name);
    }
}

// 构造函数B
function B(name) {
    this.name = name || 'b';
}
B.prototype.sayHello = function() {
    console.log('Hello, my name is: ' + this.name);
};

var a1 = new A('a1');
var a2 = new A('a2');
a1.sayHello();
a2.sayHello();

var b1 = new B('b1');
var b2 = new B('b2');
b1.sayHello();
b2.sayHello();
```
我们首先写了两个构造函数,第一个是 A ,这个构造函数里面包含了一个方法 sayHello ;
第二个是构造函数 B ,我们把那个方法 sayHello 写在了构造函数 B 的 prototype 属性上面.
需要指出的是,通过这两个构造函数 new 出来的对象具有一样的属性和方法,但是它们的区别我们可以通过下面的一个图来说明:

我们通过使用构造函数 A 创建了两个对象,分别是 a1 , a2 ;
通过构造函数 B 创建了两个对象 b1 , b2 ;
我们可以发现 b1 , b2 这两个对象的那个 sayHello 方法都是指向了它们的构造函数的 prototype 属性的 sayHello 方法.
而 a1 , a2 都是在自己内部定义了这个方法.

定义在构造函数内部的方法,会在它的每一个实例上都克隆这个方法;
定义在构造函数的 prototype 属性上的方法会让它的所有示例都共享这个方法,但是不会在每个实例的内部重新定义这个方法 .
如果我们的应用需要创建很多新的对象,并且这些对象还有许多的方法,
为了节省内存,我们建议把这些方法都定义在构造函数的 prototype 属性上. 
当然,在某些情况下,我们需要将某些方法定义在构造函数中,这种情况一般是因为我们需要访问构造函数内部的私有变量 .

下面我们举一个两者结合的例子,代码如下:
```
function Person(name, family) {
    this.name = name;
    this.family = family;
    var records = [{type: "in", amount: 0}];
    this.addTransaction = function(trans) {
        if(trans.hasOwnProperty("type") && trans.hasOwnProperty("amount")) {
           records.push(trans);
        }
    }
    this.balance = function() {
       var total = 0;
       records.forEach(function(record) {
           if(record.type === "in") {
             total += record.amount;
           }
           else {
             total -= record.amount;
           }
       });
        return total;
    };
};

Person.prototype.getFull = function() {
    return this.name + " " + this.family;
};
Person.prototype.getProfile = function() {
     return this.getFull() + ", total balance: " + this.balance();
};
```

在上面的代码中,我们定义了一个 Person 构造函数;这个函数有一个内部的私有变量 records ,
这个变量我们是不希望通过函数内部以外的方法去操作这个变量,所以我们把操作这个变量的方法都写在了函数的内部.
而把一些可以公开的方法写在了 Person 的 prototype 属性上,比如方法 getFull 和 getProfile .

把方法写在构造函数的内部,增加了通过构造函数初始化一个对象的成本,把方法写在 prototype属性上就有效的减少了这种成本.
你也许会觉得,调用对象上的方法要比调用它的原型链上的方法快得多,其实并不是这样的,如果你的那个对象上面不是有很多的原型的话,
它们的速度其实是差不多的。另外,需要注意的一些地方:
> 首先如果是在函数的 prototype 属性上定义方法的话,要牢记一点,如果你改变某个方法,
那么由这个构造函数产生的所有对象的那个方法都会被改变.还有一点就是变量提升的问题,我们可以稍微的看一下下面的代码:

```
func1(); // 这里会报错,因为在函数执行的时候,func1还没有被赋值. error: func1 is not a function
var func1 = function() {
    console.log('func1');
};

func2(); // 这个会被正确执行,因为函数的声明会被提升.
function func2() {
    console.log('func2');
}
```
关于对象序列化的问题.定义在函数的 prototype 上的属性不会被序列化,可以看下面的代码:
```
function A(name) {
    this.name = name;
}
A.prototype.sayWhat = 'say what...';

var a = new A('dreamapple');
console.log(JSON.stringify(a));//{"name":"dreamapple"}
```



