## Http 
- 请求报文
    + 头行
    + 头部
- 响应报文
-  常用 http 方法
    +   GET 从服务器获取一份文档（不包含主体）
    +   POST 向服务器发送需要处理的数据（包含主体）
    +   PUT 将请求的主体部分存储在服务器(包含主体）
    +   DELECT 从服务器上删掉一份文档
- URL 构成
    +  http:// + hostname + :port + pathname 
- 状态码
    + 200 请求成功 ok
    + 301 资源移动 moved permanently
    + 304 未修改，读取缓存数据 not modified
    + 400 请求语法错误 bad request
    + 404 未找到资源 not found
    + 500 服务器内部错误 internal server error

## Ajax
- 通信流程
    + XHR
        * readyState: 0
        * status:
        * responseText:
    + open(): 开启一个请求，还没有发起请求
        * readyState: 1
    + send(): 发起请求
        * readyState: 2
    + 服务器开始返回的时候
        * readyState: 3
    + 服务器结束请求的时候
        * readyState: 4
        * status: 200
        * responseText: <!DOCTYPE HTML>
```
var xhr = new XMLHttpRequest();//创建 XHR 对象
xhr.onreadystatechange = function (callback) { // 处理返回数据
     if(xhr.readyState == 4) {
        if((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
            callback(xhr.responseText);
        } else {
            alert('Request was unsuccessful:' + xhr.status);
        }
     }
}
// 发送请求
xhr.open('get','example.json',true); 
xhr.setRequestHeader('myHeader','myValue');
xhr.send(null);
```

- open 
    + xhr.open(method,url[,async = true])
    + get/post source 默认异步请求
- send 正式发送请求
    + xhr.send(data)
- 请求参数序列化
    +  xhr.open('get','example.json?' + 'name1=value1&name2=value2', true);
- GET 请求
```
var url = 'example.json?' + serialize(formdata);
xhr.open('get',url,true);
xhr.send(null);
```
- 同源策略
    + 两个页面拥有相同的协议，端口， 和主机，那个这两个页面属于同一个源
- 跨域资源访问
    + 不满足同源策略的资源访问，叫跨域资源访问
    +  Frame 代理
    +  JSONP 

## Cookie
- 属性
    +  Name
    +  Value
    +  Domain (作用域)
    +  Path(作用路径)
    +  Expires/Max-Age(失效时间)
    +  Secure(https 协议时生效，默认 false)
- 读取
```
function getcookie() {
    var cookie = {};
    var all =document.cookie;
    if (all === '') return cookie;
    var list = all.split('; ');
    for(var i = 0;i<list.length; i++) {
        var item = list[i];
        var p = item.indexOf('=');
        var name = item.substring(0,p);
        name = decodeURIComponent(name);
        var value = item.substring(p +1);
        value = decodeURIComponent(value);
        cookie[name] = value;
    }
    return cookie;
}
```
- 设置/修改
    +  document.cookie = 'name=value';
```
function setCookie (name,value,expires,path,domain,secure) {
    var cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);
    if(expires) 
        cookie += ';expires=' + expires.toGMTString();
    if (path)
        cookie += ';path=' + path;
    if(domain)
        cookie += ';domain=' + domain;
    if(secure)
        cookie += ';secure=' + secure;
    document.cookie = cookie;
}
```
- 删除
```
function removeCookie(name,path,domain) {
    document.cookie = name + '=' + ';path=' + path + ';domain=' + domain + ';max-age=0'
}
```
- 缺陷
    + 增加流量，每次请求带上 cookie  
    + 安全
    + 大小限制
## storage
- localStorage(默认永久)
- sessionStorage（默认会话时间）
- 作用域
    +  sessionStorage: 窗口 + localStorage
    +  localStorage : 协议+主机名+端口
- 大小
    + 5MB
- 读取
    +  localStorage.name
- 添加、修改
    +  localStorage.name = 'netease'
- 删除
    +  delete localStorage.name
- API
    + 获取键值对数量
        * localStorage.length
    + 读取
        *  localStrorage.getItem('name')
        *  localStorage.key(i)
    + 添加/修改
        *  localStrorage.setItem('name','netease')
    + 删除
        *  localStorage.removeItem('name')
    + 删除所有
        *  localStorage.clear()


















