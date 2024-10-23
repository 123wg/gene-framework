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

## 安装依赖

pnpm add dependency -w

pnpm add dependency -F package-name

## 打包

## 显示层设计
### 显示层绑定在Model中
1.model层定义显示对象提供的数据格式 例:当前的GRep用法
2.优点:在定义Model时可直接写出显示层数据
3.缺点:需要数学库支持,像konva库,需要提供中间层的数据转换
4.与model关联方式:渲染对象中包含model的id

### 显示层单独处理,包含Model的引用
1.显示层单独拆包
2.显示对象抽象为Graphic,提供compute接口,直接计算出渲染数据
3.优点:和model隔离性好,缺点:独立
4.与model的关联方式,渲染对象中包含model对象
5.初始化时加载一次所有的,model_view中监听对象增删改,增加和修改,执行compute 添加进去，删除，根据id删除掉当前的

## Request
1.Request的设计需要考虑脚本录制
2.拖拽的连续更新,当前是在一个request的receive方法中包了transaction处理,request取消时,对整个transactionGroup执行rollBack


## TODO framework

1. core 的打包生成 d.ts 改为用 vite 的插件 dts 实现,根目录的 tsconfig.json 需要修改
2. 隐藏 node_modules
3. 强制末尾加分号

## 增量保存

1. transaction_mgr 中保存上一次保存的 transaction
2. doc.dumpIncrement 时,根据保存的 transaction 向后找增量的 transaction
3. 从增量 transaction 的 undoredo_entity 中获取 add、del、modified 数据,整理成数组，单独保存
4. 显示增量文件,从获取的文件往前找，知道属性中没有标记需要增量文件的,停止,将后面的增量数据往前合并，整合后执行全量加载文件方法

## 关联更新

1. topo 排序方法https://github.com/dagrejs/graphlib/blob/master/README_CN.md#:~:text=E%27%2C%20%27B%27%2C%20%27A%27%20%5D%20%5D-,alg.topsort(graph),-topological%20sorting
2. 深度优先遍历 https://blog.csdn.net/qq_22771739/article/details/104170687
3. calculator 收集的输出数据 getOutput 为 propertyName
4. calculator 收集的数据 getInput 为 PropertyId{eleId,propertyName}
5. 监听 elementAdd 将数据整理为{v:eleId+input propertyName, w:eleId+output PropertyName}
6. graph 实例是 new GraphLib.Graph() 调用 graph.setEdge 设置线
7. 收集后图缓存中的数据 map<eleId, map<output propertyName,calculator>>
8. 如何执行 calculator 的 execute,匹配的过程,找出 transaction 中所有 propertyName,生成 propertyIds，根据 peopertyIds 找下游节点，即去缓存中找 calculator，找到后执行更新,例如 sketch.polygon=>extrude.SymbolGrep 找到的 calculator 为 extrud 额的 calculator
9. 几个主要的类 ElementGraph 单个 ele 依赖关系图，ElementsUpdateGraph 更新的依赖关系图，ElementsGraph 所有 eles 的依赖关系图
10. topo 排序过程，假设有依赖关系图 h<-b<-a<-c->d->f->g 返回结果为 [c,a,b,h, d,f,g] 注意:因为 c 已经参与了排序,不会再次参与

## 视口

1. viewport 初始化用来设置 camera 的偏移决定渲染哪部分,和 layers 决定相机要渲染的层
2. 执行渲染 render 时,执行 renderer 的 setVierport 设置视口,即输出图像在屏幕的位置,因为即使相机设置了偏移,渲染出的图像也可铺满全屏
3. 为啥两块地方的背景不一样，背景也是对象，只需要设置好对应的 layers 就行了,这样不同区域用不同相机，决定了显示哪块背景
4. 两块地方共用一个 scene，内部显示的不用模型等也是通过 layer 控制
5. render 中有很多 scene，在 render 初始化时，扫描 area 列表，创建出不同的 group,group 设置 renderOrder，后续从 grep 获取 area 放进对应的 group 中
6. 旋转控件实现方式,是一个 object3d，使用 renderer 渲染，旋转角度使用球坐标计算,控件自身转动通过更改 quaterion 实现

## GPU 拾取

-   准备拾取 scene
-   获取所有 bufferGeometry 数据,改材质，使用顶点着色，将物体 id 作为 color 的编码，geometry 合并成一个
-   camera.setViewOffset 准备相机
-   renderer.setRenderTarget 设置渲染目标
-   renderer.render 渲染完清除视口偏移
-   renderer.readRenderTargetPixels(this.pickTexture,0,0,1,1,pixelBuffer) 读取颜色并解码出 mesh 的 id

## 基于 Request 的 Undo、Redo 实现

1. RequestManager 中包含 SessionStack
2. Session 中可包含多个 Request
   思考:Session 相当于 transactionGroup 的角色,里面可包多个 transaction

    结合一下,将现有的机制只用 Request 实现呢??

    原因 1: 现有的 transaction 机制会绕过监控,不好做自动化测试

RequestMgr
    SessionStack
        Session Session Session
        [Req Req Req]
