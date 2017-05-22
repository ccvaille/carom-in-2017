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
    var str = ['ab3djk4kjkk5kfdl8'];
    console.log(str);
    var func = (function(){
        var count = 0;
        return function() {
            return arr[acount++];
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


















