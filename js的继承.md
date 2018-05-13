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

对于第二种方式，为什么可以直接在函数上增加属性呢？
其实Js里一切皆是对象，函数也是对象。

函数其实也有另一个写法就是 ：
用 Function 类直接创建函数的语法如下：
//var function_name = new function(arg1, arg2, ..., argN, function_body)
var Person = new function (name) {   
      this.name = name;
}('Tom');
还可以这样定义它：
// var sayHi = new Function("sName", "sMessage", "alert(\"Hello \" + sName + sMessage);");
//虽然由于字符串的关系，这种形式写起来有些困难，但有助于理解函数只不过是一种引用类型，它们的行为与用 Function 类明确创建的函数行为是相同的。
var Person = new Function ('name', 'return name');  
console.log( Person('Tom') ); //Tom 
