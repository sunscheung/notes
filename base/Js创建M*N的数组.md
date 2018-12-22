# 创建数组
## 创建M*N的数组
// new Array
```
function createMnArray(m,n){
	var arr = new Array(m);
	arr.fill(n);
	return arr;
}
```
// 循环
```
function createMnArray(m,n){
  var arr = [];
  for(let i=0;i<m;i++){
   arr.push(n);
  }
  return arr;
}
```
// 递归创建
```
function createMnArray(m, n) {
    var ary = [];
    function aryPush(m, n) {
        if (ary.length == m)return ary; // 递归结束条件
        ary.push(n);
        return aryPush(m, n); // 这里必须要写return，否则输出为undefined
    }
    return (aryPush(m, n))
}
console.log(createMnArray(4, 5));
```
// Es6语法创建
```
function createMnArray(m,n){
  // v指Array.from生成的数组默认值-undefine，i指索引，m-数组长度，n-传进的数组值
  return Array.from({length: m}, (v, i) => n); 
}
var tempArray = createMnArray(4,5); // 创建M*N的数组
```
## 衍生: 随机生成一个长度为n值在[min-max]范围内数组

1. 随机生成长度为n，且值在[min-max]范围内
function getRandomArr(n, min, max) {
    var arr = [];
    for (var i = 0; i < n; i++) {
        var random = Math.floor(Math.random() * (max - min + 1) + min);
        arr.push(random);
    }
    return arr;
}
2. 随机生成长度为n，且值在[0-(n-1)]范围内的无重复数据的有序数组
```
function getRandomArr(n) {
    var arr = Array.from({length:n}, (v, k) => k);
    return arr;
}
```
3. 随机生成长度为n，且值在[min-max]范围内的随机不重复数组,【注意】前提：n<(max-min)
```
function getRandomArr(n, min, max) {
    var arr = [],res = [];
    for(var i=min;i<max;i++){
        arr.push(i);
    }
    for (i=0 ; i <n; i++) {
        var index = parseInt(Math.random()*(arr.length));   
        res.push(arr[index]);
        // 已选用的数，从数组arr中移除， 实现去重复
        arr.splice(index,1);
    }
    return res;
}
```
4. 随机生成长度为n，且值在[min-max]范围内的随机有序数组
```
/*首先生成一个无须且可能有重复数据的数组*/
function getRandomArr(n, min, max) {
    var arr = [];
    for (var i = 0; i < n; i++) {
        var random = Math.floor(Math.random() * (max - min + 1) + min);
        arr.push(random);
    }
    return arr;
}

// 以下为三路快排的方法，可对无序数组进行排序，达到良好的效果
function _quickSortFunc(arr, l, r) {
    if (l >= r) return;
    /*partition*/
    var random = Math.floor(Math.random() * (r - l + 1) + l);
    [arr[l], arr[random]] = [arr[random], arr[l]];
    var v = arr[l];
    var lt = l;  //arr[l+1...lt]<v
    var gt = r + 1;  //arr[gt...r]>v
    var i = l + 1;  //arr[lt+1...i]==v
    while (i < gt) {
        if (arr[i] < v) {
            [arr[i], arr[lt + 1]] = [arr[lt + 1], arr[i]];
            lt++;
            i++;
        } else if (arr[i] > v) {
            [arr[i], arr[gt - 1]] = [arr[gt - 1], arr[i]];
            gt--;
        } else {  //arr[i]==v
            i++;
        }
    }
    [arr[l], arr[lt]] = [arr[lt], arr[l]];
    _quickSortFunc(arr, l, lt - 1);
    _quickSortFunc(arr, gt, r);
}

function quickSortFunc(arr, n) {
    _quickSortFunc(arr, 0, n - 1);
}
// 排序后的数组
quickSortFunc(getRandomArr(20,1,10),200);
```
