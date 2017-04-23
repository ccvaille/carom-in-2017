## 私有前缀
- CHROME、SAFARI
    - -WEBKIT-
- FIREFOX
    - -MOZ-
- IE
    - -MS-
- OPERA
    - -O-

# 组合符号
## 空格:必现且有序
- <'FONT-SIZE'> <'FONT-FAMILY'>
- 12PX ARIAL

## &&：必现且无序
- <LENGTH>&&<COLOR>
- 1PX #000

## ||:至少出现一个且无序
- UNDERLINE||OVERLINE||LINE-THROUGH||BLINK

## |：只能出现一个
- <COLOR>|<TRANSPARENT>

## []:整体
- BOLD[THIN||<LENGTH>]

## +:出现一次或多次
- <COLOR-STOP>[,<COLOR-STOP>]+

## ?:可选
- INSET?&&<COLRO>

## {}:最多出现几次，最少出现几次
- <LENGTH>{2,4}

## *:出现零次或多次
- <TIME>[,<TIME>]*

## #:出现一次或多次
- <TIME> #
- 2S,4S

# 选择器
- 标签选择器
    - P {}
- 类选择器:区分大小写
    - .BOX {}  
- ID选择器
    - #BOX {}
- 通配符选择器
    - * {} 
- 属性选择器
    - [DISABLED]{} 
    - [TYPE=BUTTON]{}
    - [CLASS~=SPORTS]{} // CLASS里面包含SPORTS
    - ...
- 伪类选择器
    - A:LINK // 所有链接
    - A:VISITED
    - A:HOVER
    - A:ACTIVE
    - :ENABLED
    - :DISABLED
    - :CHECKED
    - :FIRST-CHILD
    - :LAST-CHILD
    - :NTH-CHILD(EVEN)
    - :NTH-LAST-CHILD{3N+1}
    - :ONLY-CHILD
    - :FIRST-OF-TYPE
    - :LAST-OF-TYPE
    - :NTH-OF-TYPE
    - :NTH-LAST-OF-TYPE
    - ...
- 伪元素选择器
    - ::FIRST-LETTER{}  //第一个字母
    - ::FIRST-LINE{} //第一行
    - ::BEFORE {CONTENT:""}
    - ::AFTER{CONTENT:""}
    - ::SELECTION{}//选中的样式
- 组合选择器
    - 后代选择器：空格
    - 子选择器：>
    - 兄弟选择器：+

- 优先级
    - A 行内 1000
    - B ID 101
    - C CLASS 伪类 属性 1
    - D 标签选择器 伪元素 1

# 文本
- 字体
    - FONT-SIZE: <LENGTH>|<PERCENTAGE>
    - FONT-FAMILY: [<FAMILY-NAME> | <GENERIC-FAMILY>#
        + <GENERIC-FAMILY> = SERIF | SANS-SERIF ~~| CURSIVE | FANTASY | MONOSPACE~~
    - FONT-WEIGHT: NORMAL | BOLDER
    - FONT-STYLE: NORMAL | ITALIC
    - LINE-HEIGHT: NORMAL | <NUMBEL> | <LENGTH> | <PERCENTAGE>
        - LINE-HEIGHT 为 NUMBER 的时候，不计算直接继承
        - LINE-HEIGHT 为 PERCENTAGE 的时候，先计算后继承
    - FONT: [[<FONT-STYLE> || <FONT-WEIGHT>]? || <FONT-SIZE> || [/ <LINE-HEIGHT>]? | ? <FONT-FAMILY>]
        + FONT:ITALIC BOLD 20PX/1.5 ARIAL;
- 对齐
    + TEXT-ALIGN: LEFT | RIGHT | CENTER | JUSTILY
    + VERTICAL-ALIGN: BASELINE | SUB(下标) | SUPER(上标)| TOP(当前行的最高点) | TEXT-TOP(文本最高点) | MIDDLE | BOTTOM | TEXT-BOTTOM | PERCENTAGE(相对于行高而言) | LENGTH(正数表示向上移动NUM)
    + TEXT-INDENT: <LENGTH> | <PERCENTAGE>
        - 1EM 为一个文字
- 格式化
    + WHITE-SPACE: <NORMAL> | <NOWRAP>(不换行) | <PRE> | <PRE-WRAP>(自动换行) | <PRE-LINE>(自动换行)
    + WORD-WRAP: <NORMAL> | <BREAK-WORD> 
    + WORD-BREAK: <NORMAL> | <KEEP-ALL>（只能在半角空格或连字符处换行） | <BREAK-ALL>（允许在单词内换行）

- 文字修饰
    + TEXT-SHADOW: NONE | [<LENGTH>{2,3} && <COLOR>?]#
        * TEXT-SHADOW: 1PX 2PX 3PX(模糊半径) RED;
    + TEXT-DECORATION: NONE | [UNDELINE | LINE-THROUGH | OVERLINE]
    + TEXT-OVERFLOW: CLIP | ELLIPSIS
```
TEXT-OVERFLOW: ELLIPSIS;
OVERFLOW:HIDDEN;
WHITE-SPACE:NOWRAP;
```
    + CURSOR: POINTER | ZOOM-IN | ZOOM-OUT

- 继承
    - COLOR: INHERIT

# 盒模型
- WIDTH
- HEIGHT
- BORDER
- PADDING
    + PADDING: 10PX 20PX 30PX;
    + ==> PADDING-TOP:10PX;
    + ==> PADDING-LEFT,PADDING-RIGHT: 20PX;
    + ==> PADDING-BOTTOM:30PX;
- MARGIN















