> 利用for of遍历对象数组，通过索引取值的误解
1. number类型和object类型并非可迭代的类型（原型中无symbol属性），只有数组和字符串可以解构 
2. for of 中的数组其实是Array.values()【数组每一项对应的值，而不是一个map，需要进行Array.entries()转换为map或者 `new Map(arra.map((item,i) => [i,item]))`

```let datas = [{id:1,values:'[1,1]'},{id:2,values:'2,2'}];
for(let [key,oneData] of datas.entries()){
       if(oneData.values){ 
             if(Object.prototype.toString.call(oneData.values)==='[object Array]'){
                    datas[key].values = oneData.values;
              }else{
                     datas[key].values = oneData.values.split(",");
              }
        }
 }
