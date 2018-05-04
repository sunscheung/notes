> 视口：浏览器窗口内的内容区域，不包含工具栏，标签栏。网页实际显示. 
屏幕尺寸：设备物理显示区域
## 宽度和高度
```
 a、可视区的真实宽度和高度
      document.documentElement.clientWidth 
      document.documentElement.clientHeight

      都去掉滚动条的大小（一般是17像素），比如我的dell笔记本在chrome下，
      正常的可视区（即无滚动条）大小是1366*663，假如水平和垂直方向都有滚动条的话，这两个值
      的大小为 1349 * 646
  b、
     document.documentElement.offsetWidth   无滚动条 1366  有滚动条 1349 同a
     document.documentElement.offsetHeight  根据实际的html元素被撑开的大小

  c、
     window.innerWidth / window.innerHeight 
       （1）有滚动条 document.documentElement.clientWidth + 滚动条宽度
       （2）无滚动条 等于document.documentElement.clientWidth
            高度计算规则同宽度
 ```
 ## 响应式方法论
先针对小视口设计
然后逐步对大视口渐进增强
响应式设计中内容始终优先
流动布局、弹性图片和媒体查询：使用百分比布局创建流动的弹性界面，同时使用媒体查询来限制元素的变动范围。（平滑过渡）
## HTML5的时代
简化标签
语义化标签
CSS3(圆角，渐变…..)
> -webkit-,-moz-是各厂商发布正式版本之前，实验各自对css3新特性的实现 
## 业务需求和预算的考虑
客户是否想支持互联网用户增长最迅猛的市场？如果想，那响应式方法就很适合。
客户是否想要最简洁、快速，且易于维护的代码？如果想，那响应式方法就很适合。
客户能否理解用户体验可以且本应该根据浏览器不同而不同？如果可以理解，那响应式方法就很适合。
客户是否要求设计效果在所有浏览器中都保持一致，包括IE 8 以及更低版本？如果是，响应式设计就不适合。
该网站的当前或预期客户中，是否有百分之七十以上的人可能使用Internet Explorer 8或者更低版本？如果是，则响应式设计不适合。
在预算允许的情况下，一个完全定制的“移动”版网站比响应式设计更适合。
网站不必在所有浏览器中表现一致
### 客户->思维定式->说服引导（理由如下）

允许页面显示效果在老旧浏览器中有细微的差别，这样可以使代码更易维护，将来更新的成本也更低。
让页面元素在那些老旧浏览器（如Internet Explorer 8 及更低版本）中表现一致会导致网站增加大量的图片。这会使网站变慢，制作成本变高，而且更难维护。
现代浏览器可以理解的简洁代码等同于更快速的网站。快速响应的网站在搜索引擎中的评级高于慢腾腾的网站。
使用老旧浏览器的用户越来越少，使用现代浏览器的用户越来越多——我们应该支持大多数！
## 媒体查询
W3C规范审核：工作草案（Working Draft）->候选推荐标准（Candidate Recommendation）->提议推荐标准(Proposed 
Recommendation)->几年时间等待->W3C 推荐标准（REC) 
- CSS3 是由很多附加模块组合而成的。媒体查询就是其中的一个模块。 
- 媒体查询可以让我们根据设备显示器的特性为其设定CSS 样式。

