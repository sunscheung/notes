# 从MVC到MVP再到MVVM

  MV*框架的优势在于，
  在结构上其可以组织良好的结构化、模块化代码；
  在逻辑上，实现以下功能：
  构建DOM
  实现视图逻辑
  在模型与视图间进行同步
  管理复杂的UI交互操作
  管理状态和路由
  创建与连接组件

## MVC

  MVC全名是Model View Controller，是模型(model)－视图(view)－控制器(controller)的缩写，一种软件设计典范，用一种业务逻辑、数据、界面显示分离的方法组织代码，将业务逻辑聚集到一个部件里面，在改进和个性化定制界面及用户交互的同时，不需要重新编写业务逻辑。MVC被独特的发展起来用于映射传统的输入、处理和输出功能在一个逻辑的图形化用户界面的结构中。
  图片: https://img-blog.csdn.net/20160327122244602

### MVC数据关系

  View 接受用户交互请求
  View 将请求转交给Controller
  Controller 操作Model进行数据更新
  数据更新之后，Model通知View更新数据变化
  View 更新变化数据

### MVC方式

  所有方式都是单向通信

### MVC结构实现

  View ：使用 Composite模式(结构型)
  View和Controller：使用 Strategy模式
  Model和 View：使用 Observer模式同步信息

### MVC使用

  MVC中的View是可以直接访问Model的(Backbone是典型的纯净MVC框架)
  从而，View里会包含Model信息，不可避免的还要包括一些业务逻辑。
  在MVC模型里，更关注的Model的不变，而同时有多个对Model的不同显示，及View。
  所以，在MVC模型里，Model不依赖于View，但是 View是依赖于Model的。
  不仅如此，因为有一些业务逻辑在View里实现了，导致要更改View也是比较困难的，至少那些业务逻辑是无法重用的。

## MVP

  MVP的全称为Model-View-Presenter，Model提供数据，View负责显示，Controller/Presenter负责逻辑的处理。
  MVP与MVC有着一个重大的区别：在MVP中View并不直接使用Model，它们之间的通信是通过Presenter (MVC中的Controller)来进行的，
  所有的交互都发生在Presenter内部，而在MVC中View会直接从Model中读取数据而不是通过 Controller。
  图片：https://img-blog.csdn.net/20160327122329900

### MVP数据关系

  View 接收用户交互请求
  View 将请求转交给 Presenter
  Presenter 操作Model进行数据更新
  Model 通知Presenter数据发生变化
  Presenter 更新View数据

### MVP的优势

  Model与View完全分离，修改互不影响
  更高效地使用，因为所有的逻辑交互都发生在一个地方—Presenter内部
  一个Preseter可用于多个View，而不需要改变Presenter的逻辑（因为View的变化总是比Model的变化频繁）。
  更便于测试。把逻辑放在Presenter中，就可以脱离用户接口来测试逻辑（单元测试）

### MVP方式

  各部分之间都是双向通信

### MVP结构实现

  View ：使用 Composite模式
  View和Presenter：使用 Mediator模式
  Model和Presenter：使用 Command模式同步信息

### MVC和MVP区别
  
  MVP与MVC最大的一个区别就是：Model与View层之间倒底该不该通信（甚至双向通信）

### MVC和MVP关系

  MVP：是MVC模式的变种。
  项目开发中，UI是容易变化的，且是多样的，一样的数据会有N种显示方式；业务逻辑也是比较容易变化的。
  为了使得应用具有较大的弹性，我们期望将UI、逻辑（UI的逻辑和业务逻辑）和数据隔离开来，而MVP是一个很好的选择。
  Presenter（主持）代替了Controller，它比Controller担当更多的任务，也更加复杂。Presenter处理事件，执行相应的逻辑，
  这些逻辑映射到Model操作Model。那些处理UI如何工作的代码基本上都位于Presenter。
  MVC中的Model和View使用Observer模式进行沟通；MPV中的Presenter和View则使用Mediator模式进行通信；
  Presenter操作Model则使用Command模式来进行。基本设计和MVC相同：Model存储数据，View对Model的表现，
  Presenter协调两者之间的通信。
  在 MVP 中 View 接收到事件，然后会将它们传递到 Presenter, 如何具体处理这些事件，将由Presenter来完成。
  如果要实现的UI比较复杂，而且相关的显示逻辑还跟Model有关系，就可以在View和 Presenter之间放置一个Adapter。
  由这个 Adapter来访问Model和View，避免两者之间的关联。而同时，因为Adapter实现了View的接口，
  从而可以保证与Presenter之 间接口的不变。这样就可以保证View和Presenter之间接口的简洁，又不失去UI的灵活性。

