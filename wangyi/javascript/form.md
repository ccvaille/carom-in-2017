## form
- <fieldset>
```
<fieldset>
    <legend>披萨大小</legend>
    <label><input type="radio" name="size">小</label>
    <label><input type="radio" name="size">中</label>
    <label><input type="radio" name="size">大</label>
</fieldset>
```

- autocomplete
    + on
    + off
- elements(动态节点集合)
    +  form 下的子孙表单控件 不包括图片按钮
    +  归属于该表单的表单控件 不包括图片按钮
- length
    + elements.length
- form[name]
    + return id || name 为指定名称的表单控件(除图片按钮)
    + 如果为 空， return 指定名称的 img 元素
```
<form action="" name="test" id="test"> 
    <img src="http://freecodecamp.cn/images/logo-navbar.png" alt="" id="a">
    <input type="text" name="a">
 </form>

 var form = document.getElementById('test');
 console.log(form['a']);   //<input type="text" name="a">
 //<img src="http://freecodecamp.cn/images/logo-navbar.png" alt="" id="a">
```
    + 多个同名元素， return 动态节点集合
    + 用过指定名称取过该元素，无论 id / name 变化，都可以获取该元素
- reset()
    + input
    + keygen
    + select
    + textarea
    

## label
- htmlFor
    + 关联表单控件激活行为
        *  button
        *  input
        *  select
        *  textarea
- control
    + 指定了 for 属性，则关联对应元素
    + 没有指定 for 属性，则关联第一个子孙元素
- form
    + 关联归属表单
        *  button
        *  input
        *  select
        *  textarea
    + 只读属性，不可修改
```
label.setAttribute('form','idname') // error
```


## input
- type
    + 默认为 text
- 本地图片预览
    + onchange
    + accept
    + multiple
    + files

## select
- <optgroup>
```
<select name="course" id="">
        <option value="">课程名称</option>
        <optgroup label="1.Dom">
            <option value="1.1">1.1</option>
        </optgroup>
        <optgroup label="2.Dom">
            <option value="2.1">2.1</option>
        </optgroup>
    </select>
```
- value 选中的值
- multiple 多选
- selectedOptions 选中集合
- selectIndex 第一个选中的索引值，未选中任何 return -1；
- add(ele[,before])
- remove([index])
- optgroup
    + disabled
    + label
- option
    + value
    + text
    + index
    + selected
    + deaultSelected
- 创建
    +  document.createElement('option') == new Option()
    +  new Option([text[,value]])
        *  new Option('1.2 节点操作'，‘1.2)
- 删除
    +  removeChild
    +  select.remove
- 级联下拉选择器
    +  onchange
    + remove
    + add

## textarea
- select() //全选输入内容
- selectionStart // 选中内容的起始位置，没有选中文本， return 光标位置
- selectionEnd
- selectionDirection // 选择的方向 （shift+ up/left/... = forward = selectionEnd)(shift+ up/left/... = backward = selectionStart)
- setSelectionRange(start,end) //选择
- setRangeText(replacement) // 设置范围
- @输入提醒
```
textarea.addEventListener('input',function(event){
    var target = event.target,
        cursor = target.selectionStart;
        if(target.value.charAt(cursor-1)==='@')
        doShowAtList(function(name){
            var end = cursor+name.length;
            target.setRangeText(name,cursor,end,'end');
            });
    })
```


# 验证
- 不验证
    + input && type  = hidden、reset、button
    + button && type = rest、button
    + input/textarea && readonly
    + disabled
- 自定义异常
```
input.addEventListener('invalid',function(event){
    var target = event.target;
    if(target.validity.valueMissing) {
        target.setCustomValidity('请输入姓名！')
    }
    })
```
- 禁止验证(novalidate)
```
    <form novalidate>
    <label for=""><input type="number"></label>
    </form>
```

## 提交
- 隐式提交
    + enter 提交
    + form 有非禁用的提交按钮
    + 没有提交按钮，不超过一个类型为 text,search，email,password,date,time,number 的input 元素
- 特殊案例
    + name='isindex' && type = 'text'
        * 编码方式为 application/x-www.form-urlencoded
        * 作为表单的第一个提交元素
        * 提交时只发送 value 值，不包含 name
    +  name = '_charset_' && type='hidden'
        *  没有设置 value 值
        *  提交时 value 自动用当前提交的字符集填充（UTF-8)
- submit()
    + form.submit()
- onsubmit
    + 表单提交事件
    + 提交之前的数据验证
    + 阻止事件的默认行为可取消表单提交
- 无刷新表单提交
    + form
    + target
    + iframe
    + iframe.name = 'targetFrame';form.target = 'targetFrame'

## 登录框
```
<form action="/api/login" name="loginForm" target='result' autocomplete='off'>
    <legend>手机号码登录</legend>
    <fieldset>
    <div id="message"></div>
    <div>
        <label for="telephone">手机号：</label>
        <input type="tel" id="telephone" name="telephone" maxlength="11" required pattern="^0?(13[0-9]|15[0123456789]|18[0236789]|14[57])[0-9]{8}$"><br/>
        <span>11位数字手机号码</span>
    </div>
    <div>
        <label for="password">密码</label>
        <input type="password" for="password" name="password"><br/>
        <span>至少6位，同时包含数字和字母</span>
    </div>
    <div>
        <button name="loginBtn">登录</button>
    </div>
    </fieldset>
</form>
```

```
function disableSubmit(disabled) {
    form.loginBtn.disabled = !!disabled;
    var method = !disabled?'remove':'add';
    form.loginBtn.classList[method]('j-disabled');
}
```

```
form.telephone.addEventListener('invalid',function(event){
    event.preventDefault();
    invalidInput(form.telephone,'请输入正确的手机号码')
})
```




