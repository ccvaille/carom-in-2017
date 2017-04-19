## 新增标签
- article : 独立的，可重复的
- section ：文章中一节，有关联性 
- aside   ：AD，与内容无太大关系

## a
- target = "_self"
- target = "_blank"
- target = "inner"
	<iframe name="inner" frameborder="0"></iframe>

## 强调
- strong 重要性的强调 -> 粗体
- em 语义的强调 -> 斜体

## 引用
- cite
- q
```
	<cite>这里面显示引文（斜体）<q>xxxxx</q></cite>
```

## 代码
- code

## 列表
- ul
- ol
```
<ol type="a" start="2">
	<li></li>
	<li></li>
</ol>
```
- dt
```
<dl>
	<dt></dt>
	<dd></dd>
	<dd></dd>
</dl>
```

## video
- controls
- poster -> 封面
- autoplay
- loop

## 嵌入
- canvas： 性能高、场景复杂，实时展示
- svg： 矢量、高保真、静态

## 热点区域
- map
- area

## table
- caption
- thead
	- tr
	- th
- tbody
	- tr
	- td
-tfoot
	- tr
	- td
- rowspan
- colspan

## form
- input 
	- name
	- placeholder
	- hidden
	- type 
		- email
		- url
		- number
		- tel
		- search
		- range
		- color
		- date picker
- select
	- option
	- optgroup label=""

```
<form action="/login" method="post">
	<input type="file">
	<input type="checkbox">
	<input type="text">
	<input type="radio">
	<input type="submit">
	<input type="reset">
	<button type="submit"></button>
	<button type="reset"></button>
	<select  id="">
		<option value="0"></option>
	</select>
	<label for=""></label>
	<textarea name="" id="" cols="30" rows="10"></textarea>
</form>
```

## ask
- object
- embed