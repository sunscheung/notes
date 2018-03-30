# 什么是重构？ 
在不改变现有程序功能的情况下，对代码结构及写法进行调整。
# 重构目的是什么？ 
让我们的代码更清晰，更容易理解，更易于阅读和易于后期维护。
# 为什么要重构？
1. 重构使程序更容易理解。
重构的宗旨就是让代码告诉编程人员它要做什么，当没一段代码都能长清晰的表达自己的功能。那么这样的代码就非常容易理解。
同时，在重构代码的过程中，更加深了你对程序功能及代码构造的理解。
2. 重构可以改善程序设计。
正如极限编程（XP）的观点：重构可以取代预先设计。按最初想法开发编码，让代码有效运作，然后再重构执行。
所谓极限还是有些偏激，其实涉及跟重构相辅相成，好设计能造就好程序，重构则能修复设计的不足。重构的过程就是一个代码整理的过程，同时也是代码检验的过程，在这个过程中我们可以发现代码不足的同时也能发现程序设计的不足。
3. 重构可以提高编码效率。
一目了然的代码可以节省你不少用于去理解代码的时间，这样编码效率自然高了。
4. 利用重构找到bug，提高性能。
重构的过程就是代码检验的过程，有些埋藏很深的bug也许就会这样被你发现了。
5. 利用重构提高产品生命周期。
很多时候你都听到程序员说，这些代码是已经离职很久的人员写的，太烂了，需要重写。这是产品和项目经理最愿看到的，如果部门有重构文化，那么你的产品生命周期就无形的在提高。

# 何时重构？
随时重构，不要为了重构而重构。
>>>三次法则：第一次做某件事时只管去做；第二次做类似的事会产生反感，但无论如何还是可以去做；第三次再做类似的事，你就该重构了。
添加功能时重构：代码的设计无法帮助我轻松添加我所需的特性，这时候就可以考虑重构。通过完成重构，新特性的添加就会更快速，更流畅。
修补错误时重构：收到一份错误报告，就是重构的信号。
复审代码时重构：复审者搭配一个原作者，共同处理这些代码。

# 何时不应该重构？
产品即将发布，项目即将验收时不该做重构。
程序重构的代价超过重写编写的代价。
 
# JavaScript的重构跟其他面向对象重构有什么不同？

JavaScript作为弱势语言，他的重构更据有挑战性，需要考虑的东西也会多一些，同时对一些面向对象的重构可能会做的比较少，但需要更加细心。具体表现出以下几点。

1. 遇有JavaScript和HTML,CSS的交互很多，所以分离三者是JavaScript重构的一个大部分。

2. 事件处理和回调机制是JavaScript的用途非常广，这块也需要在重构中考虑。

3. JavaScript的类库众多，在选择和淘汰上也是重构的一部分。

# 重新组织你的函数

1. 提炼函数
2. 将函数内联化
3. 用查询取代临时变量
4. 以临时变量取代高消耗的查询
5. 将临时变量内联化
6. 引入解释性变量
7. 剖解临时变量
8. 移除对参数的赋值动作
9. 以函数对象取代函数
10. 替换你的算法

## 提炼函数

信号：你有一段代码可以被组织在一起并独立出来。

操作：将这段代码放进一个独立函数中，并让函数名称解释该函数的用途。

当你有一个很长的函数，这也是一个非常直接的重构信号，但真正能让你用【提炼函数】方法重构代码时候，必须发现有一段代码可以被组织在一起，也就是说这段代码能够看作一个独立的工作模块。
```
/*
 * 原函數
 */
composingMethodsDemo.printOwing = function (order) {
    //print header
    document.writeln('===================');
    document.writeln('== print amount ===');
    document.writeln('===================');
    var _order = order,
        outstanding = 0;
    for (var i = 0, len = _order.records.length; i < len; i++) {
        outstanding = outstanding + _order.records[i].expenditure;
    }
    //print detail
    document.writeln('name: ' + _order.name);
    document.writeln('amount: ' + outstanding);
};
/*
 * 重構後函數
 */
composingMethodsDemo.newPrintOwing = function (order) {
    var outstanding = this.getOutstanding(order);
    this.extPrintHeader();
    this.extPrintDetail(order.name, outstanding);
};
// 无局部变量，直接提出
composingMethodsDemo.extPrintHeader = function () {
    document.writeln('===================');
    document.writeln('== print amount ===');
    document.writeln('===================');
};
// 有局部变量, 以參數傳遞形式輸入
composingMethodsDemo.extPrintDetail = function (name, outstanding) {
    document.writeln('name: ' + name);
    document.writeln('amount: ' + outstanding);
};
// 对局部变量再赋值
composingMethodsDemo.getOutstanding = function (order) {
    var outstanding = 0;
    for (var i = 0, len = order.records.length; i < len; i++) {
        outstanding = outstanding + order.records[i].expenditure;
    }
    return outstanding;
};
```
## 将函数内联化

