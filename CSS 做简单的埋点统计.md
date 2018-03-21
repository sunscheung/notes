> 当一个网站或者 App 的规模达到一定程度，需要分析用户在 App 或者网站的相应操作，则需要埋点统计用户行为，这个不用多说，具体实现有 JS 脚本写好埋点事件并调接口，今天 get 到一种新的埋点统计方式保证耳目一新。下面代码简单示范一下。
//index.html
```
<!DOCTYPE html>
<html>
    <head lang="en">
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no" />
        <title>CSS埋点</title>
        <style>
            .background {
                background-size: 100% 100%;
                width: 100%;
                height: 100%;
                position: fixed;
                z-index: -100;
            } 
            .link:active::after{
                margin: 100px 100px;
                color: red;
                content: url("http://127.0.0.1/web/count.php?action=visit");
            }
        </style>
    </head> 
    <body> 
        <div style="" class="body-content">
            <div class="background"> 
            </div> 
            <div class="notice-content">
                <label class="title">以下是埋点</label>  
                <a class="link title">访问()</a>
        </div>
    </body>
</html>
```
//count.php
```
<?php  
    $actionName =  $_REQUEST["action"]; 
    //时间格式化
    $time = time();
    $time = Date("Y-m-d",$time); 
    echo "访问动作->" .$actionName. " 访问时间->" . $time;
?>
```
