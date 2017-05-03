# 基本语法
- 标识符
    + 命名
        * 字母、下划线或 $ 开头
        * 字母、下划线、$ 和数字组成
- 关键字和保留字
    + case 
    + if
    + ……
- 大小写敏感
- 注释
    + // 单行注释
    + /**/ 块级注释
- 基本类型
    + Number 
        * 整数
        * 0377 八进制数
        * 0xff 十六进制数
        * 1.38 浮点数
        * 1.4E2 浮点数
        * NaN
        * Infinity 无穷大
    + String
        * "coolfe"
        * 'coolfe'
    + Boolean
        * true
        * false
    + Object
        * 无序的名值对的集合
    + Null
        * 对象不存在
            - var car = null;
    + Undefined
        * 已声明为赋值的变量
        * 获取对象不存在的属性
- 类型识别
    + typeof
        * typeof null // Objectß
- 原始类型
    + Number
    + String
    + Boolean
    + Undefined
    + Null
- 引用类型
    + Object
- 操作符
    + 一元
        * ++ --
            - a++ //先计算再赋值
            - ++a //先赋值再计算
    + 算术
        * + - * / %
    + 关系
        * > < >= <=
    + 相等
        * == != === !==
        * === 会判断类型
    + **逻辑**
        * ！ && ||
            - console.log(![]) // false
            - console.log(!"") // true
            - [] && "" // ""
            - null && true //null
        * && (var result = true && false)
        > 第一个数为 true ,值为第二个数，第一个数为 false ,值为第一个数
        * || (var result = true || false)
        > 第一个数为 true, 值为第一个数，第一个数为 false , 值为第二个数
    + 赋值
        * ==
        * num = num + 5
        * num += 5
    + 条件
        * ？：
    + 逗号
        * ，
    + 对象操作符
        * new
            - var cat = new Object()
        * delete
            - cat.name = 'abc';
            - delect cat.name;
        * .
        * []
        * instanceof
            - 某个变量是否是某个对象的实例
            ```
            var cat ={name:'coolfe',age:2};
            cat instanceof Object // true
            cat instanceof Number // false
            ```
        * in
        ```
        var cat = {name:"coolfe",age:2};
        'name' in cat // true
        'run' in cat // false
        ```
    + 位操作符（二进制操作）
        * ~
        * &(两个 1 值为 1)
        ```
        var num = 8; // 1000
        num & 4（0100） // 0
        ```
        * |
        * ^
        * <<
        ```
        var num = 2; //0010
        num << 1; // 0100 = 4
        num << 2; // 1000 = 8
        ```
        * >>
        * >>>

## 语句
- 条件语句
```
    if(条件) {语句1} else {语句2}
    switch(表达式) {
        case 值1: 语句
        break;
        …
        default: 语句
    }
```
- 循环语句
```
while(表达式){语句}
do{语句} while(表达式) // 至少执行一次
for(初始化；循环条件；更新表达式){语句}
```
- break
    + 跳出循环体
- continue
    + 跳出循环体，继续执行后面循环
- for(属性名 in 对象) {语句}
- with(表达式){语句} // 指定作用域
- 异常捕获语句
```
try {语句}
catch(exception) {语句}
finally {语句}
```
```
try {document.write(coolfe);}
catch(error) {console.log(error);}
finally {console.log('finally');}
```

## 数值
- Math.abs(x): 绝对值
    + Math.abs(-5) // 5
- Math.round(x): 四舍五入
    + Math.round(1.9) // 2
- Math.ceil(x): 向上取整
    + Math.ceil(1.9) // 2
    + Math.ceil(1.1) // 2
- Math.floor(x): 向下取整
    + Math.floor(1.1) // 1
    + Math.floor(1.9) // 1
- Math.max(): 获取最大值
    + Math.max(1,2) // 2
- Math.min()
- Math.random(): [0,1) 随机数
- parseInt(string,radix): 转换整形，radix 代表几进制数
    + parseInt('1b2.4') // 1 
    > 非数字后面都会忽略
    + parseInt('www') // NaN
- parseFloat(string)
    + parseFloat('100.1') // 100.1
    + parseFloat('12.4b5') // 12.4
    + parseFloat('www') // NaN
- Number(value)
    > 有一个不是数字的直接输出 NaN
    + Number('100.1') // 100.1
    + Number('12.4d8') // NaN
- num.toFixed(digits) //保留多少位小数
    + (100.235665).toFixed(2) //100.24
- 如何获取一个大于等于0且小于等于9的随机整数？
```
Math.floor(Math.random()*10)
```

## 字符串
- string.charAt(index)： 获取字符串的索引值的值
    + ('coolfe').charAt(5) // 'e'
- string.indexOf(value): 获取符合字符串第一次出现的位置
    + ('coolefe').indexOf('fe') // 5
    + ('coolefe').indexOf('a') // -1
- string.search(regexp)
    + ('coolfe36').search(/[0-9]/) // 6
    + ('coolfe36').search(/[A-Z]/) // -1
    + 







