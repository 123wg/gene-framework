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

### 显示层绑定在 Model 中

1.model 层定义显示对象提供的数据格式 例:当前的 GRep 用法 2.优点:在定义 Model 时可直接写出显示层数据 3.缺点:需要数学库支持,像 konva 库,需要提供中间层的数据转换 4.与 model 关联方式:渲染对象中包含 model 的 id

### 显示层单独处理,包含 Model 的引用

1.显示层单独拆包 2.显示对象抽象为 Graphic,提供 compute 接口,直接计算出渲染数据 3.优点:和 model 隔离性好,缺点:独立 4.与 model 的关联方式,渲染对象中包含 model 对象 5.初始化时加载一次所有的,model_view 中监听对象增删改,增加和修改,执行 compute 添加进去，删除，根据 id 删除掉当前的

## Request

1. Request 的设计需要考虑脚本录制 
2. 拖拽的连续更新,当前是在一个 request 的 receive 方法中包了 transaction 处理,request 取消时,对整个 transactionGroup 执行 rollBack

## TODO

2024-10-10

1. core 的打包生成 d.ts 改为用 vite 的插件 dts 实现,根目录的 tsconfig.json 需要修改
2. 隐藏 node_modules
3. 强制末尾加分号

2024-10-26

1. Request 的 dump、load 实现、Request的创建放在RequestMgr中 1--1
2. Cmd 的实现和用户交互处理,采取 SK 的设计,比较灵活,内部方法采用 YT 方式实现 1--1
3. Cmd 的注册 触发 1--1
4. 新建 canvas 测试 cmd、事件分发、request 串通整个数据层 1--1
5. 测试面板 1--1
6. Element 优化 去掉 db 直接监听属性 3--0
7. 渲染先用 konva 将二维组态出一版 1--1
8. 文档的 dump、load 1 --0
9. app的简单实现和启动 1--1
10. GRep、ModelView与Renderer的联动 1--1
11. 辅助体实现 1--1
12. 一些基础的图元 1--1
13. pick选中 1--1
14. 绘制管道cmd 1--1
15. pick_point_action 1--1
16. 管道选中 & 修改 1--0
17. pick_filter 过滤器 1--1
18. transformer变换器 1--0
19. 吸附 2--0
20. 绘制圆形 1--1
21. 绘制多边形 1--1
22. 绘制图片 1--0
23. 样式统一  1--0


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

## 拖动Gizmo的实现
1. gizmo如何触发? 通过在gizmo_mgr中监听Selection的选中事件,创建出gizmo
2. 拖动角点到更新数据的流程?拖动时点的位置是自由的，拖动过程中出发拖拽的Request,在参数进request之前会做限制,比如拖动右上角点代表着怎样的缩放方法
3. 事件传播逻辑,DisplayObjectImpl实现监听鼠标事件的接口，和CmdMgr处理方式类似


## 以实现一个管道为例,说明konva的渲染流程
1. PipeElement 保存的属性,start、end
2. 起点和终点拆成渲染的points,描边，线宽等作为参数传入
3. 数据层渲染对象 当前是全部包在GRep里,渲染时拆解出原始图元添加到layer中
4. 对于选中的处理,选中会调用getGRepWhenActive和getGRepWhenSelected,重新生成GRep并绘制在交互层
5. 临时对象,无交互的,创建TmpElement对象处理
6. 对于需要交互的显示对象,抽象成DisplayObjectImpl,并继承状态对象和Controller以监听事件
7. 需要交互的显示对象渲染,每帧调用DisplayObjectImpl的onbeforeRender，将impl为脏的数据返回,删除后重新添加
8. 当前渲染的问题:更新Selection和Element时,应该绘制在不同的Layer上，但是统一调用updateView方法，如何区分开绘制


## github actions 部署参考
[github action]https://www.cnblogs.com/jiujiubashiyi/p/18151965
