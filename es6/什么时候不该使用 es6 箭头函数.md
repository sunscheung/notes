> 原文链接：[segmentfault.com](https://segmentfault.com/a/1190000007074846)

从开始接触es6到在项目中使用已经有一段时间了，es6有很多优秀的新特性，其中最有价值的特性之一就是箭头函数，他简洁的语法以及更好理解的this值都非常的吸引我。但是新事物也是有两面性的，箭头函数有他的便捷有他的优点，但是他也有缺点，他的优点是代码简洁，this提前定义，但他的缺点也是这些，比如代码太过简洁，导致不好阅读，this提前定义，导致无法使用js进行一些es5里面看起来非常正常的操作。针对这些缺点，下面我就总结一下什么情况下不该使用箭头函数。
## 1. 在对象上定义函数

先来看下面这段代码

```
var obj = {  
    array: [1, 2, 3],
    sum: () => {
        console.log(this === window); // => true
        return this.array.reduce((result, item) => result + item);
    }
};
// Throws "TypeError: Cannot read property 'reduce' of undefined"
obj.sum();  
```

sum方法定义在obj对象上，当调用的时候我们发现抛出了一个TypeError，因为函数中的this是window对象，所以this.array也就是undefined。原因也很简单，相信只要了解过es6 箭头函数的都知道

    箭头函数没有它自己的this值，箭头函数内的this值继承自外围作用域

解决方法也很简单，就是不用呗。这里可以用es6里函数表达式的简洁语法，在这种情况下，this值就取决于函数的调用方式了。

```
var obj = {  
    array: [1, 2, 3],
    sum() {
        console.log(this === obj); // => true
        return this.array.reduce((result, item) => result + item);
    }
};

obj.sum(); // => 6  
```

    通过object.method()语法调用的方法使用非箭头函数定义，这些函数需要从调用者的作用域中获取一个有意义的this值。

## 2. 在原型上定义函数

在对象原型上定义函数也是遵循着一样的规则

function Person (pName) {
    this.pName = pName;
}

Person.prototype.sayName = () => {
    console.log(this === window); // => true
    return this.pName;
}

var person = new Person('wdg');

person.sayName(); // => undefined

使用function函数表达式

```
function Person (pName) {
    this.pName = pName;
}
Person.prototype.sayName = function () {
    console.log(this === person); // => true
    return this.pName;
}
var person = new Person('wdg');
person.sayName(); // => wdg
```

所以给对象原型挂载方法时，使用function函数表达式
## 3. 动态上下文中的回调函数

this是js中非常强大的特点，他让函数可以根据其调用方式动态的改变上下文，然后箭头函数直接在声明时就绑定了this对象，所以不再是动态的。
在客户端，在dom元素上绑定事件监听函数是非常普遍的行为，在dom事件被触发时，回调函数中的this指向该dom,可当我们使用箭头函数时:

```
var button = document.getElementById('myButton');  
button.addEventListener('click', () => {  
    console.log(this === window); // => true
    this.innerHTML = 'Clicked button';
});
```

因为这个回调的箭头函数是在全局上下文中被定义的，所以他的this是window。所以当this是由目标对象决定时，我们应该使用函数表达式:

```
var button = document.getElementById('myButton');  
button.addEventListener('click', function() {  
    console.log(this === button); // => true
    this.innerHTML = 'Clicked button';
});
```

## 4. 构造函数中

在构造函数中，this指向新创建的对象实例
`
this instanceOf MyFunction === true`

需要注意的是，构造函数不能使用箭头函数，如果这样做会抛出异常

```
var Person = (name) => {
    this.name = name;
}

// Uncaught TypeError: Person is not a constructor
var person = new Person('wdg');
```

理论上来说也是不能这么做的，因为箭头函数在创建时this对象就绑定了，更不会指向对象实例。

## 5. 太简短的（难以理解）函数

箭头函数可以让语句写的非常的简洁，但是一个真实的项目，一般由多个开发者共同协作完成，就算由单人完成，后期也并不一定是同一个人维护，箭头函数有时候并不会让人很好的理解，比如

```
let multiply = (a, b) => b === undefined ? b => a * b : a * b;

let double = multiply(2);

double(3); // => 6

multiply(2, 3); // =>6
```

这个函数的作用就是当只有一个参数a时，返回接受一个参数b返回a*b的函数，接收两个参数时直接返回乘积，这个函数可以很好的工作并且看起很简洁，但是从第一眼看去并不是很好理解。
为了让这个函数更好的让人理解，我们可以为这个箭头函数加一对花括号，并加上return语句，或者直接使用函数表达式:

```
function multiply(a, b) {
    if (b === undefined) {
        return function (b) {
            return a * b;
        }
    }
    return a * b;
}

let double = multiply(2);

double(3); // => 6
multiply(2, 3)； // => 6
```

## 总结

毫无疑问，箭头函数带来了很多便利。恰当的使用箭头函数可以让我们避免使用早期的.bind()函数或者需要固定上下文的地方并且让代码更加简洁。
箭头函数也有一些不便利的地方。我们在需要动态上下文的地方不能使用箭头函数:定义需要动态上下文的函数，构造函数，需要this对象作为目标的回调函数以及用箭头函数难以理解的语句。在其他情况下，请尽情的使用箭头函数。