信号：一个函数，它本体应该与其名称同样清楚易懂。

操作：在函数调用点插入函数本体，然后移除该函数。

这条重构方法跟【提炼函数】是相对立的，如果你发现你【提炼函数】的函数它的内容跟它名字一样清晰易懂，那么还是把它内联回去，让它看上去更直接。

也有可能【提炼函数】重构完后，长函数（主函数）中添加了一些代码，这时候被提取出来的函数写到长函数中更直接，那我们也需要先内联回去，然后再看它和其他代码一起组织成新函数是否能再利用【提炼函数】。
```
/*
 * 原函數
 */
composingMethodsDemo.getRating = function (numberOfLateDeliveries) {
    return (this.moreThanFiveLateDeliveries(numberOfLateDeliveries)) ? 2 : 1;
};
composingMethodsDemo.moreThanFiveLateDeliveries = function (numberOfLateDeliveries) {
    return numberOfLateDeliveries > 5;
};
/*
 * 重構後
 */
composingMethodsDemo.getRating = function (numberOfLateDeliveries) {
    return (numberOfLateDeliveries > 5) ? 2 : 1;
};
```
## 用查询取代临时变量

信号：你的程序以一个临时变量保存某一表达式的运算结果。

操作：将这个表达式提炼到一个独立函数中。将这个临时变量的所有被引用点替换为对新函数的调用。新函数可被其他函数使用。

临时变量一般在函数内部实用，这样就促使你不得不让你的函数变得更长，这样才能使你的代码访问到你的临时变量。这时候，如果将临时变量换成一个查询式，那么代码就更清晰，更简洁了，但这个需要将高消耗的查询除外。
```
// 用查询取代临时变量
var composingMethodsDemo = {
    _quantity: 30,
    _itemPrice: 12
}
/*
 * 原函數
 */
composingMethodsDemo.getTotalPrice = function () {
    var basePrice = this._quantity * this._itemPrice;
    if (basePrice > 1000) {
        return basePrice * 0.95;
    } else {
        return basePrice * 0.98;
    }
};
/*
 * 重構後
 */
composingMethodsDemo.getTotalPrice = function () {
    if (this.getBasePrice() > 1000) {
        return this.getBasePrice() * 0.95;
    } else {
        return this.getBasePrice() * 0.98;
    }
};
composingMethodsDemo.getBasePrice = function () {
    return this._quantity * this._itemPrice;
};
```
## 用临时变量取代高消耗的查询

信号：多次调用的查询式是一个高消耗的函数

操作：用临时变量储存该查询，将该查询式调用处用临时变量代替

该方法与【用查询取代临时变量】是对立的，但出发点不同，本方法出发点最重要的为了提升代码性能，一些高消耗的方法如果在函数体中多次调用，我们需要用临时变量缓存起来。最常见的是DOM查询式，高循环运算的函数查询式。
```
// 用临时变量取代高消耗的查询
composingMethodsDemo.getTotalPrice = function () {
    if (this.getBasePrice() > 1000) {
        return this.getBasePrice() * 0.95;
    } else {
        return this.getBasePrice() * 0.98;
    }
};
composingMethodsDemo.getBasePrice = function () {
    return parseFloat(document.getElementById('quantity').value) * parseFloat(document.getElementById('itemPrice').value);
};
/*
 * 重構後
 */
composingMethodsDemo.getTotalPrice = function () {
    var basePrice = this.getBasePrice();
    if (basePrice > 1000) {
        return basePrice * 0.95;
    } else {
        return basePrice * 0.98;
    }
};
composingMethodsDemo.getBasePrice = function () {
    return parseFloat(document.getElementById('quantity').value) * parseFloat(document.getElementById('itemPrice').value);
};
```
## 将临时变量内联化

