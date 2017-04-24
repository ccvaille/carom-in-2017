## 对象 && 数组
- 数组是通过索引来访问和修改数据
- 对象是通过属性来访问和修改数据
```
var ourDog = {
  "name": "Camper",
  "legs": 4,
  "tails": 1,
  "friends": ["everything!"]
};
```

## 访问对象
- .
- []
    - 属性里面有空格，只能用[""]
    - 通过变量来访问属性，只能用[]
    ```
    var someProp = "propName";
    var myObj = {
      propName: "Some Value"
    }
    myObj[someProp]; // "Some Value"
    ```