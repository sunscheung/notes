在Angular框架核心之一是一个解析器。解析Angular指令和呈现HTML输出的解析器。

角分析器分三步工作： -

第1步： - HTML浏览器分析HTML并创建一个DOM（文档对象模型）。

第2步： - 在此DOM上运行的角度框架查看Angular指令并相应地操作DOM。

第3步： - 这个操纵，然后在浏览器中呈现为HTML。

[](https://github.com/sunscheung/notes/tree/master/imgs/pHQfU.png)

现在上面的角度解析并不像看起来那么简单。它发生在  两个阶段“编译”和“链接”。首先是编译阶段，然后是链接阶段。

> Compile -----> Link


在  编译阶段  ，角度解析器开始解析DOM，每当解析器遇到一个指令时，它就会创建一个函数。这些函数被称为模板或编译函数。在这个阶段，我们无法访问$范围数据。

在  链接阶段  ，数据ie（$ scope）被附加到模板函数并执行以获得最终的HTML输出。

[](https://github.com/sunscheung/notes/tree/master/imgs/wRGlk.png)