信号：你有一个临时变量，只被一个简单表达式赋值一次，而它妨碍了其他重构手法。

操作：将所有对该变量的引用动作，替换为对它赋值的那个表达式本身。

本方法多半是作为【用查询取代临时变量】的一部分来使用，所以真正的动机出现在后者那儿。惟一单独使用本方法的情况是：你发现某个临时变量被赋予某个函数调用的返回值。一般来说，这样的临时变量不会有任何危害，你可以放心地把它留在那儿。但如果这个临时变量妨碍了其他的重构方法（例如【提取函数】），你就应该将它内联化。
```
// 将临时变量内联化
var composingMethodsDemo = {
    _quantity: 30,
    _itemPrice: 12
};
/*
 * 原函數
 */
composingMethodsDemo.isOverMaxPrice = function () {
    var basePrice = this.getBasePrice();
    return basePrice > 1000;
};
composingMethodsDemo.getBasePrice = function () {
    return this._quantity * this._itemPrice;
};
/*
 * 重構後
 */
composingMethodsDemo.isOverMaxPrice = function () {
    return this.getBasePrice() > 1000;
};
composingMethodsDemo.getBasePrice = function () {
    return this._quantity * this._itemPrice;
};
```
## 引入解释性变量

信号：你有一个复杂的表达式。

操作：将该表达式（或其中一部分）的结果放进一个临时变量，以此变量名称来解释表达式用途。

【引入解释性变量】能使方法体看上去更加易懂。特别是当表达式特别复杂的情况下，更能体现该方法的优势。该方法非常有用，但很多时候我们都实用【提取函数】的方法来重构，毕竟临时变量只对当前函数体有效，所以只有当局部变量令【提取函数】难以进行，我们才实用【引入解释性变量】方法来处理重构。
```
// 用查询取代临时变量
var composingMethodsDemo = {
    _quantity: 30,
    _itemPrice: 12
}
/*
 * 原函數
 */
composingMethodsDemo.getTotalPrice = function () {
    var basePrice = this._quantity * this._itemPrice;
    if (basePrice > 1000) {
        return basePrice * 0.95;
    } else {
        return basePrice * 0.98;
    }
};
/*
 * 重構後
 */
composingMethodsDemo.getTotalPrice = function () {
    if (this.getBasePrice() > 1000) {
        return this.getBasePrice() * 0.95;
    } else {
        return this.getBasePrice() * 0.98;
    }
};
composingMethodsDemo.getBasePrice = function () {
    return this._quantity * this._itemPrice;
};
```
```
// 引入解释性变量
/*
 * 原函數
 */
composingMethodsDemo.getMacIEVersion = function (platform, browser) {
    if ((platform.toUpperCase().indexOf("MAC") > -1) &&
        (browser.toUpperCase().indexOf("IE") > -1)) {
        return browser.version;
    }
    return null;
};
/*
 * 重構後
 */
composingMethodsDemo.getMacIEVersion = function (platform, browser) {
    var isMac = platform.toUpperCase().indexOf("MAC") > -1,
        isIE = browser.toUpperCase().indexOf("IE") > -1;
    if (isMac && isIE) {
        return browser.version;
    }
    return null;
};
```

## 剖解临时变量

信号：你的程序有某个临时变量被赋值超过一次，它既不是循环变量，也不是一个集用临时变量（collecting temporary variable）。

操作：针对每次赋值，创造一个独立的、对应的临时变量。

除了循环变量和集用临时变量这两种临时变量被多次赋值的情况，其他被多次赋值的临时变量都在敲醒我们重构的警钟。每个临时变量应该只承担一个单独的责任，例如【用临时变量取代高消耗的查询】中生成的临时变量，如果赋值多次，就应该重构以多个临时代替。

```
// 剖解临时变量
composingMethodsDemo.getActivedUsers = function (users) {
    var names = [], // 集用临时变量
        count = users.length;
    for (var i = 0; i < count; i++) { // i就是循环变量
        if (users[i].actived) {
            names.push(users[i].name);
        }
    }
    return names;
};
/*
 * 原函數
 */
composingMethodsDemo.printRectangleInfo = function (height, width) {
    var temp = 2 * (height + width);
    document.writeln(temp);
    temp = height * width;
    document.writeln(temp);
};
/*
 * 重構後
 */
composingMethodsDemo.printRectangleInfo = function (height, width) {
    var perimeter = 2 * (height + width),
        area = height * width;
    document.writeln(perimeter);
    document.writeln(area);
};
```

