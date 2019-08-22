
箭头函数表达式的语法比函数表达式更短，并且不绑定自己的this，arguments，super或 new.target。
这些函数表达式最适合用于非方法函数，并且它们不能用作构造函数。
关于this指向问题这篇博文说的不错：[https://blog.csdn.net/u013344815/article/details/73184928]
这篇博文一步一步讲解如下：
```
var obj={  
    fn:function(){  
        console.log(this);  
    }  
}  
obj.fn();//object  
```
以上这段代码是再浅显不过的this指向问题，也就是谁调用的函数，函数体中的this就指向谁
再看下面这段
```
var obj={  
    fn:function(){  
        setTimeout(function(){  
            console.log(this);  
        });  
    }  
}  
obj.fn();//window  
```
这次this指向了最外层的window对象，为什么呢，还是那个道理，这次this出现在全局函数setTImeout()中的匿名函数里，并没有某个对象进行显示调用，所以this指向window对象
假如我们在这里使用箭头函数呢
```
var obj={  
    fn:function(){  
        setTimeout(() => {  
            console.log(this);  
        });  
    }  
}  
obj.fn();//object  
```
this又指向函数的宿主对象了
为了更加清楚的对比一般函数和箭头函数this指向的区别，我们给对象添加变量
```
var obj={  
    num:3,  
    fn:function(){  
        setTimeout(function(){  
            console.log(this.num);  
        });  
    }  
}  
obj.fn();//undefined  
//............................................................  
var obj1={  
    num:4,  
    fn:function(){  
        setTimeout(() => {  
            console.log(this.num);  
        });  
    }  
}  
obj1.fn();//4 
```
如上代码，在没有使用箭头函数的情况下，this指向了window（匿名函数，没有调用的宿主对象），而window对象并没有num属性（num属性在obj中定义），而在使用箭头函数的情况下，this的指向却对象obj1，自然可以输出obj1中定义的属性num。
接下来看更复杂的情况

多层嵌套的箭头函数
```
var obj1={  
    num:4,  
    fn:function(){  
        var f=() => {    //object，也就是指obj1  
            console.log(this);  
            setTimeout(() => {  
                console.log(this);// //object，也就是指obj1  
            });  
        }  
        f();  
    }  
}  
obj1.fn();  
```
假如我们改动两层箭头函数的其中一处，看会出现什么结果
```
var obj1={  
    num:4,  
    fn:function(){  
        var f=function(){      
            console.log(this); //window,因为函数f定义后并没有对象调用，this直接绑定到最外层的window对象  
            setTimeout(() => {  
                console.log(this);//window，外层this绑定到了window,内层也相当于定义在window层（全局环境）  
            });  
        }  
        f();  
    }  
}  
obj1.fn();  
```
好，接下来改变另一处
```
var obj1={  
    num:4,  
    fn:function(){  
        var f=() => {      
            console.log(this); //object,f()定义在obj1对象中，this就指向obj1,这就是箭头函数this指向的关键  
            setTimeout(function() {  
                console.log(this);//window，非箭头函数的情况下还是要看宿主对象是谁，如果没有被对象调用，函数体中的this就绑定的window上  
            });  
        }  
        f();  
    }  
}  
obj1.fn();  
```
总结：
1.箭头函数的this绑定看的是this所在的函数定义在哪个对象下，绑定到哪个对象则this就指向哪个对象

2.如果有对象嵌套的情况，则this绑定到最近的一层对象上

