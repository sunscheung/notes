function createMnArray(m,n){
  return Array.from({length: m}, (v, i) => n); // v指Array.from生成的数组默认值-undefine，i指索引，m-数组长度，n-传进的数组值
}
var tempArray = createMnArray(6,5); // 创建M*N的数组
