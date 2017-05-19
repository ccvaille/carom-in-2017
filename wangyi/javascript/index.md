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
- string.search(regexp)// 返回索引位置
    + ('coolfe36').search(/[0-9]/) // 6
    + ('coolfe36').search(/[A-Z]/) // -1
- string.match(regexp)// 返回匹配的值，值为数组
    + ('coolfe36').match(/[0-9]/) // ["3", index: 6, input: "coolfe36"]
    + ('coolfe36').match(/[0-9]/g) // ["3", "6"] (全局查找)
    + ('coolfe36').match(/[A-Z]/g) // null
- string.replace() // 替换
    + ('coolfe').replace('c','dd') // ddoolfe
- *string.substring(indexA[,indexB])* // 截取起始位置和结束位置， 包含 indexA, 不包含 indexB 
    + ('coolfe').substring(0,2) // co
    + ('coolfe').substring(2) // olfe
- *string.slice(begin[,end])* // 截取起始位置和结束位置
    + ('coolfe').slice(1,-1) // -1 为倒数第一个 => 00lf
- string.substr(start[,length]) // 截取长度的字符串
    + ('coolfe').substr(2,3) // olf
    + ('coolfe').substr(2) // olfe
- string.split(分隔符)
    + ('coolfe coolfe').split(" ") // ["coolfe","coolfe"]
- string.toLowerCase() // 变小写
- string.toUpperCase() // 变大写
- String(163) // '163'
- 想要去除一个字符串的第一个字符，有哪些方法可以实现?
```
('coolfe').slice(1)
('coolfe').substring(1)
('coolfe').substr(1)
```


## 对象
- 创建
    + new Object()
    + {}
- 属性和方法
```
var car = {
    color: "red", // 属性
    run: function() { // 方法
        console.log("run");
    }
};
car.color;
car.run();
car["color"];
car["run"]();
```
- 修改属性和方法
```
car.color = "yellow";
```
- 删除属性和方法
```
delect car.color;
car.color; // undefined;
```
- 构建
    + obj.constructor
    ```
    var num = new Number(123);
    num.constructor; // Number
    ```
- obj.toString()
- obj.valueOf() // 获取对象的原始值
- obj.hasOwnproperty() // 是否拥有属性 

## 数组
- 创建
    + new Array()
    + []
```
var students = [
    {id:1,score:80},
    {id:2,score:60},
    {id:3,score:80},
]
```
- arr.length
- arr[index] // 获取
- students[1].id = 4;
- arr.indexOf()
- arr.forEach(callback)
- 原来的数组改变了
    + arr.reverse() // 倒序
    + arr.sort(a,b)
    > 若 a 小于 b，在排序后的数组中 a 应该出现在 b 之前，则返回一个小于 0 的值。
    > 若 a 等于 b，则返回 0。
    > 若 a 大于 b，则返回一个大于 0 的值。
    + arr.push()
    + arr.unshift()
    + arr.shirft()
    + arr.pop()
    + *arr.splice(index,howmany[,插入元素])*
        * 删除
        * 添加
        * 替换
- 原来的数组不改变
    + arr.slice(begin[,end]) // 返回包含 begin 不包含 end 的数组
    + arr.concat()
    + arr.join()
        * arr.join(";")
    + *arr.map()*
    + arr.reduce(pre,index[,init])
    ```
    var scores = [20,30,40,50,60];
    var sum = function(pre,item){
            return pre + item;
        }
        console.log(scores.reduce(sum,20)) // 220
    ```
- 对一个数组（每项都是数值）求和，有哪些方法？
```
    var arr = [10,20,30,40,50];
    var sum = arr.reduce(function(pre,index){
        return pre + index;
    })
    var sum1 = 0;
    for(var i = 0; i < arr.length; i++) {
        sum1 = sum1 + arr[i];
    }
    console.log(sum,sum1)
```

# 函数 
```
function name(形参) {
    执行代码
}
name(实参)
```
- 函数定义
    + 函数声明
    ```
    function name() {

    }
    ```
    + 函数表达式
    > 匿名函数赋给一个变量
    ```
    var name = function() {

    }
    ```
