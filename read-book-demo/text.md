- window
    - open(url,name,featrues) // url地址,  新窗口的 name , 新窗口的属性
        ```
            function popUp(winurl) {
                window.open(winurl, 'popup', 'width=320,heigt=480');
            }
        ```

- 平稳退化 渐进增强 向后兼容
    - 浏览器不支持 js 仍能顺利浏览网站
    - 分离 js css html
    - 判断有没有原生方法(对象检测)
    ```
    if(!getElementById) {
        return false;
    }
    ```

- 性能考虑
    - 少访问 DOM : var a = document.getElementById('a');
    - 合并脚本: 减少请求数量
    - 压缩脚本文本：删除不必要的字节

- 结构化程序设计： 函数应该只有一个入口和出口

- innerHTML
    - node.innerHTML = 'xxxx'

- createElement()
    - document.createElement(nodeName)
    - var pDom = document.createElement('p');
- appendChild()
    - parent.appendChild(child)
    - document.body.appendChild(pDom);
- createTextNode()
    - document.createTextNode(text)
    - var pText = document.createTextNode('Hello World');
    - pDom.appendChild(pText)

- insertBefore() // 在当前节点的某个子节点之前再插入一个子节点
    - parentElement.insertBefore(newElement,targetElement)
- ~~insertAfter()~~ // NOT FOUND

- Q: 83/90 p 