## 媒体查询语法
### CSS 样式表中使用媒体查询
```
//在屏幕宽度小于等于400 像素的设备上，h1 元素的文字颜色就会变成绿色。
@media screen and (max-device-width: 400px) {
h1 { color: green }
}
//给视口最大宽度为360 像素的显示屏设备加载一个名为phone.css 的样式表。
@import url("phone.css") screen and (max-width:360px);
```
### 使用CSS 的@import 方式会增加HTTP 请求（这会影响加载速度）
### 通过标签的media 属性为样式表指定设备类型（如显示屏或打印机）。
```
非纵向放置的显示屏设备
<link rel="stylesheet" media="not screen and (orientation: portrait)" href="portraitscreen.
css" />
媒体查询列表：查询列表中的任意一个查询为真，则加载文件。
全部查询都不为真，则不加载。
<link rel="stylesheet" media="screen and (orientation: portrait) and (min-width:
800px), projection" href="800wide-portrait-screen.css" />
```
## 媒体主要特性
width：视口宽度。
height：视口高度。
device-width：渲染表面的宽度（对我们来说，就是设备屏幕的宽度）。
device-height：渲染表面的高度（对我们来说，就是设备屏幕的高度）。
orientation：检查设备处于横向还是纵向。
aspect-ratio：基于视口宽度和高度的宽高比。一个16∶9 比例的显示屏可以这样定义aspect-ratio: 16/9。
device-aspect-ratio：和aspect-ratio 类似，基于设备渲染平面宽度和高度的宽高比。
color：每种颜色的位数。例如min-color: 16 会检测设备是否拥有16 位颜色。
color-index：设备的颜色索引表中的颜色数。值必须是非负整数。
monochrome：检测单色帧缓冲区中每像素所使用的位数。值必须是非负整数，如monochrome: 2。
resolution：用来检测屏幕或打印机的分辨率，如min-resolution: 300dpi。还可以接受每厘米像素点数的度量值，如min-resolution: 118dpcm。
scan：电视机的扫描方式，值可设为progressive（逐行扫描）或interlace（隔行扫描）。如720p HD 电视（720p 的p 即表明是逐行扫描）匹配scan: progressive，而1080i HD 电视（1080i 中的i 表明是隔行扫描）匹配scan: interlace。
grid：用来检测输出设备是网格设备还是位图设备。
除scan 和grid 之外，都可使用min 和max 前缀来创建一个查询范围。
## 建议：
Respond.js让不支持css3 Media Query的浏览器包括IE6-IE8等其他浏览器支持查询。
CSS重置样式：normalize.css
## 保证图片尽可能精简（base64）
> 时刻谨记，我们要保证代码和数据都尽可能精简，以便为带宽有限的用户提供愉悦的体验。

## 阻止移动浏览器自动调整页面大小
iOS 和Android 浏览器都基于核心
```
//最常用写法
<meta name="viewport" content="width=device-width,initial-scale=1.0,user-scalable=no">
 width:可视区域的宽度，值可为数字或关键词device-width
 height:同width
 intial-scale:页面首次被显示是可视区域的缩放级别，取值1.0则页面按实际尺寸显示，无任何缩放
 maximum-scale=1.0, minimum-scale=1.0;可视区域的缩放级别，
maximum-scale用户可将页面放大的程序，1.0将禁止用户放大到实际尺寸之上。
 user-scalable:是否可对页面进行缩放，no 禁止缩放(很少用到)
```
## 针对不同视口宽度修正设计
平板设备（如iPad）增加媒体查询，竖直iPad 的视口 
宽度是768 像素
```
@media screen and (max-width: 768px) {
#wrapper {
width: 768px;
}
#header,#footer,#navigation {
width: 748px;
}
}
```
### 自适应布局缺点
> 页面捕捉到媒体查询设置的断点，然后布局发生变化。但在 
捕捉到下一个视口断点之前，页面静止不变 
它不能适应未来的变化。

## 响应式布局：固定布局->流动布局
> 伊桑·马科特提供一个简易可行的公式，将固定像素宽度转换对应的百分比宽度：（目标
元素宽度-边框宽度）÷上下文（父级）元素宽度=百分比宽度 注意上下文的对应关系，页面换行
显示（ul>li>a问题有可能是li的inline-block没有宽的原因，我们可以使用margin来控，因为宽度不是很灵活） 
```
#header {
margin-right: 10px;
margin-left: 10px;
width: 940px;
}
 
转换

#wrapper {
margin-right: auto;
margin-left: auto;
width: 96%; /* 控制最外层的div */
}

#header {
margin-right: 10px;
margin-left: 10px;
width: 97.9166667%; /* 940 ÷ 960 */
}
```
> 关于数字四舍五入，黄金分割率约为1:1.61803398874989怎么看它都不是一个简洁的数字，但是它非常重要。黄 
金分割率的测量都能做到如此精确，那我相信网页设计同样做得到。

## 用em(继承父级),rem（直接继承祖宗）替换px
### em指的是特定字母的宽度和高度相对于特定字体磅值的比例。 
- 现代浏览器的默认文字大小都是16 像素 
- 优点： 
- 使用Internet Explorer 6 的用户也将能够缩放文字 
- 以使我们设计师和开发者的生活更简单 

```
给body设置
font-size: 100%;
font-size: 16px;
font-size: 1em;
缺点：每次使用font-size时，都要需求字体大小px/16 = 字体大小 em
不过我推荐使用
font-size:62.5% 
 
#content h1 {
font-family: Arial, Helvetica, Verdana, sans-serif;
text-transform: uppercase;
font-size: 4.3125em; } /* 69 ÷ 16 */
#content h1 span {
display: block;
line-height: 1.052631579em; /* 40 ÷ 38 */
color: #757474;
font-size: .550724638em; /* 38 ÷ 69 */
}
```
### 行高的转换相对于其本身的文字大小而言

