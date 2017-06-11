# 多列布局
- 一列定宽，一列自适应   
```
// 缺点： right 里面的元素假如 clear: both ，会导致出错
.left {
    float: left;
    width: 100px;
}
.right {
    margin-left: 120px;
}
```

```
// 缺点： 多一层结构
.left
.right-fix > ,right
.left {
    float: left;
    width: 100px;
    position: relative;
}
.right-fix {
    margin-left: -100px;
    width: 100%;
    float: right;
}
.right {
    margin-left: 120px;
}
```

```
// 缺点： ie6 不支持
.left {
    float: left;
    width: 100px;
    margin-right: 20px;
}
.right {
    overflow: hidden;
}
```

```
// 缺点： 结构多
.box > .left
    > .right

.box {
    display: table;
    width: 100%;
    table-layout: fixed; // 布局优先
}
.left,.right {
    display: table-cell;
}
.left {
    width: 100px;
    padding-right: 20px;  // 不能用 margin
}
```

```
// 缺点： 兼容性
.box {
    display: flex;
}
.left {
    width: 100px;
    margin-right:20px;
}
.right {
    flex: 1;
}
```

# 多列定宽，一列自适应
```
.box > .left
     > .center
     > .right

.left, .center {
    float: left;
    width: 100px;
    margin-right: 20px;
}
.right {
    overflow: hidden;
}
```

## 一列不定宽，一列自适应
- float + overflow
    + ie6 不兼容
    + 
- table
```
// ie6，7 不兼容
.box {
    display: table;
    width: 100%;
}
.left,.right {
    display: table-cell;   
}
.left {
    width: 0.1%;
    padding-right： 20px;
}
```

- flex
    + 兼容性问题


## 等分布局
```
.box > div.column * 4

.box {
    margin-left: -20px;
}
.column {
    float: left;
    width: 25%;
    padding-left: 20px;
    box-sizing: border-box;
}
```

```
.box {
    display: flex;
}
.column {
    flex: 1;
}
.column+.column {
    margin-left: 20px;
}
```

## 等高布局
- table
```
.box > .left
    > .right

.box {
    display: table;
    width: 100%;
    table-layout: fixed; // 布局优先
}
.left,.right {
    display: table-cell;
}
.left {
    width: 100px;
    padding-right: 20px;  // 解决兼容问题 = 或者 border-right:20px solid transparent
    background-clip：content-box；
}
```

- flex 
```
.box {
    display: flex;
}
.left {
    width: 100px;
    margin-right:20px;
}
.right {
    flex: 1;
}
```

- float 
```
.box {
    overflow:hidden;
}
.left,.right {
    padding-bottom: 9999px;
    margin-bottom: -9999px;
}
.left {
    float: left;
    width: 100px;
    margin-right: 20px;
}
.right {
    overflow: hidden;
}
```



