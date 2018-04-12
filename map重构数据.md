let tempKey = 'cid';
let tempDatas = [{cid:1,name:'sunscheung'},{cid:2,name:'zhangsan'}];
let newArr = tempDatas.map(
      item => {
          var keyMapData = {};
          keyMapData[tempKey] = item[tempKey]
          return keyMapData;
      }
 ); 