## 弹性图片
在现代浏览器（包括IE 7+）中要实现图片随着流动布局相应缩放非常简单。

### 为特定图片指定特定规则
```
img,object,video,embed {
方法一（利用重写和覆盖）：
max-width: 100%;
max-width: 45%;
方法二：
width:百分比显示
max-width: 202px;给弹性图片设置阈值
}
```
注意删除宽度和高度属性
缺点： 
要提前准备一张足够大的图片，以备大视口使用
带宽限制
## 限制页面无限制扩张
```
给最外层的div设置max-width 属性 
#wrapper {
margin-right: auto;
margin-left: auto;
width: 96%; /* Holding outermost DIV */
max-width: 1414px;
}
```
为不同的屏幕尺寸提供不同大小的图片
AdaptiveImages:图片自适应源码工具是一个基于PHP语言编写的图片自适应解决方案，
它首先利用一个轻量级的JS文件来探测浏览器的屏幕大小，然后将这个参数发送到服务器端的PHP脚本来对图片进行尺寸调整。 
实现 Adaptive Images 解决方案需要Apache 2、PHP 5.x 和GD 库，也就是说需要Web 服务器端编程。首先，在其网站上下载.zip 文件开始配置： 
### js被禁用的情况下依然有效 
1. 解压文件，然后将其中的adaptive-images.php 和.htaccess 文件拷贝到网站的根目录。如果你网站的根目录下已经
有一个.htaccess 文件了，不要覆盖它。参考下载包中的instructions.htm 文件看看怎么做合适。

接着在网站根目录下创建一个名为ai-cache 的文件夹。
然后把如下JavaScript 代码复制到每个需要自适应图片的网页的头部： 
h5版本
```
<script>document.cookie='resolution='+Math.max(screen.width,screen.height)+';
path=/';/script>
```
h5以下（添加type）
```
<script type="text/javascript">document.cookie='resolution='+Math.maxscreen.width,
screen.height)+'; path=/';</script>
```
切记这段JavaScript 代码要放在页面头部（最好作为第一个脚本），因为它需要在页面加载完成之前，而且要在发出图片请求之前运行。
```
<IfModule mod_rewrite.c>
Options +FollowSymlinks
RewriteEngine On
# Adaptive-Images ------------------------------------------------------
RewriteCond %{REQUEST_URI} andthewinnerisnt让网站根目录下名为andthewinnerisnt 的文件夹中的图片被缩放
# Send any GIF, JPG, or PNG request that IS NOT stored inside one of the above directories
# to adaptive-images.php so we can select appropriately sized versions
RewriteRule \.(?:jpe?g|gif|png)$ adaptive-images.php
# END Adaptive-Images --------------------------------------------------
</IfModule>
```
流动网格布局和媒体查询的默契配合
媒体查询约束流动布局的变动范围，而流动布局则简化了从一组媒体查询样式过渡到另一组的改变过程。

## HTML5（大家可以看我的另一篇文章）
腻子脚本（polyfill）这个词由Remy Sharp 提出，意指使用腻子来补平老版 
本浏览器的缺陷。因此，腻子脚本具体指的是一段能给老版本浏览器带来 
新特性的JavaScript 代码。

## HTML5 样板文件。样板文件是一个预先做好的融 
合了“最佳实践”HTML5 文件，包含一些基本样式（如之前提到过的 
normalize.css）、polyfill 和一些必要的工具如Modernizr。它还包含一个 
自动合并CSS 和JS 文件、自动删除注释以生成生产环境代码的构建工 
具。强烈推荐！

## HTML5 精简主义
各种脑残写法都可以被浏览器识别 
**没有结束标签的斜线，没有引号，大小写混杂。甚至，省略元素， 页面依然有效** 
```
<link href=CSS/main.css rel=stylesheet >
<div id=wrapper>
<img SRC=frontCarousel.png aLt=frontCarousel>
```
在编写HTML5 文档时我倾向于在老式编写风格（可读性和精简代码找到平衡）

<link href="CSS/main.css" rel="stylesheet"/>
## HTML5 标签嵌套多个 

```
<h2><a href="index.html">The home page</a></h2>
<p><a href="index.html">This paragraph also links to the home page</a></p>
<a href="index.html"><img src="home-image.png" alt="home-slice" /></a>
//Make change
<a href="index.html">
<h2>The home page</h2>
<p>This paragraph also links to the home page</p>
<img src="home-image.png" alt="home-slice" />
</a>
```
不能在一个标签中嵌套另一个标签，也不能在标签中嵌套表单。 
第一句不是很理解，什么意思？

