# React项目搭建模版

## 模版介绍

需要使用 node 18 以上版本,Vite 5.0 不在支持 node 18 以下版本

使用TS二次封装axios,使用redux-toolkit管理全局状态数据,使用styled-components作为样式解决方案

### 使用的技术栈

1. react 18.2.0
2. typescript 5.2.2
3. vite 5.0.8
4. @reduxjs/toolkit 2.0.1
5. react-redux 9.0.4
6. axios 1.6.2
7. react-router-dom 6.21.0

### 样式解决方案

1. normalize.css 8.0.1
2. styled-components 6.1.1

### 代码规范

1. eslint 8.55.0
2. prettier 3.1.1

### 项目目录结构

assets 静态文件资源

base-ui 二次封装 ui 框架组件

components 通用组件

hooks 封装的 hooks

router 项目路由

service 项目网络请求

store 项目全局状态数据

utils 项目工具

views 项目页面

### 项目启动

复制.env 文件为.env.development.local 文件,并修改其中的环境变量

复制.env 文件为.env.production.local 文件,并修改其中的环境变量

安装依赖

```bash
npm install
```

启动项目

```bash
npm run dev
```

### 项目打包

```bash
npm run build
```

### 代码格式化

```bash
npm run prettier
```
