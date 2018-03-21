> 嵌套at-rules - 嵌套语句的子集，可用作样式表语句以及条件组规则：

# 特征查询  @supports

@supports - 条件组规则，也被称为 Feature Queries。如果浏览器符合给定条件的条件，将应用其内容。

在CSS 的规则让你指定依赖于浏览器中的一个或多个特定的CSS功能的支持声明。
这被称为功能查询。@supports可以放在代码的顶部，也可以嵌套在任何其他规则条件组中。

```
   span{
          display:table-cell;
    }
   div {
      width: 300px;
      background: yellow;
      // 老布局的一些CSS代码
    }
    @supports (display:flex) {
      span{
          display:flex;
      }
      div {
        width: auto;
        background: green;
       // 新布局的一些CSS代码
      }
    }    
```

# 媒体查询 @media
@media- 条件组规则，如果设备符合使用媒体查询定义的条件的条件，则会应用其内容。

媒体查询 是 响应式设计的关键组成部分，这使得根据参数和设备特性调整CSS成为可能。
比如说，媒体查询能够在用户设备屏幕小于一定的尺寸或者保持在横向或者纵向的模式时，
提供不同的样式。@media （at-rule  CSS样式声明，以@开头）被用作有条件的向文档提供样式。
此外，媒体查询的语法也可以被用在其他上下文中，比如说在<source> 元素中的media属性, 在选择一张具体图片用于一个<picture> 元素时，可以设置一个用于确定是否使用该资源的媒体查询字符串。

其他相关:
@charset - 定义样式表使用的字符集。
@import - 告诉CSS引擎包含外部样式表。
@namespace - 告诉CSS引擎，它的所有内容必须被认为是一个XML命名空间的前缀。
