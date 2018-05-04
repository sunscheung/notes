

# CSS3动画
## CSS3 transition 属性  transition: property duration timing-function delay;
>transition 属性是一个简写属性，用于设置四个过渡属性：
transition-property  //	规定设置过渡效果的 CSS 属性的名称。
transition-duration  //规定完成过渡效果需要多少秒或毫秒。
transition-timing-function  //规定速度效果的速度曲线。
transition-delay   //定义过渡效果何时开始
注释：请始终设置 transition-duration 属性，否则时长为 0，就不会产生过渡效果。

实例:把鼠标指针放到 div 元素上，其宽度会从 100px 逐渐变为 300px：
`transition: width 2s;`

### CSS3 transition-duration 属性
> transition-duration 属性规定完成过渡效果需要花费的时间（以秒或毫秒计）。
实例:让过渡效果持续 5 秒： 
` transition-duration:5s; `

### CSS3 transition-property 属性
> transition-property 属性规定应用过渡效果的 CSS 属性的名称。（当指定的 CSS 属性改变时，过渡效果将开始）。
提示：过渡效果通常在用户将鼠标指针浮动到元素上时发生。
注释：请始终设置 transition-duration 属性，否则时长为 0，就不会产生过渡效果。
实例:把鼠标指针放到 div 元素上，会产生带有平滑改变元素宽度的过渡效果：
` transition-property:width; `

## CSS3 transform 属性  transform: none|transform-functions;
> transform 属性向元素应用 2D 或 3D 转换。该属性允许我们对元素进行旋转、缩放、移动或倾斜 
实例:旋转 div 元素：
`div{transform:rotate(7deg);}`
```
值	描述	测试
none	定义不进行转换。	测试
matrix(n,n,n,n,n,n)	定义 2D 转换，使用六个值的矩阵。	测试
matrix3d(n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n)	定义 3D 转换，使用 16 个值的 4x4 矩阵。	
translate(x,y)	定义 2D 转换。	测试
translate3d(x,y,z)	定义 3D 转换。	
translateX(x)	定义转换，只是用 X 轴的值。	测试
translateY(y)	定义转换，只是用 Y 轴的值。	测试
translateZ(z)	定义 3D 转换，只是用 Z 轴的值。	
scale(x,y)	定义 2D 缩放转换。	测试
scale3d(x,y,z)	定义 3D 缩放转换。	
scaleX(x)	通过设置 X 轴的值来定义缩放转换。	测试
scaleY(y)	通过设置 Y 轴的值来定义缩放转换。	测试
scaleZ(z)	通过设置 Z 轴的值来定义 3D 缩放转换。	
rotate(angle)	定义 2D 旋转，在参数中规定角度。	测试
rotate3d(x,y,z,angle)	定义 3D 旋转。	
rotateX(angle)	定义沿着 X 轴的 3D 旋转。	测试
rotateY(angle)	定义沿着 Y 轴的 3D 旋转。	测试
rotateZ(angle)	定义沿着 Z 轴的 3D 旋转。	测试
skew(x-angle,y-angle)	定义沿着 X 和 Y 轴的 2D 倾斜转换。	测试
skewX(angle)	定义沿着 X 轴的 2D 倾斜转换。	测试
skewY(angle)	定义沿着 Y 轴的 2D 倾斜转换。	测试
perspective(n)	为 3D 转换元素定义透视视图。	测试
```

## CSS3 animation 属性  animation: name duration timing-function delay iteration-count direction;
```
animation-name	规定需要绑定到选择器的 keyframe 名称。。
animation-duration	规定完成动画所花费的时间，以秒或毫秒计。
animation-timing-function	规定动画的速度曲线。
animation-delay	规定在动画开始之前的延迟。
animation-iteration-count	规定动画应该播放的次数。
animation-direction	规定是否应该轮流反向播放动画。
```
实例:使用简写属性，将动画与 div 元素绑定：
```
div{
animation:mymove 5s infinite;
-webkit-animation:mymove 5s infinite; /* Safari 和 Chrome */
}
```
