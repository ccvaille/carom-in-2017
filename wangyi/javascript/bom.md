## bom
- 属性
    +  navigator 浏览器信息
        *   platform
        *   userAgent
    +  location 浏览器定位和导航
        *  assign(url) 载入新 url ,记录浏览历史
        *  replace(url) 载入新 url, 不记录浏览历史
        *  reload() 重载当前页
    +  history 窗口浏览器历史
        *  back()
        *  forward()
        *  go()
    +  screen 屏幕信息
- 方法
    +  alert()
    +  confirm() // return true确认 flase取消
    +  prompt() // return 用户填写内容
    +  open()
    ```
    var w = window.open('http://www.coolfe.com','coolfe','width=400,height=400,status=yes');
    ```
    +  close()
    ```
    setTimeout('w.close();',5000)
    ```
- 事件
    +  load 文档和图片加载完毕
    +  unload 离开当前文档
    +  beforeunload 询问是否确定离开
    +  resize 拖动浏览器窗口大小
    +   scroll 拖动滚动浏览器