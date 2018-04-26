
## 脏数据检查 != 轮询检查更新
谈起angular的脏检查机制(dirty-checking), 常见的误解就是认为： ng是定时轮询去检查model是否变更。
其实，ng只有在指定事件触发后，才进入$digest cycle：

DOM事件，譬如用户输入文本，点击按钮等。(ng-click)
XHR响应事件 ($http)
浏览器Location变更事件 ($location)
Timer事件($timeout, $interval)
执行$digest()或$apply()

![run](https://github.com/sunscheung/notes/blob/master/imgs/o_concepts-runtime.png)

> 参考《mastering web application development with angularjs》 P294

## $digest后批量更新UI
传统的JS MVC框架, 数据变更是通过setter去触发事件，然后立即更新UI。
而angular则是进入$digest cycle，等待所有model都稳定后，才批量一次性更新UI。
这种机制能减少浏览器repaint次数，从而提高性能。
> 参考《mastering web application development with angularjs》 P296
另, 推荐阅读: [构建自己的AngularJS，第一部分：Scope和Digest](http://angularjs.cn/A0lr)

## 提速 $digest cycle
关键点
尽少的触发$digest (P310)
尽快的执行$digest
优化$watch
$scope.$watch(watchExpression, modelChangeCallback), watchExpression可以是String或Function。
避免watchExpression中执行耗时操作，因为它在每次$digest都会执行1~2次。
避免watchExpression中操作dom，因为它很耗时。
console.log也很耗时，记得发布时干掉它。（用grunt groundskeeper）
ng-if vs ng-show， 前者会移除DOM和对应的watch
及时移除不必要的$watch。（angular自动生成的可以通过下文介绍的bindonce）
> 参考《mastering web application development with angularjs》 P303~309
```
var unwatch = $scope.$watch("someKey", function(newValue, oldValue){
  //do sth...
  if(someCondition){
    //当不需要的时候,及时移除watch
    unwatch();
  }
});
```
避免深度watch， 即第三个参数为tru
> 参考《mastering web application development with angularjs》 P313

