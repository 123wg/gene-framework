# 包说明

```
packages
    |- react-app 基于app的react项目
    |- core 架构核心层
```

## 安装

pnpm

## 启动

pnpm start 启动 react-app 项目

## 打包

## TODO framework
1. core 的打包生成 d.ts 改为用 vite 的插件 dts 实现,根目录的 tsconfig.json 需要修改
2. 隐藏 node_modules
3. 强制末尾加分号

## 增量保存

## 关联更新
1. topo排序方法https://github.com/dagrejs/graphlib/blob/master/README_CN.md#:~:text=E%27%2C%20%27B%27%2C%20%27A%27%20%5D%20%5D-,alg.topsort(graph),-topological%20sorting
2. 深度优先遍历 https://blog.csdn.net/qq_22771739/article/details/104170687
3. calculator收集的输出数据getOutput为 propertyName
4. calculator收集的数据getInput为PropertyId{eleId,propertyName}
5. 监听elementAdd 将数据整理为{v:eleId+input propertyName, w:eleId+output PropertyName}
6. graph实例是new GraphLib.Graph() 调用graph.setEdge设置线
7. 收集后图缓存中的数据 map<eleId, map<output propertyName,calculator>>
8. 如何执行calculator的execute,匹配的过程,找出transaction中所有propertyName,生成propertyIds，根据peopertyIds找下游节点，即去缓存中找calculator，找到后执行更新,例如sketch.polygon=>extrude.SymbolGrep 找到的calculator为extrud额的calculator
9. 几个主要的类 ElementGraph单个ele依赖关系图，ElementsUpdateGraph更新的依赖关系图，ElementsGraph 所有eles的依赖关系图
10. topo排序过程，假设有依赖关系图        h<-b<-a<-c->d->f->g  返回结果为 [c,a,b,h,  d,f,g]  注意:因为c已经参与了排序,不会再次参与

## 视口
1. viewport 初始化用来设置 camera 的偏移决定渲染哪部分,和 layers 决定相机要渲染的层
2. 执行渲染 render 时,执行 renderer 的 setVierport 设置视口,即输出图像在屏幕的位置,因为即使相机设置了偏移,渲染出的图像也可铺满全屏
3. 为啥两块地方的背景不一样，背景也是对象，只需要设置好对应的 layers 就行了,这样不同区域用不同相机，决定了显示哪块背景
4. 两块地方共用一个 scene，内部显示的不用模型等也是通过 layer 控制
5. render 中有很多 scene，在 render 初始化时，扫描 area 列表，创建出不同的 group,group 设置 renderOrder，后续从 grep 获取 area 放进对应的 group 中
6. 旋转控件实现方式,是一个 object3d，使用 renderer 渲染，旋转角度使用球坐标计算,控件自身转动通过更改 quaterion 实现


## GPU拾取
- 准备拾取scene
- 获取所有bufferGeometry数据,改材质，使用顶点着色，将物体id作为color的编码，geometry合并成一个
- camera.setViewOffset 准备相机
- renderer.setRenderTarget 设置渲染目标
- renderer.render 渲染完清除视口偏移
- renderer.readRenderTargetPixels(this.pickTexture,0,0,1,1,pixelBuffer) 读取颜色并解码出mesh的id

## 基于 Request 的 Undo、Redo 实现
1. RequestManager 中包含 SessionStack
2. Session 中可包含多个 Request
   思考:Session 相当于 transactionGroup 的角色,里面可包多个 transaction

    结合一下,将现有的机制只用 Request 实现呢??

    原因 1: 现有的 transaction 机制会绕过监控,不好做自动化测试