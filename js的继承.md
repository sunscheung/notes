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
  
> 1是公有属性 

> 2是静态属性 //这是在函数对象上直接定义了 name 属性。 

> 3是原型共享属性  
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



















