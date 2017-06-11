# Full screen layout
- position
```
parent > top left right bottom
right > inner

html,body, .parent {
    height: 100%;
    overflow: hidden;
}
top {
    position: absolute;
    top: 0;
    left: 0;
    right:0;
    height: 100px;
}
left {
    position: absolute;
    top: 100px;
    left: 0;
    bottom: 50px;
    width: 200px;
}
right {
    position: absolute;
    left: 200px;
    right:0;
    top: 100px;
    bottom: 50px;
}
bottom {
    positon: absolute;
    bottom: 0;
    left: 0;
    right:0;
    height: 50px;
}
.inner {
    min-height： 1000px;
    overflow: auto;
}
```

- flex 
```
.parent > top middle bottom
.middle > left right

html,body, .parent {
    height: 100%;
    overflow: hidden;
}
.parent {
    display: flex;
    flex-direction: column;
}
top {
    height: 100px;
}
bottom {
    height: 50px;
}
.middle {
    flex: 1;
    display: flex;
}
.left {
    width：200px;
}
.right {
    flex:1;
}
```























