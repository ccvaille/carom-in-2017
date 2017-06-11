# 水平居中 
- inline-block + text-align
```
.child {
    display: inline-block;
}
.parent {
    text-align: center;
}
```

- table + margin 
```
.child{
    display: table;
    margin: 0 auto;
}
```

- absolute + transform
```
.parent {
    position: relative;
}
.child {
    position: absolute;
    left: 50px;
    transform: translateX(-50%);
}
```

- flex + justify-content 
```
.parent {
    display: flex;
    justify-content: center;
}
```


# 垂直居中
- table-cell + vertical-align
```
.parent {
    display: table-cell;
    vertical-align: middle;
}
```

- absolute + transform
```
.parent {
    position: relative;
}
.child {
    position: absolute;
    top: 50%;
    transform:translateY(-50%);
}
```

- flex + align-items
```
.parent {
    display: flex;
    align-items : center;
}
```

# 垂直水平居中
- inline-block + text-align + table-cell + vertical-align
```
.parent {
    display: table-cell;
    text-align : center;
    vertical-align: middle;
}
.child {
    display: inline-block;
}
```

- absolute + transform
```
.partent {
    position: relative;
}
.child {
    position: absolute;
    left: 50%:
    top: 50%;
    transform: translate(-50%,-50%);
}
```

- flex + justify-content + align-items
```
.parent {
    display: flex;
    justify-content: center;
    align-items: center;
}
```