- 形参 & 实参
    + 实参个数比形参少，最后一个形参默认为 undefined;
    + 实参个数比形参多，需要取 arguments.length
    ```
    function add() {
        var length = arguments.length;
        var sum = 0;
        var items;
        for(var i = 0; i < length; i++)
        {
            items = arguments[i];
            sum += items;
        }
        console.log(sum);

    }
    add(1,2,3);
    add(1,3);
    add(1);
    ```
    + 原始类型 - 值传递
    + 对象类型 - 引用传递 
- 作用域（变量起作用的范围）
- 作为对象属性
```
var point = {
    x: 1,
    y: 2,
    move: function(stepX,stepY){
        point.x += stepX; // this.x += stepX;
        point.y += stepY;
    }
};
point.move(2,1)
```

## 构造函数
```
function Point(x,y) {
    this.x = x;
    this.y = y;
    this.move = function(stepX, stepY) {
        this.x += stepX;
        this.y += stepY;
    }
}
var point = new Point(1,1);// {x:1,y:1,move:function(stepX,stepY){}}
var point1 = new Point(2,2);// {x:2,y:2,move:function(stepX,stepY){}}
```

## 原型
```
function Point(x,y) {
    this.x = x;
    this.y = y;
}
Point.prototype.move = function(stepX, stepY) {
    this.x += stepX;
    this.y += stepY;
};
var point = new Point(1,1); // {x:1,y:1}
```

## Date
- new Date(year,month[,day,minutes,seconds]) // 当前时间,月份从 0 开始
- new Date(2017,5,6); // Tue Jun 06 2017 00:00:00 GMT+0800 (CST)
- new Date(1927,2) // Tue Mar 01 1927 00:00:00 GMT+0800 (CST)
- new Date(1993,1,0) // Sun Jan 31 1993 00:00:00 GMT+0800 (CST)
```
var date = new Date(1993,0,30);
date.getFullYear()
date.getMonth()
date.getDate()
date.getHours()
date.getMinutes()
date.getSeconds()
```
- 格式化
```
var date = new Date(2015,0,1,14,34,5)
function padding(num) {
    return num < 10 ? '0' + num : ' ' + num;
}
function format(date) {
    return date.getFullYear() + '-' 
    + padding(date.getMonth() + 1) + '-'
    + padding(date.getDate()) + ' ' 
    + padding(date.getHours()) + ':'
    + padding(date.getMinutes()) + ':'
    + padding(date.getSeconds());
}
format(date) // "2015-01-01  14: 34:05"
```
- 修改日期
```
date.setFullYear(2036)
date.setMonth(2)
date.setDate(6)
date.setHours(12)
date.setMinutes(2)
date.setSeconds(36)
```
- 求天数
```
function getDays(year,month) {
    var date = new Date(year,month,0);
    return date.getDate();
}
```


## RegExp(描述字符串规则的表达式)
- /pattern/attrs
- new RegExp(pattern,attrs)
- regexObj.test(str) // 指定字符串与正则表达式是否匹配
- 锚点
    + 匹配一个位置
        * ^ 起始位置 (/^https/).test('http://') // false
        * $ 结尾位置
        * \b 单词边界 
            - /\bis\b/.test('this') // false
            - /\bis\b/.test('that is tom') // ture
- 字符类
    + 匹配一类字符的一个
        * [0-9]: 一个数字
        * [a-z]：一个字母
        * [^0-9]： 非数字
        * . : 任一字符（除换行外）
- 元字符
    + 具有特殊意义的字符
    + ^ , $ , \b,
    + \d: [0-9]
    + \D: [^\d]
    + \s: 空白符
    + \S：[^\s]
    + \w: [A-Za-z0-9]
- 量词
    + 出现的次数
    + {m,n}: m 到 n 次
    + * : {0, 无穷}
    + ？: {0,1}
    + + : {1, 无穷}
匹配手机号码的正则是什么？
/^1\d{10}$/
- 转义符
    + \.
    + \/
