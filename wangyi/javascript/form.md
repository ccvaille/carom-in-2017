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