## 移除对参数的赋值动作

信号：你的代码对一个参数进行赋值动作。

操作：以一个临时变量取代该参数的位置，以函数返回值在原函数改变对象。

在JavaScript中非常特别的一个地方，但一个对象作为参数传递时，传递的往往是一个原始的引用，甚至都不是副本。这样出现的问题就是，参数被修改后会引起原函数中的对象会相应被修改，引起很多混杂不清晰的现象，甚至会是错误。所以如果参数是一个值类型，可以以一个临时变量取代该参数的位置。如果参数为一个引用类型，这时就需要避免这种情况出现。

```
// 移除对参数的赋值动作
/*
 * 原函數(值傳遞)
 */
composingMethodsDemo.printAreaSize = function (height, width, padding) {
    height = height + 2 * padding;
    width = width + 2 * padding;
    document.writeln(height * width);
};
/*
 * 重構後(值傳遞)
 */
composingMethodsDemo.printAreaSize = function (height, width, padding) {
    var outHeight = height + 2 * padding;
    outWidth = width + 2 * padding;
    document.writeln(outHeight * outWidth);
};
/*
 * 原函數(引用傳遞)
 */
composingMethodsDemo.printRectangleInfo = function (height, width) {
    var rectang = {
        height: 12,
        width: 15,
        padding: 5
    };
    this.printArea(rectang);        // 這裡正確
    this.printPerimeter(rectang);   // 由於rectang引用在printArea中被修改，這裏的輸出結構就錯了
};
composingMethodsDemo.printArea = function (rectang) {
    //這裡需要避免修改，如需更改參數對象，請在原函數進行修改
    rectang.height = rectang.height + 2 * rectang.padding;
    rectang.width = rectang.width + 2 * rectang.padding;
    document.writeln(rectang.height * rectang.width);
};
composingMethodsDemo.printPerimeter = function (rectang) {
    rectang.height = rectang.height + 2 * rectang.padding;
    rectang.width = rectang.width + 2 * rectang.padding;
    document.writeln(2 * (rectang.height + rectang.width));
};
/*
 * 重構後(引用傳遞)
 */
composingMethodsDemo.printRectangleInfo = function (height, width) {
    var rectang = {
        height: 12,
        width: 15,
        padding: 5
    };
    this.printArea(rectang);        // 這裡正確, 但rectang被更改 
    this.printPerimeter(rectang);   // 輸出錯誤，rectang再次被更改
};
composingMethodsDemo.printArea = function (rectang) {
    var height = rectang.height + 2 * rectang.padding，
    width = rectang.width + 2 * rectang.padding;
    document.writeln(height * width);
};
composingMethodsDemo.printPerimeter = function (rectang) {
    var height = rectang.height + 2 * rectang.padding，
    width = rectang.width + 2 * rectang.padding;
    document.writeln(2 * (height + width));
};
```

## 以函数对象取代函数

信号：你有一个大型函数，其中对局部变量的使用，使你无法釆用【提取函数】。

操作：将这个函数放进一个单独对象中，如此一来局部变量就成了对象内的值域（field） 然后你可以在同一个对象中将这个大型函数分解为数个小型函数。 

如果一个大型函数，功能比较单一，且局部变量很多，这时候我们没办法采用单纯的【提取函数】方法来重构，这个时候我们就可以把大型函数转换成一个函数对象来处理，然后将函数体分解成小函数。

## 传递对象参数代替过长的参数列表
```
var setUser = function(id,name,sex,mobile,qq){
    console.log(id);
    console.log(name);
    console.log(sex);
    console.log(mobile);
}
setUser(1,'sunscheung','male','13****','125***')

//尝试用以下方式
var setUser = function(obj){
    console.log(obj.id);
    console.log(obj.name);
    console.log(obj.sex);
    console.log(obj.mobile);
}
setUser({id:1,name:'sunscheung',sex:'male',tel:'13****',qq:'125***'})
```

## 替换你的算法

信号：把某个算法替换为另一个更清晰的算法。

操作：将函数本体（method body）替换为另一个算法。

算法过于复杂，或则循环过于深入都是影响代码阅读的因素，这里我们需要了解循环复杂度。可以用【提取函数】或替换算法来解决这类复杂问题。
