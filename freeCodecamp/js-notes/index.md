## data types (数据类型)
- undefined（未定义）
- null（空）
- boolean（布尔型）
- string（字符串)
- symbol(符号) 
- number（数字）
- object（对象）

## name (驼峰命名法)
- var someVariable;
- var anotherVariableName;
- var thisVariableNameIsTooLong;

## string[0]
- 通过[索引] 来获得对应的字符。
- 在单词 "Charles" 中索引0上的字符为 "C"，所以在 var firstName = "Charles" 中，你可以使用 firstName[0] 来获得第一个位置上的字符。

## string: 不可变
- 改变字符串的唯一方法是重新给它赋一个值
```
var myStr = "Bob";
myStr[0] = "J";
console.log(myStr[0]) //B
```
```
var myStr = "Bob";
myStr = "Job";
console.log(myStr[0]) //J
```

## string.length
- string[string.length - 1] -> 字符串最后一个字符
- string[string.length - n] -> 字符串最后第 n 个字符