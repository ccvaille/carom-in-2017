# 类型
- undefined
- null
- boolean
- string
- number : NaN
- object
    + var obj = {}
    + var arr = []
    + var date = new Date()

## 对象类型
- 原生对象
    + 构造函数
    + 对象
        *  Math
        *  Json
        *  全局对象
        *  arguments
- 宿主对象
    +  window
    +  navigator
    +  document
- 浏览器扩展对象
    + XML
    + Debug
    + ActiveXObject

## 原始类型和对象类型区别
- 原始类型
    + 全部存储在栈内存
- 对象类型
    + 只存储一个地址在栈内存
    + 值存在堆类型

## 隐形类型转换
- 加法
    + 数字会隐形转换成字符串
- 减法
    + 字符串会隐形转换成数字
- 点操作
    + 直接量会隐形转换成对应的对象类型
- undefined to number: NaN
- Null to number : 0
- '' to boolean : false
- 'aa' to number : NaN
- NaN to boolean : false
- {} to boolean : true
- {} to number: NaN

## 显性类型转换
- Number()
- String()
- Boolean()
- ParseInt()
- ParseFloat()

## 类型识别
- typeof 操作符
    + 可以识别标准类型（Null 除外）
    + 不能识别具体的对象类型（function 除外）
- instanceof
    + 可以识别内置对象类型
    + 不能识别原始类型
    + 可以识别自定义对象类型
- Object.prototype.toString.call
    + 可以识别标准类型以及内置对象类型
    + 不可以识别自定义对象类型
- constructor
    + 可以识别标准类型（undefined、null 除外）
    + 可以识别内置对象类型
    + 可以识别自定义对象类型

如何复制一个对象？ 


#函数
- 定义
    + 函数声明
        * 函数定义会被前置
        * 重复定义函数，最后一次定义有效
        ```
        function add(a,b) {
            return a + b;
        }
        ```

    + 函数表达式
    ```
    var add = function(a,b) {
        return a + b;
    }
    ```

    + 函数实例化
        * 定义的函数只能访问本地作用域和全局作用域
        ```
        var add = new Function("i","console.log(i + 3)")
        ```
- 代码执行过程
    + 域解析
        * 变量提前解析
    + 执行
- 函数调用
    + 函数调用模式 : add(1)
    + 方法调用模式
    ```
    var myNumber = {
        value: 1,
        add: function(i) {
            console.log(this);
            this.value += i;
        }
    }
    myNumber.add(1)
    ```
    + 构造函数调用模式: new Function()
        * 自定义构造函数名尽量用大写
    + apply(call) 调用模式
    ```
    function Point(x,y) {
        this.x = x;
        this.y = y;
    }
    Point.prototype.move = function(x,y) {
        this.x = x;
        this.y = y;
    }
    var p = new Point(0,0);
    p.move(2,2);
    var circle = {
        x : 1,
        y : 1,
        r : 1
    };
    p.move.apply(circle,[2,1]) // x:3 y:2 r:1
    ```
    
- **函数调用模式的区别 - this** 
    + 函数调用模式
        * this 指向全局对象

        ```
        function add(x,y) {
            console.log(this); // window 全局对象
            var sum = x + y;
            (function(){
                console.log(this); // window 全局对象
                })
            return sum;
        }
        add(1,2)
        ```

    + 方法调用模式 
        * this 指向调用者

        ```
        var  myNumber = {
            value: 1,
            add: function(i) {
                console.log(this); // object 
                this.value += 1;
            }
        }
        myNumber.add(1)
        ```

    + 构造函数调用模式
        *  this 指向被构造的对象
        
        ```
        function Car(type,color) {
            this.type = type;
            this.color = color;
            this.status = "stop";
            this.light = "off";
            console.log(this);
        }
        Car.prototype.start = function(){
            this.start = "driving";
            this.light = "on";
            console.log(this.type + " is " + this.status);
        }
        Car.prototype.stop = function() {
            this.status = "stop";
            this.light = "off";
            console.log(this.type + " is " + this.status);
        }
        var benz = new Car("benz","black")
        ```

    + apply(call)调用模式
        * this 指向第一个参数

- arguments,类数组，是对象
    + arguments[index]
    + arguments.length

- **传参**
    + 按值传递
        *  call by value
    ```
    var count = 1;
    var add = function(num) {
        num += 1;
        return num;
    }
    var ret = add(count);
    console.log(ret,count) // 2,1
    ```
    + 按引用传递
        *  call by reference
    ```
    var count = {
        a: 1,
        b: 2
    }
    var add = function(obj) {
        obj.a += 1;
        obj.b += 1;
        return obj;
    }
    var ret = add(count);
    console.log(ret,count) //Object{a:2,b:3} Object{a:2,b:3}
    ```
    + 按共享传递
        *  call by sharing
    ```
    var count = {
        a: 1,
        b: 2
    }
    var add = function(obj) {
        obj = {
            a: 2,
            b: 3
        }
        return obj;
    }
    var ret = add(count);
    console.log(ret,count) //Object {a: 2, b: 3} Object {a: 1, b: 2}
    ```
