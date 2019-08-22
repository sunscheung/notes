## 一、$scope概念及用法
　 $scope作用域是一个指向应用模型的对象。作用域有层次结构，有根作用域，多个子作用域，位置不同，作用不同。
   $scope作用域能监控表达式和传递事件。
   应用在 HTML (视图) 和 JavaScript (控制器)之间的纽带。
     ![image](https://images2015.cnblogs.com/blog/1086600/201702/1086600-20170216160615582-173035640.jpg)
   
   ```
        var too="test";
        if(true){//这是在块中的定义，此时还是全局变量
            var too="new test";
        }
        alert(too=="new test");//return true;
        function test(){
            var too="old test";//这是在函数中的定义，此时是局部变量
        }
        test（）；
        alert(too=="new test");//return true;too并没有改变
```
这里说明，全局变量可以在方法，或者闭包内引入，而局部变量只能在定义的方法内使用，其他方法引用不到，angular作用域跟变量性质相似。
接下来看angular全局作用域和局部作用域区别用法：
angular中的$scope作用域可以根据需求，定义成一个变量或者是一个对象。
```
   myApp.controller('myAppCtrl', function($scope){
        //定义成变量
        $scope.book = "Angular开发指南";
        //定义成对象
        $scope.book ={
            name :'',
            author:'',
            pubTime:''
        }
    })
```
### 全局作用域：
```
var myApp = angular.module('myApp', []);
    /*
     *run方法用于初始化全局的数据，仅对全局作用域起作用。
     *这里的run方法只会在angular启动的时候运行一次。
     */
    myApp.run(function($rootScope){
        $rootScope.people ={
            name:'小明',
            age:'12',
            tel:'12233333333'
        };    
    });
```
全局作用域是各个 controller 中 scope 的桥梁。
用 rootscope 定义的值，可以在各个 controller 中使用。经常用于的场景在多个页面切换，数据随时绑定。
（若是把数据绑定在$scope局部作用域是行不通的）。

### 局部作用域：
```
    myApp.controller('myAppCtrl', function($scope){
        $scope.book ={
            name :'',
            author:'',
            pubTime:''
        }
    })

    myApp.controller('myAppCtrl1',function($scope,$rootScope){
        console.log($scope.book.name);//undefined
        console.log($rootScope.people.name)  //小明                           
    })
```
## 二、$scope(作用域)特点

1. $scope提供了一些工具方法$watch()、$apply()
>  $watch()用于监听模型变化,当模型发生变化，它会提示你的。
   表达式： $watch(watchExpression, listener, objectEquality);
   其参数：
   watchExpression：监听的对象，它可以是一个angular表达式如'name',或函数如function(){return $scope.name}。
   listener:当watchExpression变化时会被调用的函数或者表达式,
   它接收3个参数：newValue(新值), oldValue(旧值), scope(作用域的引用)。
   objectEquality：是否深度监听，如果设置为true,它告诉Angular检查所监控的对象中每一个属性的变化. 
   如果你希望监控数组的个别元素或者对象的属性而不是一个普通的值, 那么你应该使用它。
举例说明：
```
      $scope.name = 'hello';
      var watch = $scope.$watch('name',function(newValue,oldValue, scope){
        console.log(newValue);
        console.log(oldValue);
      });
      $timeout(function(){
        $scope.name = "world";
      },1000);
```  
     $apply()用于传播模型的变化。
     AngularJS 外部的控制器（DOM 事件、外部的回调函数如 jQuery UI 空间等）调用了AngularJS 函数之后，必须调用$apply。 
 ```
      myApp.controller('myAppCtrl', function($scope){
         $scope.user = '';  
         $scope.test = function() {  
             setTimeout(function () {  
                 $scope.user = "hello";  
             }, 2000);  
         }  
         $scope.test1 = function() {  
              $scope.user = 'world';  
         }    
         $scope.test1();  
         $scope.test();  
         console.log($scope.user); 
    })
```
> 上例解释：
     正常理解是：在后台显示world，2秒后，会变成hello。
     实际情况是：在后台显示world，2秒后，不会成hello。
怎么才能让user自动变化呢？修改一下。

```
$scope.test = function() {  
    setTimeout(function () {  
        $scope.$apply(function () {  
            $scope.user = "hello";  
        });  
    }, 2000);  
}  
```
这样就可以了。。。。。。

2. $scope可以为一个对象传播事件，类似DOM事件。举例说明：
```
<!DOCTYPE html>
<html lang="en" ng-app="myApp">
<head>
    <meta charset="UTF-8">
    <title>demo</title>
    <script src="dist/angular-1.3.0.14/angular.js"></script>
</head>
<body>
    <div class="form" ng-controller="myAppCtrl">
        <input type="button" value="提交" ng-click="submit()">
    </div>

    <script type="text/javascript">
        var myApp = angular.module('myApp', []);

        myApp.controller('myAppCtrl',function($scope){

            $scope.submit = function(){
                alert("提交成功！");
            }
        })
    </script>
</body>
</html>
```
3. $scope不仅是MVC的基础，也是实现双向数据绑定的基础。作用域提供表达式执行上下文，比如说表达式{{username}}本身是无意义的。
要与作用域$scope指定的username属性中才有意义。
举个栗子：
```
<!DOCTYPE html>
<html lang="en" ng-app="myApp">
<head>
    <meta charset="UTF-8">
    <title>demo</title>
    <script src="dist/angular-1.3.0.14/angular.js"></script>
</head>
<body>
    <div class="form" ng-controller="myAppCtrl">
        <input type="text" name="username" ng-model="username">{{username}}
        <input type="button" value="提交" ng-click="submit()">
    </div>

    <script type="text/javascript">
        var myApp = angular.module('myApp', []);

        myApp.controller('myAppCtrl',function($scope){

            $scope.username = '小明同学';

            $scope.submit = function(){
                alert("提交成功！");
            }
        })
    </script>
</body>
</html>
```
其他几点就不一一举例说明了，做些实例应该就会理解了。

4. $scope是一个POJO(Plain Old JavaScript Object)。

5. $scope是一个树型结构，与DOM标签平行。

6. 子$scope对象会继承父$scope上的属性和方法。

## 三、$scope(作用域)的作用。

　在特点部分中，也明显的看出来它的作用是怎样的了，下面总结一下它的作用：
   1. 提供了观察者可以监听数据模型的变化
   2. 可以将数据模型的变化通知给整个 App
   3. 可以进行嵌套,隔离业务功能和数据
   4. 给表达式提供上下文执行环境

 

## 四、$scope(作用域)的生命周期。
![image](https://images2015.cnblogs.com/blog/1086600/201702/1086600-20170216173908613-1397538935.png)
1. 创建 - 更作用域会在应用启动时通过注入器创建并注入。在模板连接阶段，一些指令会创建自己的作用域。
2. 注册观察者 - 在模板连接阶段，将会注册作用域的监听器。这也监听器被用来识别模型状态改变并更新视图。
3. 模型状态改变 - 更新模型状态必须发生在scope.$apply方法中才会被观察到。Angular框架封装了$apply过程，无需我们操心。
4. 观察模型状态 - 在$apply结束阶段，angular会从根作用域执行$digest过程并扩散到子作用域。
在这个过程中被观察的表达式或方法会检查模型状态是否变更及执行更新。
5. 销毁作用域 - 当不再需要子作用域时，通过scope.$destroy()销毁作用域，回收资源。
 
