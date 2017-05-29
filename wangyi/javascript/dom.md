# DOM
## 节点操作
- 获取节点
    + 父子关系
        *  parentNode
        *  firstChild/lastChild/childNodes
        *  childNodes/children
    + 兄弟关系
        * previousSibling/nextSibling
        * previousElementSibling/nextElementSibling
    + getElementById
    + getElementsByTagName（live)
    + getElementsByClassName(live)
    + querySelector/querySelectorAll
```
// getElementByClassName（_have bug_)
function getElementByClasName(root,className) {
    if (root.getElementsByClassName) {
        return root.getElementsByClassName(className);
    }
    else {
        var elements = root.getElementsByTagName('*');
        var result = [];
        for(var i = 0,element; element = element[i]; i++) {
            if(hasClassName(element,className)){
                result.push(element);
            }
        }
        return result;
    }
}
```

```
function getElementByClassName(element,names){
    if(element.getElementsByClassName){
        return element.getElementsByClassName(names);
    } else {
        var elements = element.getElementsByTagName('*');
        var result = [];
        var element,
            classNameStr,
            flag;
        names = names.split('');
        for(var i = 0; element = element[i]; i++){
            classNameStr = ' ' + element.className + ' ';
            flag = true;
            for(var j = 0, name; name = names[j]; j++){
                if (classNameStr.indexOf(' ' + name + ' ') == -1) {
                    flag = false;
                    break;
                }
            } 
            if(flag) {
                result.push(element);
            }
        }
        return result;
    }
}
```
- 创建
    + document.createElement(name)
- 修改
    +  element.textContent
    +  element.innerText(√)
- 插入
    +  element.appendChild('a')
    +  element.insertBefore(achild,element)
- 删除
    +  element.removeChild(child)
- innerHTML(节点的 HTML 内容)
    - 方便
    - 内存泄露
    - 安全问题 

## 属性操作
- 读
    +  element.className
    +  element['id']
- 写
    +  element.value
    +  element.disabled ='true
- element.getAttribute('class')
- element.setAttribute('disable',true)
- **dateset**
    + 元素上保存数据

## 样式操作
- element.style.color= 'red'
- style.cssText
    + box.style.cssText = 'border:1px solid red;color:green;font-weight:200';
- class
    + element.className += 'new_class_name'
- window.getComputedStyle() // ie 9 不兼容
    + 获取元素实际的样式
    + window.getComputedStyle(box).background;
    + element.currentStyle  // ie 9 兼容

- 实现 getStyle 函数用于获取元素的实际样式