> 总结： 原始类型按值传递 对象类型按共享传递

# 闭包
```
(function(){
    var a = 1;
    (function(){
        console.log(a);
        })()
    })();
```
- 作用
    + 保存函数执行状态
    ```
    var arr = ['c','f','h','o'];
    var str = 'ab3djk4kjkk5kfdl8';
    console.log(str);
    var func = (function(){
        var count = 0;
        return function() {
            return arr[count++];
        }
    })();
    str = str.replace(/\d/g,func);
    console.log(str);
    ```
    + 封装
```
    var Car = function(type) {
        var status = 'stop', //  封装不能访问
            light = 'off'; // 封装不能访问
        return {
            type: type,
            start: function(){
                status = "driving";
                light = "on";
            },
            stop: function() {
                status = "stop";
                light = "off";
            },
            getStatus: function(){
                console.log(type + ' is ' + status +' with light ' + light);
            }
        }
    }
    var audi = new Car('audi');
    audi.start();
    audi.getStatus();
    audi.stop();
    audi.getStatus();
```
    + 性能提升
    > 把不需要保存状态的函数放在闭包，可以提升执行性能
    ```
    // 不使用闭包
    function sum(a,b) {
        var add = function(a,b) {
            return a + b;
        }
        return add(a,b)
    }
    var startTime = new Date();
    for(var i = 0; i < 1000000; i++){
        sum(1,1)
    }
    var endTime = new Date();
    console.log(endTime - startTime)
    ```
    ```
    // 使用闭包
    var sum = (function() {
        var add = function(a,b){
            return a + b;
        }
        return function(a,b) {
            add(a,b);
        }
    })()
    var startTime = new Date()
    for(var i = 0; i < 1000000; i++){
        sum(1,1)
    }
    var endTime = new Date();
    console.log(endTime - startTime)
    ```

# First-class function 
- 函数作为参数
    + 异步回调函数
        * ajax
- 函数作为返回值
    + Function.prototype.bind
    ```
    function Point(x,y) {
        this.x = x;
        this.y = y;
    }
    Point.prototype.move = function(x,y) {
        this.x += x;
        this.y += y;
    }
    var p = new Point(0,0);
    var circle = {
        x: 1,
        y: 1,
        r: 1
    };
    p.move.apply(circle,[2,1]);
    ```
   
    ```
    function Point(x,y) {
        this.x = x;
        this.y = y;
    }
    Point.prototype.move = function(x,y) {
        this.x += x;
        this.y += y;
    }
    var p = new Point(0,0);
    var circle = {
        x: 1,
        y: 1,
        r: 1
    };
    var circlemove = p.move.bind(circle,2,1);
    circlemove();
    ```

```
var move = function(x,y) {
    this.x += x;
    this.y += y;
}
var p ={
    x: 1,
    y: 1
};
<!-- var pmove2 = move.bind(p,1,2)
console.log(p); // 1,1 
pmove2()
console.log(p); // 2, 3 -->
var pmove2 = move.bind(p)
console.log(p); // 1,1
pmove2(1,2);
console.log(p) // 2,3
```
  
+ 柯里化
> 柯里化（Currying），又称部分求值（Partial Evaluation），是把接受多个参数的函数变换成接受一个单一参数（最初函数的第一个参数）的函数，并且返回接受余下的参数而且返回结果的新函数的技术
```
var sum = function(a,b,c) {
    return a+b+c;
}
var sum_curry = function(a) {
    return function(b,c) {
        return a+b+c;
    }
}
```

**函数声明和函数表达式定义同一个函数时，执行的是哪个？**
```
// 以下代码执行时，三次打印分别输出什么？为什么？
 
function add1(i){
  console.log("函数声明："+(i+1));
}
add1(1);
 
var add1 = function(i){
  console.log("函数表达式："+(i+10));
}
add1(1);
 
function add1(i) {
    console.log("函数声明："+(i+100));
}
add1(1);
```

**对象方法中定义的子函数，子函数执行时this指向哪里？**
- 以下代码中打印的this是个什么对象？
- 这段代码能否实现使myNumber.value加1的功能？
- 在不放弃helper函数的前提下，有哪些修改方法可以实现正确的功能？
```
var myNumber = {
  value: 1,
  add: function(i){
    var helper = function(i){
        console.log(this);
          this.value += i;
    }
    helper(i);
  }
}
myNumber.add(1);
```
=====
helper中的this指向Window全局变量。
不能。因为this.value是NaN，不是myNumber.value
四种方法：
```
//方法一：把helper调整为方法函数，这样helper就可以正确引用myNumber为this了。
var myNumber = {
                value:1,
                helper:function(i) {
                        console.log(this);
                        this.value +=i;
                },
                add: function(i) {
                    this.helper(i);
                }            
            }
 
//方法二：使用闭包
var myNumber = {
            value: 1,
            add: function(i){
                var thisnew = this;
                // 构建闭包
                var helper = function(i){
                    console.log(thisnew);
                    thisnew.value += i;
                }
               helper(i);
             }
        }
 
//方法三：使用方法调用模式，因为方法调用模式可以使this指向调用者
var myNumber = {
        value: 1,
        add: function(i){
            var helper = function(i){
                console.log(this);
                this.value += i;
            }
            // 新建一个o对象等于myNumber,将helper方法赋值给该对象，
            // 然后使用方法调用模式，这样可以让helper中的this指向调用者o,即myNumber
            var o = myNumber;
            o.fn = helper;
            o.fn(i);
        }
    }
 
//方法四：使用apply（call）调用模式，将当前helper方法借用给myNumber对象使用
var myNumber = {
        value: 1,
        add: function(i){
            var helper = function(i){
                console.log(this);
                this.value += i;
            }
            // myNumber对象借用helper方法，helper中的this将指向myNumber对象
            //helper.apply(myNumber,[i]); //apply方法
            helper.call(myNumber,i);  //call方法
        }
    }
 
        myNumber.add(1);
        console.log(myNumber.value);
```

