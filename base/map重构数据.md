> 已知键名变量，过滤出该键名的新数组，只包含该键名
```
let tempKey = 'cid';
let tempDatas = [{cid:1,name:'sunscheung'},{cid:2,name:'zhangsan'}];
let newArr = tempDatas.map(
      item => {
          var keyMapData = {};
          keyMapData[tempKey] = item[tempKey]
          return keyMapData;
      }
 ); 
```
