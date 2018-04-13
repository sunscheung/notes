



## CSS3动画
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
### CSS3 transition 属性
