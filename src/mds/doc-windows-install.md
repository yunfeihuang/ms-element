# Windows 搭建项目环境
### step1: 安装node
到[Node官网](https://nodejs.org/)下载node稳定版本（LTS）安装包并运行安装

### step2: 执行以下命令行安装cnpm
```
npm install -g cnpm --registry=https://registry.npm.taobao.org // 安装cnpm工具并设置淘宝镜像（淘宝镜像国内访问速度快）
```

### step3: 拉取项目代码后用命令行切至当前项目目录下执行以下命令行
```
cnpm install // 使用淘宝镜像安装项目环境, 后面发现有控制台显示没有安装的包也可以使用此命令
```

### step4：项目启动,切至当前项目目录下执行以下命令行
```
  npm start // or npm run dev  启动完成后可以到控制台看到访问项目地址
```