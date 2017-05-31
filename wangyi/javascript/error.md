- null == false // false
- new String('123') == new String('123') // false
- "1"-null+true // 2
- typeof([]) // object
```
var x=10;
function foo(){
alert(x);
}
function bar(){
var x=20;
foo();
}
bar(); // 10
```

```
var obj = Object.create({a:1});
obj.hasOwnProperty('a') // false
```

- 使用new Function()创建的函数代码中的this是全局对象 // √

```
var a = 0;
var b = false||a++;
```

```
var a = 6;
function test() {
    var a = 7;
    function again() {
        var a = 8;
        alert(a);
    }
    again();
    alert(a);
}
test();
alert(a);
```

```
var obj = {}, count = 0;
function logArray(value, index, array) {
count++;
obj[count] = value;
}
[1, 2, , 4].forEach(logArray);
```

- 实现type函数用于识别标准类型和内置对象类型，语法如下：
var t = type(obj);
使用举例如下：
var t = type(1) // t==="number"
var t = type(new Number(1)) // t==="number"
var t = type("abc") // t==="string"
var t = type(new String("abc")) // t==="string"
var t = type(true) // t==="boolean"
var t = type(undefined) // t==="undefined"
var t = type(null) // t==="null"
var t = type({}) // t==="object"
var t = type([]) // t==="array"
var t = type(new Date) // t==="date"
var t = type(/\d/) // t==="regexp"
var t = type(function(){}) // t==="function"
```
function type(obj){    return  Object.prototype.toString.call(obj).slice(8, -1).toLowerCase()
}
```

- ES5中定义的Object.create(proto)方法，会创建并返回一个新的对象，这个新的对象以传入的proto对象为原型。
语法如下：
    Object.create(proto)  （注：第二个参数忽略）
        proto —— 作为新创建对象的原型对象
使用示例如下：
    var a = Object.create({x: 1, y: 2});
    alert(a.x);
Object.create在某些浏览器没有支持，请给出Object.create的兼容实现。
```
Object.prototype.create = function(obj) {  
    if(Object.prototype.create){
        return Object.prototype.create  
    }
    else{
        function F(){  
        F.prototype = obj;  
          return new F();
        }
      }
}
```

-高版本的firefox,chrome及ie10以上的浏览器实现了Function.prototype.bind方法，bind方法调用语法为：
functionObj.bind(thisArg[, arg1[, arg2[, ...]]])
使用范例参考如下:
function move(x, y) {
    this.x += x;
    this.y += y;
}
var point = {x:1, y:2};
var pointmove = move.bind(point, 2, 2);
pointmove(); // {x:3, y:4}
但是低版本浏览器中并未提供该方法，请给出兼容低版本浏览器的bind方法的代码实现。
```
Function.prototype.bind= function(obj){
    var ab = this, args = arguments;
    return function() {
        ab.apply(obj, Array.prototype.slice.call(args, 1));
    }
}
```

-函数formatDate用于将日期对象转换成指定格式的字符串，语法如下：
    var str = formatDate(date, pattern);
    其中pattern的全格式为"yyyy-MM-dd HH:mm:ss"
使用范例如下：
    var date = new Date(2001, 8, 11, 8, 26, 8);
    formatDate(date, "yyyy");       返回值： "2001"
    formatDate(date, "yyyy-MM-dd");     返回值： "2001-09-11"
    formatDate(date, "yyyy-MM-dd HH");      返回值： "2001-09-11 08"
    formatDate(date, "yyyy-MM-dd HH:mm:ss");    返回值： "2001-09-11 08:26:08"
请写出函数formatDate的实现代码。
```
function formatDate (date,pattern) {
pattern=pattern.replace(/yyyy/,date.getFullYear());
pattern=pattern.replace(/MM/,date.getMonth()+ 1);
pattern=pattern.replace(/dd/,date.getDate());
pattern=pattern.replace(/HH/,date.getHours());
pattern=pattern.replace(/mm/,date.getMinutes());
pattern=pattern.replace(/ss/,date.getSeconds());
return pattern;
}
```