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

## box-sizing
- content-box
- border-box: 盒模型的宽高为 width / height

## box-shadow: 不占空间
- 外阴影：box-shadow: 水平偏移 垂直偏移 模糊半径 阴影大小 阴影颜色
- 内阴影：box-shadow: inset 水平偏移 垂直偏移 模糊半径 阴影大小 阴影颜色

## outline：不占空间，在 border 外
- outline：5px solid red;

# background
- background-color
    + 默认值：transparent
- background-image
- background-repeat
- background-attachment
    + scroll
    + fixed
    + local: 背景和内容一起滚动
- background-position
- background-origin:相对于什么位置来定位
    + 默认值： padding-box
- background-clip: 裁剪
    + 默认值：border-box
- background-size: 图片大小
    + cover： 宽度最大
    + contain： 高度最大

## 线性渐变：linear-gradient()
- background-image: linear-gradient(red,blue);
- background: linear-gradient(to top,red,blue);
- background: linear-gradient(to right bottom,red,blue);
- background: linear-gradient(0deg,red,blue); // 从下往上的渐变
- background: linear-gradient(green,red,blue); // 位置：0%,50%,100%
- background: linear-gradient(green,red 20%,blue); // 位置：0%,20%,100%

## 径向渐变：radial-gradient()
>radial-gradient([[<shape> || <size>] [at <position>]?,| at <position>,]?<color-stop>[,<color-stop>]+);
> <size>:
> closest-side：指定径向渐变的半径长度为从圆心到离圆心最近的边；
> closest-corner：指定径向渐变的半径长度为从圆心到离圆心最近的角；
> farthest-side：指定径向渐变的半径长度为从圆心到离圆心最远的边；
> farthest-corner：指定径向渐变的半径长度为从圆心到离圆心最远的角；

- background: radial-gradient(red,blue);// 椭圆渐变
- background: radial-gradient(circle,red,blue);//圆形渐变
- background: radial-gradient(100px 50px,red,blue);// 限定宽高半径
- background: radial-gradient(100px 50px at 0 0,red,blue);// 限定圆心位置

## repeating-
- background: repeating-radial-gradient(100px 50px at 0 0,red,blue);


# position
- relative
- absolute
    + 默认宽度为内容宽度
    + 脱离文档流
    + 参照物为第一个定位祖先 或者是 HTML 元素
- fixed
    + 默认宽度为内容宽度
    + 脱离文档流
    + 参照物为视窗

# float
- 默认宽度为内容宽度
- 半脱离文档流
    + 对元素脱离文档流
    + 对内容，在文档流内
- 向指定方向一直移动
- float 元素在同一文档流

## clear
- 应用于后续元素
- 应用于块级元素
- clearfix
    ```
    .clearfix:after {
        content: ".";
        display: block;
        clear: both;
        height: 0;
        overflow: hidden;
        visibility: hidden;
    }
    .clearfix {zoom: 1;}
    ```

# flex(弹性布局)
- 概念
    + flex container 弹性布局容器
    + flex item 在文档流中的子元素
        * float
        * inline
        * ~孙元素~
    + main axis 排列方向 主轴
    + cross axis 副轴
- 方向
    + flex-direction
        * flex-direction: row(LTR) | row-reverse(RTL) | column(TTB) | column-reverse(BTT)
- 换行
    + flex-wrap
        * flex-wrap: nowrap | wrap | wrap-reverse
- 缩写
    + flex-flow
        * flex-flow: flex-direction | flex-wrap;
- order(相对于主轴第几)
    + order: 0 | num
- 弹性    
    + flex-basis (flex-item 的宽/高)
    + flex-grow (空余空间的分配)
        * flex-basis + flex-grow / sum(flex-grow) * remain(空余部分)
    + flex-shrink（空余部分 负值）
- 缩写
    + flex: flex-grow | flex-shrink | flex-basis  
- 对齐
    + justify-content: flex-start | flex-end | center | space-between | space-around
    + align-items: flex-start | flex-end | center | baseline | stretch(填充整屏)
    + align-self(某个元素）: auto | flex-start | flex-end | center | baseline | stretch
    + align-content(多行元素）: flex-start | flex-end | center | space-between | space-around | stretch
# 布局
- 三行自适应布局
```
    <style>
        header{
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100px;
            background: pink;
        }
        footer {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 100px;
            background: green;
        }
        .body {
            position: absolute;top: 100px;
            bottom: 100px;
            left: 0;
            right: 0;
            background: #eee;
        }
    </style>

    <body>
        <header></header>
        <div class="body"></div>
        <footer></footer>
    </body>
```
- 两列自适应布局
    + 左右浮动
    ```
    <style>
        html,body {
            height: 100%;
        }
        .parent {
            display: flex;
            height: 100%;
        }
        .side {
            width: 200px;
            background: red;
            color: #fff;
        }
        .main {
            flex: 1;
            background: blue;
            color: #fff;
            margin-left: 10px;
        }
    </style>
    <body>
        <div class="parent"> 
        <div class="side">侧栏</div>
        <div class="main">主栏</div>
</body>
    ```
- 三行两列自适应布局
    ```
    <style>
        html, body {
            height: 100%;
        }
        body {
            display: flex;
            flex-flow: column;
        }
        header,footer {
            height: 100px;
            color: #fff;
            background: #000;
        }
        .box {
            display: flex;
            flex: 1;
            width: 600px;
            align-self: center;
        }
        .left{
            width: 200px;
            background: pink;
        }
        .right{
            flex: 1;
            background: green;
            margin-left: 10px;
        }
    </style>
    <body>
        <header>header</header>
        <div class="box">
            <div class="left">
                left
            </div>
            <div class="right">
                right
            </div>
        </div>
        <footer>footer</footer>
    </body>
    ```

# 变形
- transform 
    + transform: none | <transform-function>
- rotate(旋转) 
    + transform: rotate(<angle>)
- translate(移动) 
    + transform: translate(50px)
    + transform：translate(50px,20%)
    + transform: translateX(-50px)
    + transform: translateY(30px)
- scale(缩放)
    + transform: scale(1.2)
    + transform: scale(1,1.2)
    + transform: scaleX(.5)
    + transform: scaleY(1.5)
- skew(倾斜)
    + transform: skew(30deg) //向 X 轴倾斜的角度
    + transform: skew(30deg,35deg)//向 X 轴倾斜的角度, 向 Y 轴倾斜的角度
    + transform: skewX(30deg)
    + transform: skewY(30deg)
- transform: translate(50%) rotate(45deg)
- transform-origin(变形的中心点)
    + 默认值： transform-origin: 50% 50%
    + transform-origin: right 50px 20px; x 轴， y 轴, z 轴
- perspective(人眼离物体的距离)
    + perspective: none | <length>
    + perspective: 500px
    + perspective: 2000px
- **perspective-origin**
- translate3d
    + transform: translate3d(10px,20%,50px)
- scale3d
    + transform: scale3d(1.2,1.2,1)
- rotate3d
    + transform: rotate3d(1,0,0,45deg)
- transform-style(平面效果还是 3D 效果)
    + transform-style: flat | preserve-3d
- backface-visibility (背部是否可见)
    + backface-visibility: visible | hidden









