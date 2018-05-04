
## 数组扩展
1. Array.from
2. Array.of
3. copyWithin
4. find\findIndex
5. fill
6. entries\keys\values
7. inludes
### 把一组变量转换成数组类型
```
{
  let arr = Array.of(3,4,7,9,11);
  console.log('arr=',arr);

  let empty=Array.of();
  console.log('empty',empty); //空数组
}
```
### 把伪数组，集合转换成数组类型
map映射
```
{
  let p=document.querySelectorAll('p');
  let pArr=Array.from(p);
  pArr.forEach(function(item){
    console.log(item.textContent);
  });
   第二种用法：map映射
  console.log(Array.from([1,3,5],function(item){return item*2}));
}
```
### 填充数组
```
{
  console.log('fill-7',[1,'a',undefined].fill(7));
  console.log('fill,pos',['a','b','c'].fill(7,1,3));
  替换数值，起始替换位置（索引从0开始），替换长度
}
```
### 遍历数组
```
{
  for(let index of ['1','c','ks'].keys()){
    console.log('keys',index);
  }
  // values有兼容性问题
  for(let value of ['1','c','ks'].values()){
    console.log('values',value);
  }
  // keys和values都取
  for(let [index,value] of ['1','c','ks'].entries()){
    console.log('values',index,value);
  }
}
```
### 替换数组
```
//copyWithin() 方法浅复制数组的一部分到同一数组中的另一个位置，并返回它，而不修改其大小。
//arr.copyWithin(target[, start[, end]]) , 不包括end
{
  console.log([1,2,3,4,5].copyWithin(0,3,4));
  （0，3，4）从哪个位置开始替换，从哪个位置开始读取数据，从哪个位置截至
  输出：4，2，3，4，5
}
```

