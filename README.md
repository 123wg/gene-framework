# 包说明
```
packages
    |- react-app 基于app的react项目
    |- core 架构核心层
```

## 安装
pnpm

## 启动
pnpm start 启动react-app项目

## 打包


## TODO
1. core的打包生成d.ts 改为用vite的插件dts实现,根目录的tsconfig.json需要修改
2. 隐藏node_modules
3. 强制末尾加分号

## 视口
1. viewport初始化用来设置camera的偏移决定渲染哪部分,和layers决定相机要渲染的层
2. 执行渲染render时,执行renderer的setVierport设置视口,即输出图像在屏幕的位置,因为即使相机设置了偏移,渲染出的图像也可铺满全屏
3. 为啥两块地方的背景不一样，背景也是对象，只需要设置好对应的layers就行了,这样不同区域用不同相机，决定了显示哪块背景
4. 两块地方共用一个scene，内部显示的不用模型等也是通过layer控制
5. render中有很多scene，在render初始化时，扫描area列表，创建出不同的group,group设置renderOrder，后续从grep获取area放进对应的group中