# css规范
## id和class的命名
ID和class的名称总是使用可以反应元素目的和用途的名称，或其他通用的名称，代替表象和晦涩难懂的名称
不推荐 :
```
.fw-800 {
  font-weight: 800;
}
.red {
  color: red;
}
```
推荐 :
```
.heavy {
  font-weight: 800;
}
 
.important {
  color: red;
}
```
## 合理的使用ID
一般情况下ID不应该被用于样式，并且ID的权重很高，所以不使用ID解决样式的问题，而是使用class

不推荐：
```
#content .title {
  font-size: 2em;
}
```
推荐：
```
.content .title {
  font-size: 2em;
}
```
>这里之所以不建议这样使用，是因为ID的优先级比较高，
在样式处理上会导致后续引入的样式或者其他样式文件的使用失效，

## css选择器中避免使用标签名
从结构、表现、行为分离的原则来看，应该尽量避免css中出现HTML标签，并且在css选择器中出现标签名会存在潜在的问题。

## 使用子选择器
很多前端开发人员写选择器链的时候不使用 直接子选择器（注：直接子选择器和后代选择器的区别）。
有时，这可能会导致疼痛的设计问题并且有时候可能会很耗性能。
然而，在任何情况下，这是一个非常不好的做法。
如果你不写很通用的，需要匹配到DOM末端的选择器， 你应该总是考虑直接子选择器。

不推荐:
```
.content .title {
  font-size: 2rem;
}
```
推荐：
```
.content > .title {
  font-size: 2rem;
}
```
## 尽量使用缩写属性
尽量使用缩写属性对于代码效率和可读性是很有用的，比如font属性。

不推荐：
```
border-top-style: none;
font-family: palatino, georgia, serif;
font-size: 100%;
line-height: 1.6;
padding-bottom: 2em;
padding-left: 1em;
padding-right: 1em;
padding-top: 0;
```
推荐：
```
border-top: 0;
font: 100%/1.6 palatino, georgia, serif;
padding: 0 1em 2em;
```
>注意：0后面不带单位

## 属性格式
1. 为了保证一致性和可扩展性，每个声明应该用分号结束，每个声明换行。
2. 属性名的冒号后使用一个空格。出于一致性的原因，
3. 属性和值（但属性和冒号之间没有空格）的之间始终使用一个空格。
4. 每个选择器和属性声明总是使用新的一行。
5. 属性选择器或属性值用双引号（””），而不是单引号（”）括起来。
6. URI值（url()）不要使用引号。

作为最佳实践，我们应该遵循以下顺序（应该按照下表的顺序）：

结构性属性：
 1. display
 2. position, left, top, right etc.
 3. overflow, float, clear etc.
 4. margin, padding

表现性属性：
  1. background, border etc.
  2. font, text

不推荐：
```
.box {
  font-family: 'Arial', sans-serif;
  border: 3px solid #ddd;
  left: 30%;
  position: absolute;
  text-transform: uppercase;
  background-color: #eee;
  right: 30%;
  isplay: block;
  font-size: 1.5rem;
  overflow: hidden;
  padding: 1em;
  margin: 1em;
}
```
推荐：
```
.box {
  display: block;
  position: absolute;
  left: 30%;
  right: 30%;
  overflow: hidden;
  margin: 1em;
  padding: 1em;
  background-color: #eee;
  border: 3px solid #ddd;
  font-family: 'Arial', sans-serif;
  font-size: 1.5rem;
  text-transform: uppercase;
}
```

相关文章：

[前端编码规范](http://www.css88.com/archives/5505)
[JavsScript开发规范](http://www.cnblogs.com/polk6/p/4660195.html) 
[开发规范（四）JS规范](https://segmentfault.com/a/1190000006131512)


[来源](http://cherryblog.site/developing-guideline.html)