## HTML5 弃其糟粕 

都能使用，不过最好不要用，拥抱未来 
- 暂保留 
- <img src="frontCarousel.png" alt="frontCarousel" border="0" /> 
- 非保留的strike、enter、font、acronym、frame 和frameset。

## HTML5 全新语义化元素(机器识别) 
```
字典中对语义学的定义是“关注语言本质含义的语言学和逻辑学分支学科”.
<section>元素用来定义文档或应用程序中的区域（或节）
<nav>用来定义文档的主导航区域
<article>元素用来包裹独立的内容片段
<aside>元素用来表示与页面主内容松散相关的内容
<hgroup>元素包裹使用
、
、
等标签的标题、标语和副标题
<aside>元素用来表示与页面主内容松散相关的内容 
<header>元素包含对区域内容的介绍说明（不计入大纲结构，不能用于划分内容结构。）
<footer>元素包含对区域内容的介绍说明（不计入大纲结构，不能用于划分内容结构。）
<address>元素用于明确地标注离其最近的< article >或< body >祖先元素的联系信息。 
``` 
## HTML5 的大纲结构
```
<hgroup>
    <h1>Ben's blog</h1>
    <h2>All about what I do</h2>
</hgroup>
<article>
    <header>
        <hgroup>
        <h1>A post about something</h1>
        <h2>Trust me this is a great read</h2>
        <h3>No, not really</h3>
        <p>See. Told you.</p>
        </hgroup>
    </header>
</article>
```
## HTML5 文本级语义元素  
```
<b>……一小段文本，纯粹为了吸引人的注意，除此之外不传达任何重要性，也不暗示其他语态或语气，
如文档摘要中的关键词、评论中的产品名称、交互式文本软件中的可操作单词，或者文章的导语。 
根据过去对< b >标签的用法，很多浏览器仍会将其渲染为粗体。所以你可以根据实际情况在相关的CSS 代码中重定义其默认样式。
<em>强调内容中的重点。
<i>一小段有不同语态或语气的文字，或者是样子上与普通文章有所差异以便 
标明不同特点的文字。 渲染成斜体，可以重写样式 
 ```
## 遵循WAI-ARIA 实现无障碍站点 
WAI-ARIA 是Web Accessibility Initiative - Accessible Rich Internet Applications 的缩写，指无障碍网页应用技术，
它主要解决一个问题：让残障人士能无障碍地访问网页上的动态内容。这种技术提供了一种描述自定义组件（网页应用中的动态片段）的角色、
状态和属性的方法，这样这些组件就可以被依赖辅助技术的用户找到并加以利用。

## ARIA地标属性：role=”“  

application：用来定义用作网页应用的区域。
banner：用来定义一个站点级别（而不是某个特定文档的）的区域。如网站的头部和logo。
complementary：用来定义一个对页面主要区域进行补充说明的区域。
contentinfo：用来定义与页面主要内容相关的信息区域。例如页脚的网站版权信息区域。
form：你猜都能猜到，定义表单！但注意，如果表单用于搜索，则请使用search 来替代。
main：定义页面的主体内容。
navigation：用来定义链向当前文档或相关文档的导航链接。
search：用来定义一个用于搜索的区域。
设置样式nav[role=""] {} 

## HTML5 嵌入媒体 
最初的 HTML5 规范呼吁所有浏览器内置支持使用Ogg 格式①直接播放视频或音频（无需插件）。但是由于HTML5 工作组的内部争议，
曾经作为基线标准的支持Ogg（包括Theora video 和Vorbis audio）的主张在最近更新的HTML5 规范中被放弃。因此目前的情况是，
一些浏览器支持某一套视频和音频文件格式，而另一些浏览器则支持其他格式。例如Safari 只允许在和元素中使用MP4/H.264/AAC 媒体文件，
而Firefox 和Opera 则只支持Ogg 和WebM。 

```
在一个标签内支持多种媒体格式
<video width="640" height="480" controls autoplay preload="auto" loopposter="myVideoPoster.jpg">
<source src="video/myVideo.ogv" type="video/ogg">
<source src="video/myVideo.mp4" type="video/mp4">
What, do you mean you don't understand HTML5?
</video>
```

## 针对老版本浏览器的备用方案 