# 原型
- 类
    + 抽象 - 具体（对象）
- 原型
    + 具体(原型对象) - 具体（新对象）
    + 设置对象的原型
        * Object.create
        ```
        var landRover = {
            name: 'landRover',
            start: function() {
                console.log(' start', this.logo);
            },
            run: function() {
                console.log(' running',this.logo);
            },
            stop: function() {
                console.log(' stop',this.logo);
            }
        }
        var landWind = Object.create(landRover);
        landWind.logo = 'landWind';
        
        var landCruiser = Object.create(landRover);
        landCruiser.logo = 'landCruiser';

        landWind.start();
        ```
        * 构造函数
            - 使用 prototype 设置原型
            - 使用 new 创建对象
```
function Car(logo) {
    this.logo = logo || 'unknown name';
}
Car.prototype = {
    start: function() {
        console.log(' start',this.logo);
    },
    run: function() {
        console.log(' running',this.logo);
    },
    stop: function() {
        console.log(' stop',this.logo);
    }
}
var landRover = new Car('landRover');
var landWind = new Car('landWind');

landRover.start();
```
- 原型链-实例
```
function Car(logo) {
    this.logo = logo || 'unknown name';
}
Car.prototype = {
    start: function() {
        console.log(' start',this.logo);
    },
    run: function() {
        console.log(' running',this.logo);
    },
    stop: function() {
        console.log(' stop',this.logo);
    }
}
function LandRover(serialno) {
    this.serialNumber = serialno;
}

LandRover.prototype = new Car('landRover');

var landRover1 = new LandRover(100000);
var landRover2 = new LandRover(100001);

console.log(landRover1.serialNumber); // 100000
landRover1.serialNumber = 36;
console.log(landRover1.serialNumber); // 36
console.log(landRover2.serialNumber); // 100001
delete landRover1.serialnumber;
console.log(landRover1.serialNumber); // undefined
```
- hasOwnProperty 
    + 判断对象传入属性是否是自身的属性，是返回 true, 反正为 false
```
landRover1.hasOwnProperty('serialNumber'); // true
landRover1.hasOwnProperty('logo'); // false
```

# **变量作用域**
```
var x = 10;
function foo() {
    alert(x);
}
function bar() {
    var x = 20;
    foo();
}
bar();
```
- 静态作用域（词法作用域）
    + 程序的位置决定
- 动态作用域
    + 程序运行时刻决定
    + 栈顶最近变量
- Js 变量作用域
    +  Js 使用静态作用域
    +  Js 没有块级作用域（全局作用域、函数作用域）
- 词法环境
    + 全局环境
    +  foo 环境
    +  bar 环境
- 环境记录初始化（声明提前）
    + 形参
    + 函数体
    + 变量
- 词法环境 - with
```
var foo = 'abc';
with ({
    foo: 'bar'
}) {
        function f() {
            alert (foo);
        };
        (function() {
            alert(foo);
            })();
            f();
    }
```
- 词法环境 - try-catch
```
try {
    var e = 10;
    throw new Error();
} catch (e) {
    function f() {
        alert(e);
    }
    (function() {
        alert(e);
        })();
        f();
}
```
- 在变量作用域中，函数声明和函数表达式有什么区别？


# 闭包
- 允许函数访问其引用环境中的变量（自由变量）
- 保存函数执行状态
```
function add(node) {
    function help(i) {
        return function() {
            alert(i);
        }
    }
    for (var i = 0;i < nodes.length; i++) {
        nodes[i].onclick = help(i);
    }
}
```
- 封装

？原型继承和类继承有什么区别？

## 全局变量
- var a = 'a; 写在最外面的函数
- window.a = 'a'
- (function(){var a; test = 'a'}); 没有写 var

## 继承

实现一个Circle类
编程实现：
a.创建一个圆（Circle）的类，并定义该类的一个属性（半径）和两个方法（周长和面积），其中圆的半径可以通过构造函数初始化
b.创建圆的一个对象，并调用该对象的方法计算圆的周长和面积














