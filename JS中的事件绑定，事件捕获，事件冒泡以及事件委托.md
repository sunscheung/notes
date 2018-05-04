> 事件分为三个阶段：   事件捕获 -->  事件目标 -->  事件冒泡
 
> 事件捕获：事件发生时（onclick,onmouseover……）首先发生在document上，然后依次传递给body、&hellip;&hellip;最后到达目的节点（即事件目标）。
> 事件冒泡：事件到达事件目标之后不会结束，会逐层向上冒泡，直至document对象，跟事件捕获相反
 
1. onlick -->事件冒泡，重写onlick会覆盖之前属性，没有兼容性问题
   ```ele.onclik = null;   //解绑单击事件，将onlick属性设为null即可```
2. addEventListener(event.type, handle, boolean); IE8及以下不支持，属于DOM2级的方法，可添加多个方法不被覆盖
```
//事件类型没有on，false 表示在事件第三阶段（冒泡）触发，true表示在事件第一阶段（捕获）触发。 
//如果handle是同一个方法，只执行一次。
ele.addEventListener('click', function(){ }, false);  
//解绑事件，参数和绑定一样
ele.removeEventListener(event.type, handle, boolean);
```
3. attachEvent(event.type, handle ); IE特有，兼容IE8及以下，可添加多个事件处理程序，只支持冒泡阶段
```
//如果handle是同一个方法，绑定几次执行几次，这点和addEventListener不同,事件类型要加on,例如onclick而不是click
ele.attachEvent('onclick', function(){ }); 
//解绑事件，参数和绑定一样
ele.detachEvent("onclick", function(){ });
```
4. 默认事件行为：href=""链接，submit表单提交等

　> 阻止默认事件：

（1）return false; 阻止独享属性（通过on这种方式）绑定的事件的默认事件
```
ele.onclick = function() {
    ……                         //你的代码
    return false;              //通过返回false值阻止默认事件行为
};
```
（2）event.preventDefault( ); 阻止通过 addEventListener( ) 添加的事件的默认事件
```
element.addEventListener("click", function(e){
    var event = e || window.event;
    ……
    event.preventDefault( );      //阻止默认事件
},false);
```
（3）event.returnValue = false; 阻止通过 attachEvent( ) 添加的事件的默认事件
```
element.attachEvent("onclick", function(e){
    var event = e || window.event;
    ……
    event.returnValue = false;       //阻止默认事件
},false);
```
5. 接下来我们把事件绑定以及事件解绑封装成为一个函数，兼容浏览器，包括IE6及以上
```
// 事件绑定
function addEvent(element, eType, handle, bol) {
    if(element.addEventListener){           //如果支持addEventListener
        element.addEventListener(eType, handle, bol);
    }else if(element.attachEvent){          //如果支持attachEvent
        element.attachEvent("on"+eType, handle);
    }else{                                  //否则使用兼容的onclick绑定
        element["on"+eType] = handle;
    }
}
 
// 事件解绑
function removeEvent(element, eType, handle, bol) {
    if(element.addEventListener){
        element.removeEventListener(eType, handle, bol);
    }else if(element.attachEvent){
        element.detachEvent("on"+eType, handle);
    }else{
        element["on"+eType] = null;
    }
}
```
------------------------------------------------------------------------------------------------------- 
> A.● 事件冒泡、事件捕获阻止：
event.stopPropagation( );                // 阻止事件的进一步传播，包括（冒泡，捕获），无参数
event.cancelBubble = true;             // true 为阻止冒泡
 
> B.● 事件委托：利用事件冒泡的特性，将里层的事件委托给外层事件，根据event对象的属性进行事件委托，改善性能。
使用事件委托能够避免对特定的每个节点添加事件监听器；事件监听器是被添加到它们的父元素上。事件监听器会分析从子元素冒泡上来的事件，找到是哪个子元素的事件。
 
来个例子吧，如果要单独点击table里面的td，普通做法是for循环给每个td绑定事件，td少的话性能什么差别，td如果多了，就不行了，我们使用事件委托:
```
 <!-- HTML -->
<table id="out" border="1" style="cursor: pointer;">
    <tr>
    　　<td>table01</td>
    　　<td>table02</td>
    　　<td>table03</td>
    　　<td>table04</td>
    　　<td>table05</td>
    　　<td>table06</td>
    　　<td>table07</td>
    　　<td>table08</td>
    　　<td>table09</td>
    　　<td>table10</td>
    </tr>
</table>
```
```
var out = document.getElementById("out");
    if(out.addEventListener){
        out.addEventListener("click",function(e){
            var e = e||window.event;
            //IE没有e.target，有e.srcElement
            var target = e.target||e.srcElement;
            //判断事件目标是否是td，是的话target即为目标节点td
            if(target.tagName.toLowerCase()=="td"){
                changeStyle(target);
                console.log(target.innerHTML);
            }
        },false);
    }else{
        out.attachEvent("onclick",function(e){
            var e = e||window.event;
            //IE没有e.target，有e.srcElement
            var target = e.target||e.srcElement;
            //判断事件目标是否是td，是的话target即为目标节点td
            if(target.tagName.toLowerCase()=="td"){
                changeStyle(target);
                console.log(target.innerHTML);
            }
        });
    };
};
function changeStyle(ele){
    ele.innerHTML = "已点击"
    ele.style.background="#900";
    ele.style.color = "#fff"; 
}
```

来自：http://www.cnblogs.com/zhangmingze/p/4864367.html
