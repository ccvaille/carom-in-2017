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