### MVP使用

  MVP的实现会根据View的实现而有一些不同，一部分倾向于在View中放置简单的逻辑，在Presenter放置复杂的逻辑；另一部分倾向于在presenter中放置全部的逻辑。这两种分别被称为：Passive View和Superivising Controller。

## MVVM

  MVVM是Model-View-ViewModel的简写。微软的WPF带来了新的技术体验，如Silverlight、音频、视频、3D、动画……，
  这导致了软件UI层更加细节化、可定制化。同时，在技术层面，WPF也带来了
  诸如Binding、Dependency Property、Routed Events、Command、DataTemplate、ControlTemplate等新特性。
  MVVM（Model-View-ViewModel）框架的由来便是MVP（Model-View-Presenter）模式与WPF结合的应用方式时发展演变过来的一种新型架构框架。它立足于原有MVP框架并且把WPF的新特性糅合进去，以应对客户日益复杂的需求变化。（ MVVM 是在 WPF 平台上对于 PM 模式的实现。）
  Presentation Model（演示模型）
  图片：https://img-blog.csdn.net/20160327124531740

### MVVM数据关系
  
  View 接收用户交互请求
  View 将请求转交给ViewModel
  ViewModel 操作Model数据更新
  Model 更新完数据，通知ViewModel数据发生变化
  ViewModel 更新View数据

### MVVM方式
  
  双向绑定。View/Model的变动，自动反映在 ViewModel，反之亦然。

### MVVM使用

  可以兼容你当下使用的 MVC/MVP 框架。
  增加你的应用的可测试性。
  配合一个绑定机制效果最好。

### MVVM优点

MVVM模式和MVC模式一样，主要目的是分离视图（View）和模型（Model），有几大优点:

1. 低耦合。View可以独立于Model变化和修改，一个ViewModel可以绑定到不同的”View”上，
  当View变化的时候Model可以不变，当Model变化的时候View也可以不变。
2. 可重用性。你可以把一些视图逻辑放在一个ViewModel里面，让很多view重用这段视图逻辑。
3. 独立开发。开发人员可以专注于业务逻辑和数据的开发（ViewModel），设计人员可以专注于页面设计，生成xml代码。
4. 可测试。界面素来是比较难于测试的，而现在测试可以针对ViewModel来写。

## mvc,mvp,mvvm三者演化

  任何的项目框架，都是为项目服务的。没有绝对的好坏之分，只有更合适的选择。
  在项目进展的不同阶段，做出最合适的调整，才是是更适合团队项目发展的框架。项目设计者要谨记，
  任何的项目设计，都是要围绕项目发展阶段，团队成员规模，和团队整体能力而定的。
  切莫为了设计而设计，为了框架而框架。快速，高效的配合整个团队进展项目，才是最合适的架构。
  才是一个程序员为成一个leader，成为一个架构师的必经之路。

---------------------
原文：https://blog.csdn.net/hudan2714/article/details/50990359
版权声明：本文为博主原创文章，转载请附上博文链接！

1. 标准的MVC：
  模型：管理应用的行为和数据，响应数据请求（经常来自视图）和更新状态的指令（经常来自控制器）
  控制器：翻译用户的输入并依照用户的输入操作模型和视图；
  视图：管理作为位图展示到屏幕上的图形和文字输出；
  依赖关系：
  在 MVC 中，模型层可以单独工作，而视图层和控制器层都依赖与模型层中的数据。
2. 标准的MVP
  依赖关系
  视图成为了完全被动的并且不再根据模型来更新视图本身的内容，也就是说，
  不同于 MVC 中的依赖关系；在被动视图中，视图层对于模型层没有任何的依赖：
  因为视图层不依赖与其他任何层级也就最大化了视图层的可测试性，同时也将视图层和模型层进行了合理的分离，两者不再相互依赖。

作者：西木柚子
链接：https://juejin.im/post/59fc625d51882529c0468dc9
来源：掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。