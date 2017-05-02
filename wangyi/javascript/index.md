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













