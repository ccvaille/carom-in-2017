###  事件流
- window - document - html - body - div

### 事件注册
- eventTarget.addEventListener(type,listener[,useCapture])
```
box.addEventListener('click',clickfun,true);
box.onclick = clickfun;
```

### 取消事件注册
- eventTarget.removeEventListener(type,listener[,useCapture])
```
box.removeEventListener('click',clickfun,true);
box.onclick = null;
```

### 事件触发
- eventTartget.dispatchEvent(type)


## 事件对象
- 兼容
```
var name = function(event){
    event = event || window.event;
}

```
- 方法
    +  stopPropagation(阻止事件传播到父节点)（w3c)
        *  event.cancelBubble = true (ie)
    +  stopImmediatePropagation
        *  注册两个事件，会阻止后续事件执行
    +  preventDefault（默认行为)（w3c)
        *  event.returnValue = false(ie)

## 事件分类（不标明不冒泡，默认为冒泡）
- Event(不冒泡)
    + load 
        * 加载完成
    + unload
        *  window 退出，关闭页面
    + error
    + select
        *  input textarea 被选择
    + abort
        *  img 在加载中，按下了 esc 键
- UIEvent(继承 Event)
    + resize
    + scroll
        * document 上面滚动 没有冒泡
        * 元素上面滚动 会有冒泡
- FocusEvent(继承 UIEvent)
    + blur (不冒泡)
    + focus（不冒泡）
    + focusin
    + focusout
- InputEvent(继承 UIEvent)
    + beforeinput
    + input
- KeyboardEvent(继承 UIEvent)
    + keydown
    + keyup
- MouseEvent(继承 UIEvent)
    + click
        * 默认： focus/activation
    + dblclick（双击）
        * 默认： focus/activation/select
    + mousedown（鼠标按下）
        * 默认: drag/scroll/text selection
    + mouseenter（进入元素）(不冒泡)
    + mouseleave（离开元素）(不冒泡)
    + mousemove（鼠标移动）
    + mouseout（鼠标离开）
    + mouseover（鼠标离开）
    + mouseup（鼠标松开）
- WheelEvent(继承 MouseEvent)
    + wheel
        *  deltaMode
        *  deltaX
        *  deltaY
        *  deltaZ

## MouseEvent
- 属性
    +  clientX,clientY(离页面的 x,y)
    +  screenX,screenY（离屏幕的 x,y)
    +  ctrlKey,shiftKey,altKey
    +  button(0,1,2)
- 顺序
    + 从元素 A 上方移过
    +  mousemove - mouseover(A) - mouseenter(A) - mousemove(A) - mouseout(A) - mouseleave(A)
    +  点击元素
    + mousedown - [mousemove] - mouseup - click
- 拖拽效果


## 事件代理
> 将事件注册到元素的父节点上















