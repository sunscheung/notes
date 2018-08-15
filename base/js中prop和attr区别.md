# 从angularJs中的定义看
   attr特性的意思，而prop是属性的意思
## AngularJS 中特性(attr)和属性(prop)的区别
attr() 和 removeAttr() 方法是对特性进行处理的, 而 prop() 是对属性进行操作的 , 但是很多时候操作的东西是同一个 , 
    但是也是有区别的, 区别在于prop方法处理的是被 DOM API HTMLElement 对象所定义的属性, 而不是标记语言中的 HTML 元素所定义的特性 . 
    通常情况下 , 属性好特性是一样的 , 但并不是总是如此 , 比如对于 class 这个特性, 在 HTMLElement 对象中是用 className属性表示的 .
    一般情况下 , 推荐使用prop方法 , 因为他返回的对象与特性值相比更容易使用 .
## 在jquery中的使用
attr 是从页面搜索获得元素值，所以页面必须明确定义元素才能获取值，相对来说比较慢。 
如:
```
<input name='test' type='checkbox'> 
$('input:checkbox').attr('type'); 返回checkbox. 
$('input:checkbox').attr('checked'); 返回undefined。 
```
> 因为```<input name='test' type='checkbox'>```中没有checked关键字。

prop是从属性对象中取值，属性对象中有多少属性，就能获取多少值，不需要在页面中显示定义。 
比如 
``` $('input:checkbox').prop('checked'); 返回false。```
这里就会遇到个问题：如果是自定义的属性，那么属性对象中是没有这个属性的。所以prop返回undefined。但是页面中可以检索到这个属性，所以attr是可以获取的。

> attr获取的是初始化值，除非通过attr(‘name’,’value’)改变，否则值不变。prop属性值是动态的，比如checkbox，选中后，checked变为true，prop值也会发生改变。
## 总结
对于HTML元素本身就带有的固有属性，在处理时，使用prop方法。快速，准确。
对于HTML元素我们自己自定义的DOM属性，在处理时，使用attr方法。

    
