![## 新增标签
- ARTICLE : 独立的，可重复的
- SECTION ：文章中一节，有关联性 
- ASIDE   ：AD，与内容无太大关系

## A
- TARGET = "_SELF"
- TARGET = "_BLANK"
- TARGET = "INNER"
	<IFRAME NAME="INNER" FRAMEBORDER="0"></IFRAME>

## 强调
- STRONG 重要性的强调 -> 粗体
- EM 语义的强调 -> 斜体

## 引用
- CITE
- Q
```
	<CITE>这里面显示引文（斜体）<Q>XXXXX</Q></CITE>
```

## 代码
- CODE

## 列表
- UL
- OL
```
<OL TYPE="A" START="2">
	<LI></LI>
	<LI></LI>
</OL>
```
- DT
```
<DL>
	<DT></DT>
	<DD></DD>
	<DD></DD>
</DL>
```

## VIDEO
- CONTROLS
- POSTER -> 封面
- AUTOPLAY
- LOOP

## 嵌入
- CANVAS： 性能高、场景复杂，实时展示
- SVG： 矢量、高保真、静态

## 热点区域
- MAP
- AREA

## TABLE
- CAPTION
- THEAD
	- TR
	- TH
- TBODY
	- TR
	- TD
-TFOOT
	- TR
	- TD
- ROWSPAN
- COLSPAN

## FORM
- INPUT 
	- NAME
	- PLACEHOLDER
	- HIDDEN
	- TYPE 
		- EMAIL
		- URL
		- NUMBER
		- TEL
		- SEARCH
		- RANGE
		- COLOR
		- DATE PICKER
- SELECT
	- OPTION
	- OPTGROUP LABEL=""

```
<FORM ACTION="/LOGIN" METHOD="POST">
	<INPUT TYPE="FILE">
	<INPUT TYPE="CHECKBOX">
	<INPUT TYPE="TEXT">
	<INPUT TYPE="RADIO">
	<INPUT TYPE="SUBMIT">
	<INPUT TYPE="RESET">
	<BUTTON TYPE="SUBMIT"></BUTTON>
	<BUTTON TYPE="RESET"></BUTTON>
	<SELECT  ID="">
		<OPTION VALUE="0"></OPTION>
	</SELECT>
	<LABEL FOR=""></LABEL>
	<TEXTAREA NAME="" ID="" COLS="30" ROWS="10"></TEXTAREA>
</FORM>
```

## ASK
- OBJECT
- EMBED]()