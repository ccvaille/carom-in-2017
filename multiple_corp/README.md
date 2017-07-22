## 主要技术框架
> [React](https://facebook.github.io/react/) 库,
> [Node.js](https://nodejs.org/)
> and [Redux](https://github.com/reactjs/redux)
> modern web development tools such as [Webpack](http://webpack.github.io/),
> [Babel](http://babeljs.io/),
> [ant.design](https://ant.design/components/),
> 一套高效开发,同步现时代的最新最优实现的方案.


### 目录布局

```
.
├── build                          # 编译目录
├── config                         # 配置文件目录
├── old                            # 后端php用旧架构，前端用react，打包后的文件，需要手动copy文件到旧src/www下
│   └── www
│       ├── admin.workec.com
│       ├── corp.workec.com
│       ├── my.workec.com
│       ├── www.staticec.com
│       └── www.workec.com
├── public                         # biz.staticec.com 后面可以废除了 
│   ├── cdn
│   │   ├── biz
│   │   ├── comm
│   │   ├── my
│   │   └── oms
│   └── font
├── resources                      # 打包后的目录结构
│   ├── offline_package            # 打包系统的文件目录
│   │   ├── dist
│   │   └── src
│   ├── static                     # 1.staticec.com和html.workec.com域名指向此目录
│   │   ├── biz                    # 原biz.workec.com的静态资源文件，后续biz.workec.com只提供数据接口
│   │   └── my                     # 原my.workec.com的静态资源文件，后续my.workec.com只提供数据接口
│   └── views                      # php新架构对应的代码，这里建议php同学把代码迁出去
│       ├── biz
│       ├── errors
│       ├── my
│       └── oms
└── src                            # web前端代码
    ├── admin                      # 企业管理系统代码
    │   ├── security
    │   └── switchboard
    ├── biz                        # admin管理系统代码
    │   └── web
    ├── comm                       # 公共组件
    │   ├── antd
    │   ├── components
    │   ├── dist
    │   ├── ec-antd
    │   ├── libs
    │   ├── public
    │   ├── services
    │   └── utils
    ├── corp                       # 企业管理系统代码
    │   └── switchboard
    ├── demo                       # react+redux演示目录，可以废除了
    │   ├── client
    │   └── server
    ├── dist                       # 可以废掉了
    │   └── public
    ├── local_tools                # 打包用的工具包
    ├── mockdata                   # 可以废掉了
    │   └── my
    ├── my                         # 原my.workec.com迁移后的代码
    │   ├── ecapp
    │   └── work
    ├── oms                        # 原oms.workec.com迁移后的代码
    │   ├── client
    │   └── server
    ├── sta                        # 原sta.workec.com迁移后的代码
    │   ├── client
    │   └── server
    └── www                        # 原www.workec.com迁移后的代码
        ├── helpcenter
        └── security


```

# 快速开始-手动创建的项目


### 本地运行（my_ecapp_dev）

1、使用 fiddler | charles | whistle 代理工具配置host

2、打开命令行工具

```shell
$ git clone git@git.workec.com:web/ec_fe.git
$ cd ec_fe
$ npm install
$ npm run my_ecapp_dev
```
3、打开浏览器，设置代理到（1）中代理工具中的代理地址，访问http://static.workec.com



### 打包（my_ecapp_build）
```shell
$ npm run my_ecapp_build
$ git add *
$ git commit -m "注释"
$ git push
```

# 快速开始-自动化方式

### 新建项目（other）
```
npm run init -- --basepath www/other --entry other  #other为项目名
```

### 运行项目（other）

环境配置参考上面my_ecapp_dev的案例

```
npm run dev -- --ppath src/www/other
```

### 打包项目（other）
```
npm run build -- --config src/www/other/webapck.config.js
```


# DEMO

src/demo目录为创建新项目的目录结构，可以直接复制修改一下就可使用


### 相关项目

  * [ant-design-redux-boilerplate](https://github.com/pandazki/ant-design-redux-boilerplate)

### 相关知识

  * [Getting Started with React.js](http://facebook.github.io/react/)
  * [React.js Questions on StackOverflow](http://stackoverflow.com/questions/tagged/reactjs)
  * [React.js Discussion Board](https://discuss.reactjs.org/)
  * [Redux教程](https://github.com/kenberkeley/redux-simple-tutorial)
  * [Learn ES6](https://babeljs.io/docs/learn-es6/), [ES6 Features](https://github.com/lukehoban/es6features#readme)


# host模版

```
10.0.201.229 www.ecqun.com workec.com www.workec.com ecqun.com www.scrm.com scrm.com
10.0.201.229 cs.ecqun.com cs2.ecqun.com
10.0.201.229 corp.workec.com yy.ecqun.com yy.workec.com
10.0.201.229 zone.ecqun.com zone.workec.com
10.0.201.229 my.ecqun.com my.workec.com
10.0.201.229 agent.ecqun.com agent.workec.com
10.0.201.229 admin.ecqun.com admin.workec.com
10.0.201.229 lite.workec.com
10.0.201.229 api.workec.com
10.0.201.229 jzsms.ecqun.com jzsms.workec.com
10.0.201.229 img.ecqun.com img.workec.com
10.0.201.229 eim.workec.com eim.scrm.com
10.0.201.229 m.workec.com
10.0.201.229 www.10666.com
10.0.201.229 www.35ec.net
10.0.201.229 www.staticec.com
10.0.201.229 fl.workec.com
10.0.201.229 msg.ecqun.com msg2.ecqun.com msgb.ecqun.com
10.0.201.229 mzone.workec.com
10.0.201.229 dl.ecqun.com dl.workec.com
10.0.201.229 biz.workec.com oms.workec.com
10.0.201.229 biz.staticec.com 1.staticec.com html.workec.com
10.0.201.229 eckf.workec.com ecfk.workec.com
127.0.0.1 static.workec.com
```