### 查找数组
> find只找一个，findIndex返回下标
```
{
  console.log([1,2,3,4,5,6].find(function(item){return item>3}));
  console.log([1,2,3,4,5,6].findIndex(function(item){return item>3}));
}
```
不能加函数
```
{
  console.log('number',[1,2,NaN].includes(1)); 返回True
  console.log('number',[1,2,NaN].includes(NaN)); 返回True
}
```
### 函数扩展
参数默认值
rest参数
扩展运算符（rest的逆运用）
箭头函数 
this绑定（箭头函数在定义时的所在）
ES5 this是函数被调用时的所在
伪调用
参数默认值
默认值的后面不能没有未定义的变量，否则报错
```
{
  function test(x, y = 'world'){
    console.log('默认值',x,y);
  }
  test('hello');
  test('hello','kill');
}
```
注意作用域(从小到大查找，冒泡)
```
{
  let x='test';
  function test2(x,y=x){
    console.log('作用域',x,y);
  }
  test2('kill');
  输出kill kill
  test2();
  输出 undefined undefined

}
```
rest参数（一堆参数（不确定）->数组）
```
{
  function test3(...arg){
    for(let v of arg){
      console.log('rest',v);
    }
  }
  test3(1,2,3,4,'a');
}
```
### 扩展运算符
```
{
  console.log(...[1,2,4]);
  console.log('a',...[1,2,4]);
}
```
箭头函数(注意绑定)
函数名 = 函数参数 => 函数返回值
```
{
  let arrow = v => v*2;
  let arrow2 = () => 5;
  console.log('arrow',arrow(3));
  console.log(arrow2());

}
```
伪调用（函数式编程）
提升性能
```
{
  function tail(x){
    console.log('tail',x);
  }
  function fx(x){
    return tail(x)
  }
  fx(123)
}
```
### 对象扩展
简洁表示法
属性表达式
扩展运算符
Object新增方法
简洁表示法
```
{
  // 简洁表示法
  let o=1;
  let k=2;
  let es5={
    o:o,
    k:k
  };
  let es6={
    o,
    k
  };
  console.log(es5,es6);

  let es5_method={
    hello:function(){
      console.log('hello');
    }
  };
  let es6_method={
    hello(){
      console.log('hello');
    }
  };
  console.log(es5_method.hello(),es6_method.hello());
}
```
### 属性表达式
{
  // 属性表达式
  let a='b';
  let es5_obj={
    a:'c',
    b:'c'
  };

  let es6_obj={
    // 可以用表达式，变量来声明key
    [a]:'c'
  }

  console.log(es5_obj,es6_obj);

}
```
### 扩展运算符
is相当于===。 
数组也是引用类型，引用地址不同。 
assign相当于拷贝.拷贝属性有限制，就是前拷贝。 
复制分浅复制（对于引用类型，只修改引用地址）和深复制，assign属于前者。 
assign拷贝的是自身对象的属性（如果对象只有继承，他不会拷贝继承的属性），也不会拷贝不可枚举的属性。 
js中基本包装类型的原型属性是不可枚举的，如Object, Array, Number等 
Object.entries取keys和values

在JavaScript中，对象的属性分为可枚举和不可枚举之分，它们是由属性的enumerable值决定的。可枚举性决定了这个属性能否被for…in查找遍历到。
```
{
  // 新增API
  console.log('字符串',Object.is('abc','abc'),'abc'==='abc');
  console.log('数组',Object.is([],[]),[]===[]);

  console.log('拷贝',Object.assign({a:'a'},{b:'b'}));

  let test={k:123,o:456};
  for(let [key,value] of Object.entries(test)){
    console.log([key,value]);
  }
}
```
babel对扩展运算符支持不是很友好
```
{
  //扩展运算符
  let {a,b,...c}={a:'test',b:'kill',c:'ddd',d:'ccc'};
  // c={
  //   c:'ddd',
  //   d:'ccc'
  // }
}
```
### Symbol
Symbol提供一个独一无二（不相等）的值

不可枚举对象
```
{
  // 声明
  let a1=Symbol();
  let a2=Symbol();
   console.log(a1==a2); //返回false
  console.log(a1===a2); //返回false
  let a3=Symbol.for('a3');
  let a4=Symbol.for('a3');
  console.log(a3===a4); //返回true
}
```
Symbol使用
{
  let a1=Symbol.for('abc');
  let obj={
    [a1]:'123',
    'abc':345,
    'c':456
  };
  console.log('obj',obj);

  for(let [key,value] of Object.entries(obj)){
    console.log('let of',key,value);
  }
//只拿Symbol的API
  Object.getOwnPropertySymbols(obj).forEach(function(item){
    console.log(obj[item]);
  })
// ES6:都拿（非symbol和symbol）
  Reflect.ownKeys(obj).forEach(function(item){
    console.log('ownkeys',item,obj[item]);
  })
}
```
### 数据结构
Set,集合（其中元素不能重复）
WeakSet
Map（相对于Object,key只能是字符串，但是Map的可以是任意的数据类型）
WeakMap
Set
```
{
  let list = new Set();
  list.add(5);
  list.add(7);

  console.log('size',list.size);
}
```
Set定义
```
{
  let list = new Set();
  list.add(5);
  list.add(7);

  console.log('size',list.size);
}

{
  let arr = [1,2,3,4,5];
  let list = new Set(arr);

  console.log('size',list.size);
}
```
添加重复元素不报错，只是去重，不转换数据类型
```
{
  let list = new Set();
  list.add(1);
  list.add(2);
  list.add(1);

  console.log('list',list);

  let arr=[1,2,3,1,'2'];
  let list2=new Set(arr);

  console.log('unique',list2);
}
```
Set方法
has
delete
clear
keys和values相等
```
{
  let arr=['add','delete','clear','has'];
  let list=new Set(arr);

  console.log('has',list.has('add'));
  console.log('delete',list.delete('add'),list);
  list.clear();
  console.log('list',list);
}
```
### set遍历
```
{
  let arr=['add','delete','clear','has'];
  let list=new Set(arr);

  for(let key of list.keys()){
    console.log('keys',key);
  }
  for(let value of list.values()){
    console.log('value',value);
  }
  for(let [key,value] of list.entries()){
    console.log('entries',key,value);
  }

  list.forEach(function(item){console.log(item);})
}
```
### WeakSet
WeakSet的元素只能是对象（地址引用） 
弱引用，不会监测该对象有没有在其他地方用过（不会监测是否被垃圾回收机制回收掉） 
没有size属性，clear方法 
不能遍历
```
{
  let weakList=new WeakSet();

  let arg={};

  weakList.add(arg);

  // weakList.add(2); 报错

  console.log('weakList',weakList);
}
```
## Map
Map定义
{
  let map = new Map();
  let arr=['123'];

  map.set(arr,456);

  console.log('map',map,map.get(arr));
}
```
## Map方法
```
{
  let map = new Map([['a',123],['b',456]]);
  console.log('map args',map);
  console.log('size',map.size);
  console.log('delete',map.delete('a'),map);
  console.log('clear',map.clear(),map);
}
```
## WeakMap
WeakMap的元素只能是对象（地址引用） 
没有size属性，clear方法 
不能遍历
```
{
  let weakmap=new WeakMap();

  let o={};
  weakmap.set(o,123);
  console.log(weakmap.get(o));
}
```
### map和Array增删改查对比
```
{

  // 数据结构横向对比，增，查，改，删
  let map = new Map();
  let array = [];
  // 增
  map.set('t',1);
  array.push({t:1}); 

  console.info('map-array',map,array);


  // 查
  let map_exist = map.has('t');
  let array_exist = array.find(item=>item.t); // 返回布尔值
  console.info('map-array-find',map_exist,array_exist); //返回查找内容


  // 改
  map.set('t',2);
  array.forEach(item=>item.t?item.t=2:''); 
  console.info('map-marray-modify',map,array);

  // 删
  map.delete('t');
  let index = array.findIndex(item=>item.t);
  array.splice(index,1);
  console.info('map-marray-del',map,array);

}
```
### set和Array增删改查对比
```
{
  let set = new Set();
  let array = [];
  // 增
  set.add({t:1});
  array.push({t:1}); 

  console.info('set-array',set,array);


  // // 查
  let set_exist = set.has({t:1}); //false
  let array_exist = array.find(item=>item.t); // 返回布尔值
  console.info('set-array-find',set_exist,array_exist); //返回查找内容


  // 改
  set.forEach(item=>item.t?item.t=2:''); 
  array.forEach(item=>item.t?item.t=2:''); 
  console.info('set-marray-modify',set,array);

  // 删
  set.forEach(item=>item.t?set.delete(item):''); 
  let index = array.findIndex(item=>item.t);
  array.splice(index,1);
  console.info('set-marray-del',set,array);

}
```
### set,object,map增删改查对比
```
{
  // map，set,object对比
  let item = {t:1};
  let map = new Map();
  let set = new Set();
  let obj = {}; 
  // 增
  map.set('t',1);
  set.add(item);
  obj['t']=1; 
  console.info('map-set-obj',obj,map,set); 
  // 查
  console.info({
    map_exist:map.has('t'),
    set_exist:set.has(item),
    obj_exist:'t' in obj 
  });
  // 改
  map.set('t',2);
  item.t=2;
  obj['t']=2;
  console.info('map-set-modify',obj,map,set);
   // 删除
   map.delete('t');
   set.delete(item);
   delete obj['t'];
   console.info('map-set-empty',obj,map,set);
}
```
能使用map和set，不使用数组。 
如果对数据唯一性高，优先使用set,放弃object
