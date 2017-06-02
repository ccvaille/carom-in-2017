## create-react-app
- 安装
    +   npm install --global create-react-app
- 运行
    + create-react-app project_name
    + 会新建一个 project_name 的文件夹
    + cd project_name
    + npm start
- Note
    + React 判断一个元素是 HTML 元素还是 React 组件的原则是看第一个字幕是否是大写
    + 作为软件设计的通则，组件的划分要满足高内聚和低耦合
        * 高内聚：逻辑紧密相关的内容放在一个组件里
        * 低耦合：不同组件之间的依赖关系要尽量弱化
    + React 数据： props / state
        * 对外使用 props
        * 对内使用 state
    + React 组件属性的值都是字符串类型，当 props 类型不是 String, 要用 {} 包住 
        * {{ color: "red" }} // 外面是 JSX 语法 ，里面是代表一个对象常量