```
<video width="640" height="480" controls autoplay preload="auto" loop poster=
"myVideoPoster.jpg">
<source src="video/myVideo.mp4" type="video/mp4">
<source src="video/myVideo.ogv" type="video/ogg">
<object width="640" height="480" type="application/x-shockwave-flash"
data="myFlashVideo.SWF">
<param name="movie" value="myFlashVideo.swf" />
<param name="flashvars" value="controlbar=over&amp;image=myVideoPoster.
jpg&amp; file=video/myVideo.mp4" />
<img src="myVideoPoster.jpg" width="640" height="480" alt="__TITLE__"
title="No video playback capabilities, please download the video below" />
</object>
<p> <b>Download Video:</b>
MP4 Format: <a href="myVideo.mp4">"MP4"</a>
Ogg Format: <a href="myVideo.ogv">"Ogg"</a>
</p>
</video>
```
## 响应式视频 
video { max-width: 100%; height: auto; }

### 能解决使用iframe 嵌入的视频的响应问题 
```
FitVids文件
<script>
$(document).ready(function(){
// Target your .container, .wrapper, .post, etc.
$("#content").fitVids();
});
</script>
```
## 离线Web 应用 
离线Web应用的运行机制是每个需要离线使用的网页都指定一个后缀名为.manifest 的 
文本文件。这个文本文件罗列了该网页离线使用时所需的所有资源文件（HTML、图片 
JavaScript 等等）。支持离线Web 应用的浏览器会自动读取.manifest 文件，下载文件中 
所罗列的资源文件，并将其缓存在本地以备网络断开时使用。

`<html lang="en" manifest="/offline.manifest" />`

## 修改.htaccess 文件 

`AddType text/cache-manifest .manifest`

### 阻止浏览器缓存 缓存文件offline.manifest 

```
<Files offline.manifest>
ExpiresActive On
ExpiresDefault "access"
</Files>
```
### offline.manifest 填充内容 

```
CACHE MANIFEST
#v1
CACHE:
basic_page_layout_ch4.html
css/main.css
img/atwiNavBg.png
img/kingHong.jpg
img/midnightRun.jpg
img/moulinRouge.jpg
img/oscar.png
img/wyattEarp.jpg
img/buntingSlice3Invert.png
img/buntingSlice3.png
NETWORK:
*
FALLBACK:
//offline.html
```
manifest 文件必须以CACHE MANIFEST 开头。
CACHE:部分罗列了所有离线使用所需的文件。这些文件的路径都是相对offline.manifest而言的
NETWORK:部分罗列了所有不需要被缓存的文件。星号被称为在线白名单通配符。
FALLBACK:部分使用/字符定义了一个URL 模板。它的作用是访问每个页面时都会问“缓存中有这个页面吗？”，
如果有则显示缓存页面，如果没有则显示指定的offline.html 文件。 
### 版本号的作用  
如果开发者对网站内容或资源做了修改，那么也得通知浏览器更新缓存文件，
否则浏览器仍然会使用之前已有的缓存文件。而通知浏览器更新缓存文件的方式通常是更新manifest 文件， 
浏览器如果发现manifest 文件发生了变化，就会更新缓存文件。大多数情况下manifest 中的缓存文件清单不会发 
生变化，那我们就通过修改注释的方式来改变manifest 文件，注释中的版本号，既能触发文件变化，又能指明当 
前版本，一举两得。其实注释中还可以加入更新时间等更详细信息，有助于维护。

### 页面被自动加载到离线缓存
```
CACHE MANIFEST
# Cache Manifest v1  
FALLBACK:
//offline.html
NETWORK:
*
```
这种方法只会下载和缓存用户访问的HTML 页面， 
不会缓存页面内引入的图片、JavaScript 或者其他资源文件 

# CSS3：选择器、字体和颜色模式
```
>:子级节点
+：相邻兄弟节点
~：匹配所有节点
``` 

1）id 选择器（#myid）
2）类选择器（.myclassname） 
3）标签选择器（div，h1，p） 
4）相邻选择器（h1 + p） 相邻兄弟选择器（Adjacent sibling selector）可选择紧接在另一元素后的元素，且二者有相同父元素.
5）子选择器（ul > li） 
6）后代选择器（li a） 
7）通配符选择器（* ）
8）属性选择器（ a[rel = "external"]） 
9）伪类选择器（a: hover, li: nth - child） 
10）element1~element2 选择器 element1 之后出现的所有 element2   

```
//为所有相同的父元素中位于 p 元素之后的所有 ul 元素设置背景：(选择前面有 <p> 元素的每个 <ul> 元素。) 
`p~ul {background:#ff0000;}`
// 选择紧接在 h1 元素后出现的段落，h1 和 p 元素拥有共同的父元素。  
 ` h1 + p {margin-top:50px;} `
 ```
