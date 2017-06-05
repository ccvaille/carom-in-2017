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
    + propTypes: 检查是否正确使用组件的属性
        * babel-react-optimize : 开发环境里面使用，外网自动去除 PropTypes
    ```
    Counter.propTypes = {
        caption: PropTypes.string.isRequired,
        initValue: PropType.number
    }
    ```
    + defaultProps: 默认值
```
    Counter.defaultProps = {
        initValue: 0
    }
```
    + **生命周期**
        * 装载过程（Mount): 组件第一次在 DOM 树中渲染的过程
            - constructor(es6 的构造函数，创造组件类的实例)
                + 初始化 State
                + 绑定成员函数的 this 环境
            ```
            constructor(props) {
            super(props);

            this.clickfun = this.clickfun.bind(this); //绑定成员函数的this环境

            this.state = {
              count: props.initValue, 
              iclick: 'no' // 初始化 State
            }
          }

           clickfun() {
            alert('this is click');
            this.setState({iclick: 'yes'});
            console.log(this.state.iclick) // no : this 是当前函数的当前作用域，需要指定到当前组件实例
          }
            ```
            - getInitialState
                + 用 React.createClass() 创造的组件才会起作用
                + 初始化组件的 this.state
            - getDefaultProps
                + 用 React.createClass() 创造的组件才会起作用
                + 初始化组件的 this.props
            ```
            //createClass 有一个参数，是个对象 {}
            var MobileMsgBoard = React.createClass({ 
                getInitialState: function () {
                    return {
                        getMsgBoardHeight: windowHeight - 50,
                        focusElemOffsetHeight: 0
                    }
                },
                componentDidMount: function() {
                    domUtils.addEvent(window, 'resize', this.onWindowResize);
                }
            })
            ```
            - componentWillMount
                + 可以在服务器端和浏览器端被调用
            - **render**
                + 返回 jsx 描述的结构
            - componentDidMount
                + 可以在浏览器端被调用
        * 更新过程(Update): 组件被重新渲染的过程
            - componentWillReceiveProps
            - **shouldComponentUpdate**
        ```  
        // 值变化才重新 render
        shouldComponentUpdate(nextProps, nextState) {
          // nextProps 这次渲染传入的 props
          // this.props 上一次渲染的 props
          return (nextProps.caption !== this.props.caption) ||
                 (nextState.count !== this.state.count) || 
                 (nextState.iclick !== this.state.iclick)
        }
        ```
            - componentWillUpdate
            - render
            - componentDidUpdate
        * 卸载过程（Unmout): 组件从 DOM 中删除的过程
            - componentWillUnmount
+　other
    *　bind 操作符
    ```
    this.foo = :: this.foo;
    ===
    this.foo = this.foo.bind(this);
    ```
