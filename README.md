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
18. transformer变换器 1--1
19. 吸附 2--1
20. 绘制圆形 1--1
21. 绘制多边形 1--1
22. 绘制图片 1--1
23. 样式统一  1--1
24. ResizeGizmo增加翻转 1--1
25. 旋转Gizmo 1--1
26. 选中时的移动 1--1
27. 吸附线的显示 1--1
28. 旋转吸附 1--1
29. 上一批图片 2--0
30. 添加一些常用的图元,文字、矩形、表格等 2--0

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

## GizmoTransformer 设计
1. 选中后创建,初始化参数如何传入  
结论: 需要有个地方监听选中事件变化,根据选中的Element,生成对应Gizmo,参数为选中的Element
初始化时，需要根据Element获取对应的几何数据,创建GRep

2. 移动状态下,如何更新Gizmo
结论: 移动或者操作Gizmo过程中会不断提交request,提交request后，在后处理中会刷新Selection的对象
此时又会执行到监听选中事件变化的地方,判断如果选中的和当前选中的一致，刷新Gizmo
当前Gizmo中的onChange实现是有问题的,在dirty后调用onChange,考虑dirty可能发生的情况如下
  - gizmo本身的事件会不会改变属性? 不改变,只返回或修改Model层的数据,数据更新后Gizmo的更新随数据变
  - 支持外部改gizmo的属性吗？理论上也是不支持的，因为所有的属性数据需要从Model层重新获取
  - 综上,dirty没有触发条件,自然执行不到onChange
  - 如何解决? gizmo在init后立即标记脏,其它的更新,在onChange后自动标记脏
如何更新数据,Gizmo只发送事件,对于resizeGizmo来说,需要先确定更改了哪些属性
  - 

3. Gizmo更新时,如何更新Element
结论: 可以参考app-design中的实现,增加一层Handler层,专门处理数据变化,这个优先级比较低,优先实现处理Transformer中的各种限制变换和处理
- 应该将所有gizmo放在render层,只管显示,不关心业务层如何使用,发生变化时直接发送事件或者回调即可

4. 需要准备的一些前置工作
    - EditorDefaultController中需要增加监听高亮和选中事件,对于高亮的处理暂时没有,需要添加,优先级低 1--0
    - Selection中需要增加事件分发 1--1
    - RequestMgr中执行commitReq后需要添加后处理事件,例如对于已经选中的项重新reset,因为可能有UI刷新等需要重新触发渲染 1--1
    - render中需要增加pick处理 1-- 1
    - renderer中对于Konva渲染结果与ElementId和GizmoId等的绑定,最好统一处理,目前很混乱 1--1
    - gizmo中的dirty需要独立出来,是个通用的东西 2--0



## 材质替换
DBMetaInstance
  - componentIds
  - dataID // 对应后台的数据id 返回所有components和fields

DBModel3dComponent
  - metaInstanceId //属于哪个meta
  - materials:Map<string,ElementId> // parts的name和 MaterialFaceDecorator的Id映射
  - attachMaterial(partName, eId) // 写入material(替换material的逻辑在此)

DBMaterialFaceDecorator
  - dataId // 材质的后端id
  - rotation // 旋转角度
  - eIdToFaceIds:Map<elementId,装饰的面的id集合> // 在成品模型中,elementId都为-1,猜测未使用到,是的 只在铺贴中用到了

model3dComponent中生成GRep的方式
- 正常情况下只要根据默认的asset3dContent创建GContent就行了
- 有material的情况下,遍历materials, 将数据整理成 如下格式,设置GContent的style即可
```javascript
parts:{
  partName: {
    assetId:string
    rotation:number
  }
}
```

当前替换时的逻辑
3dComponent.materials
  - solid_1:faceDecorator1
  - solid_2:faceDecorator2
  - solid_3:faceDecorator3
  - solid_4:faceDecorator4

替换时,修改的是metaInstance中的dataID
然后找到3dComponent 调用updateMeta方法, 这样的话,materials不变
加入本来有五个材质,换完后有3个,这3个会继续生效
再替换回来,本来的五个材质decorator还在,所以会继续生效

修改后的逻辑为：
- 获取旧的3dcomponent的所有materials
- 获取旧的3dcomponent的parts排序,根据排序生成数据结构
```javascript
[
  {solid1:materialId},
  {solid2:materialId}
  {solid3:materialId}
]
```
- 对新的3dcomponent的parts排序,返回数组[sold3,solid4]
- 对于多改为少情况:遍历旧数据,根据索引找新数据，找到的,改partName,找不到的,说明材质多了,多出来的不显示,为了避免partName冲突,统一修改为临时名称
- 对于少改为多情况：修改逻辑一样,只不过在获取旧数据时需要特殊处理下,需要把临时不用的数据改回去

## ResizeGizmo中遇到的问题梳理
- 对GShape增加strokeScaleEnabled默认值为false,忽略stroke的缩放,即使缩放是设置在Group上的,也会忽略
- 对于Element来说,变换都是整体的变换,统一抽象出父类TransformElement
- 继承TransformElement的元素,需要将变换统一设置在最外层GRep上
- 对于内部元素,x,y默认都为0,不需要变换,除非有多个元素的需要设置及相对偏移的情况
- renderer中获取的包围盒,都是不考虑变换的原始包围盒,也只有将所有变换应用在GRep上,获取的包围盒才是正确的，
- 如果将变换设置在内部图元中,获取到的Group的AABB包围盒虽然设置skipTransform为false,但内部计算仍会考虑子元素的变换,后期无法通过变换计算出夹紧点
- 对于RotateGizmo来说, 更新的流程核心逻辑如下
- 缩放:计算当前移动点和参考点的距离,计算当前放大的delta值, 创建transform,移动到未经变换的参考点->缩放->反向移动-> 旧变换.multiply(transform)即为最终变换
- 是否翻转：根据参考点获取参考的X,Y相对轴向矢量,比较相对矢量和参考点到当前点向量的角度,判断是否翻转,翻转在数值上的体现是scaleX为负值

## 拖拽移动TransformElement
- 鼠标按下,判断是否有选中物体,有的话,记录按下位置,没有的话,按下位置置空
- 鼠标移动,如果按下位置不为空,触发DragCmd,上次位置记为dragPos
- Cmd内部监听移动,提交request更新最新位置并且更新上一次位置
- Cmd内部鼠标抬起,Cmd结束,鼠标事件不消耗,到ActionDefault中监听到鼠标抬起,按下位置置空 

## 旋转RotateGizmo
- 旋转和Resize处理方式大体相同
- 需要注意的是,当物体有翻转时,计算的角度向右转会导致实际是向左转的,所以应该借助初始的rx方向判断是否应该翻转角度

## 吸附
1. 吸附的实现比较复杂,所以先只考虑满足需求的最小实现方案。
2. 整理一下需要用到吸附的几个场景，先明确边界
  - 1) 有些图元绘制如圆等虽然需要两个点，但只要判断重合 -->点点吸附
  - 2) 有些图元如管道,绘制时,需要根据上一点的角度吸附,例如,水平,竖直,斜线 -> 点点吸附、点线吸附
  - 3) 拖拽图元移动时包围盒移动,判断所有点x向吸附和y向吸附 -->点线吸附

3. 不同场景的处理
  - 对于场景1,根据Element分别获取可吸附的点,TransformElement取包围盒角点和中心点,线取所有点
  - 第一次取点,能吸附所有点就行了,根据距离判断是否吸附
  
  - 对于场景2，第二次取点,既能吸附所有点，还能自动吸附到与第一个点平行或竖直的线
  - 所以在传入第一个点后,获取可吸附的物体会发生变化,需要重新获取所有可吸附几何体，需要根据第一个点重新生成所有角度的可吸附线

  - 对于场景3,需要传入移动物体的角点和中点用于吸附,其它物体需要计算角点和中点和所有点的水平竖直方向用于吸附
  - 对于点点吸附,如果有多个，需要先根据x排序，再根据y排序，最后计算出吸附的点
  - 如果没有点点吸附，计算点线吸附,点线吸附需要分别计算在x方向和y方向是否有吸附线,分别对x和y做偏移,最后整合一个结果返回

4. 分层处理
  - 每个场景是一个大的策略，负责入参,结果整合
  - 策略下分不同的吸附,将所有吸附抽象为点点吸附和点线吸附,这样所有的几何计算是在一起的
  - 细分:策略分为。 点吸附点、点附点和线，多点吸附点和线

5. 类设计
  - SnapStrategy:策略
    - PPSnapStrategy:点吸附点，单点吸多点
    - PPLSnapStrategy:点吸附点和线
    - PsPLSnapStrategy:多点吸附点和线
  - GeoSnap:几何吸附处理
    - PPGeoSnap:点吸点
    - PLGeoSnap:点吸线
  - SnapEnginee: 策略管理,吸附入口,配置项暂时放这里,比较统一不考虑抽象成单独的对象

6. 使用方式
  - new SnapEnginee(SnapStrategy)
  - snapEnginee.doSnap()
  - 策略中获取可吸附几何对象,只提供接口,具体实现由调用方控制
  - 外部如何注入,通过snapEnginee注册,单例，统一入口
  - new SnapEnginee时,传入对应的snapStrategy,并更新可吸附对象
  - pick_point_action中需要根据吸附返回点

7. 吸附返回对象,因为只改变坐标,所以只记录dx和dy,交给外部处理偏移量,具体使用时细化一下
8. 实现步骤
  - 需要二维线类
  - 先实现在app中,流程跑通后再设计
  - 当前的实现使用时有个问题,吸附主体在什么时机获取

9. 当前问题
  - 如在pick_point_action中,如果先初始化策略,吸附主体的pos是不知道的,需要动态更新
  - 如何解决,这个和吸附的使用有关,吸附可以再返回结果后执行
  - 那还需要SnapEnginee吗,可以不需要,也可以看做是snap的管理类,目前的一些类设计改一些,吸附统一由snapEnginee创建
  - 可以做一些改进,core只提供基础的策略实现,如点吸点,点吸线,多点吸水平和竖直线结果
  - 剩下的入参,交给业务层实现,可以任意实现策略的组合,执行吸附的方式需要修改吗? 要,因为初始化时可直接生成精准的策略,交给snapEnginee,后面更新策略的参数即可
  - 具体需要改动的地方,绘制管道的吸附策略
  - 变换图元移动吸附时暂时无法使用,因为移动transform的cmd在platform里,吸附在app里,能否将吸附移动到更底层?不行，因为需求变化太频繁
  - 将move_transform 移动到app层,带来的问题是需要将defaultController移动到app层，从软件演变来看这是比较合理的,代表的应该是整个应用层面的默认操作，继承defaultController

10. 吸附线的显示
  - 竞品等看下来,目前只需要做点吸附线的显示就行,关键地方在于预览的创建时机和清除时机
  - 对于拖拽移动,吸附到时，显示预览线,鼠标松开,停止吸附，清除所有预览线,每次执行吸附绘制时，也需要重置预览
  - 架构设计层面思考: 计算吸附到物体时,需要带出吸附到的线,用来计算，显示放在哪里，使用的地方? 重复逻辑太多,放在snapEnginee中最好
  - 具体实现细节:事件通知方式？方法调用方式?  事件通知不太好,还是直接返回预览的GRep吧, 交给使用的地方决定显示和清理,麻烦了点,但灵活

## 替换材质在设计端不能加载问题
1. 问题数据
  ```
  // 门本身模型数据
    dataId: 2254
    assetId: KxUIBCSB
  // 替换后的模型数据
    dataId: 2253
    assetId: rc5gghgA
  ```
2. 问题分析:
 pm加载时metaMgr会加载2254 看看是在哪加载的

 pm finstance id 104是门板
 下面的 finstance id 15 门板与锁
 finstance 16 内外门锁
minstance 11 门锁内 对应 model3d id 12
对应材质 id 31  材质对应dataId 9632  对应assetId jxn0Eof2

换材质为否 材质为 9589 9590

最终计算更新后的 材质 assetId jxn0Eof2 是在material_manaer里面向meta_mgr 请求得到的最新材质


参数化编辑器 门锁渲染层 app.getSkCanvas().renderer._scene.children[13].children[3].children[5]

设计端 绘制墙和一个字母门
渲染层发现有两个表示门锁的东西,可能是被一个东西给盖住了
最后下标为8的删除后看起来效果是对的，需要排查这个8是怎么生成的,需要排查生成的grep 看
app.getSkCanvas().renderer._scene.children[13].children[6].children[8].visible = false

app.getSkCanvas().renderer._scene.children[13].children[6].children[8].visible = false

设计端看生成的Grep
door.db.C_GRep._renderNode.children.filter(a=>!!a.assetId)  生成8个renderContent 看起来有重复的

参数化设计工具中出来的结果是一样的,可能不相关


- 不知道该往哪找了

目前将加载子meta依赖添加在了设计端的load_util里面

- 参数化编辑器中 将9926 加载为子部件 dump看数据
- 设计端 创建后 dump看数据
- 最主要还是看最终生成GRep的过程,因为涉及到关联更新
- 想办法将门锁复制出来一份 让流程短一点 新建门,只有锁,并给一些可更改材质, 前端加载看效果 数据不能保持一致了, 但是流程一样, 调试起来方便些, 目前alpha发库好像有问题,先放弃吧

3. 解决方案
- 刚开始进入门门锁换材质是打开的,看起来没换是因为 没加载最原始的依赖2254,导致关联更新时模型换材质逻辑执行错误
- 参数化编辑器修改familyInstance 保存时递归获取family_instance的dataId，获取到meta，拿到所有原始依赖，保存下来。
- 设计端的model3d_component的genGRep方法中有个2D平面视图下的显示,如果有替换材质的话,没有加上替换的材质显示，会导致在3D视图下遮挡住已经换材质的物体,所以也需要加上替换后的材质


## 拉槽算法优化
- 测试模型 alpha dataId = 10940
- 参数化设计工具中性能数据

 大小           生成原始拉伸体耗时   开槽耗时    拉伸体总耗时   开槽耗时占比
 3000*3000      1.1979             3439.2419  3467.2109     99.19%

pushFace 和 addEdge操作耗时主要在以下几个地方
1. faces_shells_boolean.facesShellMerge方法使用Octree加速求交的,Octree构建错误,导致求交速度下降5-6倍
2. detect_loop_util.getNestedLoops 方法中判断点是否在Loop中,直接用PJ.ptToLoop方法速度慢,改为先判断是否在包围盒内,不在再调算法
3. add_edge_core.createCurveEdges方法中,判断Vec3是否相等使用equals判断,创建了大量中间Vec3 导致速度变慢,改为使用GeomUtil的新增vecEqualsFast方法
4. position_judge的execute方法执行时,也有Vec之间的equals判断,改为新增vecEqualsFast方法

模型	         大小	        拉槽耗时(ms)	      更新一次总耗时(ms)	    优化后拉槽(ms)	性能提升
8217作子部件	 1500*1500	  170.66465	          183.9694	             92.0189	      1.85
              1500*2000	   272.7018	            287.9269	            144.0744	      1.89
              2000*2000	   532.7914	            551.62545	            250.2629	      2.12
              2500*2500	   1082.4128	          1103.9999	            383.4633	      2.82
              3000*3000	   1820.0994	          1848.2824	            403.0369	      4.51
5. 修改了Vec2和Vec3中的equals方法,原本的实现方式会创建大量中间对象
6. 修改Octree中getCandidateOverlaps方法,getObjectsRecursive中每次重新slice耗时
7. add_edges_core中的createCurveEdges方法,判断线是否完全重合,先预先判断中点是否相等
8. pt_loop_pj的execute方法中,添加是否需要判断Loop封闭的方法,否则严重影响性能
9. 将pm_sdk中判断是否槽面时，采样点的获取修改为,遍历拉槽和选取面的布尔并后的polygon，找所有逆时针的Loop上的一根线，向左偏移一段距离,取中点，总会有个点是在槽面内的

## 自由造型
1.类设计
```javascript
DIYElement(基类)
    DIYComponent  
      - internalVisible: false
      - childrenId: Set<ShellElement.id | DIYInstance.id> 

    DiyComponentNode
      - parentId: ElementId

      DIYShellElement
        - brepShell

      DIYInstance
        - componentId: DIYComponent.id
        - matrix: Matrix4
        - contentType: 顶/墙/地 造型类型

    InteractiveBrepElement (暂不清楚作用)
      - shellElementId: DIYShellElement.id

        FaceElement(tmp)
          - faceTag: string

        EdgeElement(tmp)
          - edgeTag: string
```
2.自由造型中吸附的实现

- Wall的grep找面,trimmedSurface的getLoops获取三维边界,自己取线,算端点中点等
- 与XYZ平行吸附也是使用距离判断,以上一点为基准，创建xyz方向线，判断当前点到发射线的距离，判定，接近时吸附
地面和顶面同理
- 主要参考math中的吸附实现

3.选中面样式
是再material_manaer中使用getHighLightPointMaterial实现的,需要显示支持

4.解组后matrix操作
 低优先级，靠后

5.math中的吸附操作
  run_snap_utils传入(画布,鼠标坐标,pickFilter)
  初始化:
  - 获取拾取到的GNodes
  - 生成拾取射线,从当前画布和鼠标坐标获取
  - snapContext设置可参与计算的GNodes

  执行吸附
  - snapEnginee.snap
  - 有选中的GNode先计算,如点在面上
  - 计算参考点、先、方向的吸附,注意以下逻辑
  - 方向吸附的理解:方向吸附，本质也是线吸附，判断吸附射线与方向线的交点
  - _combineSnaps组合捕捉结果,暂不清楚作用
  - 没吸附到东西时，计算是否吸附到坐标轴和坐标平面
  
  ```javascript
  /**
     * 单位世界距离占的像素数
     * 取反表示1像素对应的世界距离
     */
    public static pixelsPerUnitCreator(cameraInfo: CameraInfo, viewHeight: number) {
        if (cameraInfo.orthogonal) {
            // pixelToWorldScale 1像素表示的实际世界单位
            const factor = viewHeight / (Math.abs(cameraInfo.top - cameraInfo.bottom) * cameraInfo.pixelToWorldScale);
            return (distance: number) => factor;
        }
        const vFov = (cameraInfo.fov * Math.PI) / 180;
        // 视点到投影平面总高表示的 像素数
        const factor = viewHeight / (2 * Math.tan(vFov / 2));
        // 一段距离代表的像素数
        return (distance: number) => factor / distance;
    }
  ```

  SnapHelpMgr用来处理额外添加的点线和方向等
  使用方式:
  - 鼠标悬停生成临时辅助线，方向时记录
  - 连续划线时,手动添加上一个生成的点用于吸附
  - run_snap_util执行吸附时,会读取数据添加到snapContext(可优化为直接设置在snapContext上)

  在pickPointAction中，每次执行吸附时，通过snap_helper_curve判断悬停时间添加根据上一吸附点生成的辅助线

  SnapCandidates 捕捉计算结果，可有多个结果符合条件,最后根据吸附类型的优先级排序,总体优先级是 点>线>面


6.绘制圆面并拉伸出圆柱
```javascript
@registerCmd(AppCmdIds.CMD_TEST_AA)
export class TestAACmd extends Cmd {
    public executeImmediately = true;



    public async execute() {

        // 创建圆的方式
        const arc = new Arc3(Coord3.XOY(),50,50)
        console.log(arc.isClosed());

        const face = Face.createByBoundary3d(Plane.XOY(),[[arc]],true)
        console.log(face);

        const shell = new Shell()
        shell.addFace(face)

        // 拉伸圆面
        const coord3 = (face.getSurface() as Plane).getCoord()
        const polygon = face.calcPolygon()

        const body = brep.alg.BodyBuilder.extrude(coord3,polygon,Vec3.Z(),0,100,false)
       
        transact(app.doc,'测试',()=>{
            // const res = brep.alg.ShellEdit.addEdges([arc])
            // console.log(res);
            app.doc.create(MathGeoElement).init(body)
        })
    }
}
```

7.拖动拉伸体实现
- 选面上一点, 获取相机射线,为法向创建移动平面,鼠标移动时计算在移动平面上的三维点,投影到法向上
- 第二种方式, 根据当前相机位置与鼠标位置生成射线l1,根据选中平面中心点c和法向n生成射线l2,计算l1与l2的最近距离，得到在l1上的点来计算拉伸参数
```javascript
@registerCmd(AppCmdIds.CMD_DRAW_EXTRUDE)
export class DrawExtrude extends Cmd {
    public executeImmediately = false;



    public plane: Plane;

    public tmpPainter1: TmpElementPainter;

    public planeCenter: math.Vec3;

    public async execute() {
        this.tmpPainter1 = this.applyNewTmpElementPainter();
        const matrix = new math.Matrix4();
        matrix.applyRotate(math.Vec3.O(), new math.Vec3(0.5, 0.5, 0.5), 45);
        const coord = math.Coord3.XOY();
        coord.transform(matrix);
        const grep = new GRep();

        const face = math.brep.Face.createPlane(coord, 2000);
        this.planeCenter = face.getCentroidPoint();

        this.plane = face.getSurface() as Plane;
        const gface = new GFace(face);
        gface.setStyle({ face: { color: 0xff0000 } });
        // gface.layers = LayersConst.view3DLayers;

        grep.addNode(gface);
        this.drawTmpGRep(grep);
        this._updateView();
        // 2.位移
        // 3.监听鼠标选中 创建辅助平面
        // 4.拖拽 显示线
    }

    protected _onMouseMove(_viewport: Viewport, pos: math.Vec2, _fnKey: FnKey): boolean {
        const grep = new GRep();
        const ray = this.getIView().generateCameraRay(pos);

        const planeNormal = this.plane.getNorm();
        const planeRay = new math.Ln3(this.planeCenter, planeNormal, [0, 1]);
        planeRay.extendDouble(math.CONST.MODEL_MAX_LENGTH);

        const r = math.Vec3.O();
        const d = math.Vec3.O();
        // 求鼠标和相机射线和 面法相射线的 最近距离点
        math.alg.D.curve3s(planeRay, ray, r, d);

        // 最近点
        const gPoint = new GPoint3d(r);
        grep.addNode(gPoint);

        const gPoint2 = new GPoint3d(d);
        grep.addNode(gPoint2);

        const gCurve2 = new GCurve3d(planeRay);
        gCurve2.setStyle({
            line: {
                color: 0x00ff00,
            },
        });
        grep.addNodes([gCurve2]);

        this.tmpPainter1.drawTmpGRep(grep);
        this._updateView();
        return false;
    }
}
```

8.平面倒角




# 事件传播
sk_canvas 初始化 => 初始化mouseEventObserver
mouseEventObserver初始化时会传入监听对象,一个stack 包含[cmdMgr]
mouseEventObserver中监听鼠标事件=> 获取所有stack 调用processMouseEvent
action继承自MouseKeyEventExpand 将传入的事件展开，在action中定义 onMouse等方法即可




MouseEventObserver=> CmdMgr.processMouseEvent=> Action.processMouseEvent

# 吸附
吸附策略
点-点 点-线 线-线 圆-圆 圆-线 等

吸附结果定义
共线、重合、相切、共线+旋转

SnapHelper.doSnap=>SnapStrategy.extcute() 输出SnapResult => ConstraintHelper.execute 唯一性约束计算器计算后输出结果
```javascript
// 中间形态 策略执行后输出
export interface ISnapResultOption {
    _master: SnapGeometry; // 吸附主体
    _client: SnapGeometry; // 吸附客体
    _dx?: number; // 目标位置-x值
    _dy?: number; // 目标位置-y值
    _drotation?: number; // 目标位置-zrotation值
    _center?: math.types.IXY; // 旋转中心
    _loop?: math.Loop;
    _type: SnapResultType;
}

// 最终输出结果
export interface ISnapOutput {
    dx?: number;
    dy?: number;
    drotation?: number;
    center?: math.types.IXY;
    auxilaries?: ISnapAuxilaries[];
}
```

![Alt text](/images/point_line_snap.png)

SnapHelper中doSnap执行步骤
1.获取吸附主体  预览的column的角点和四条包围线
2.获取吸附宿主 墙的话 获取墙的所有Coedge组成的SnapLineGeometry

斜墙和方柱为例 靠近时 SnapStrategy返回的结果为一个角点和两个coedge的结果

执行updateFirst => first为数组第一个值
执行updateSecond =>second 为undefiend
updateRotation => 只记录 暂未使用
SublineHelper=>execute 给输出的结果ISnapOutput添加需要显示的吸附辅助线 auxilaries
 
吸附引擎负责处理所有辅助显示所需的计算对象(线、或者当前预览的点、线的样式等)


# Layer 初始化
launch_app的openDocument=>onFileOpened(doc)
core中提供注册打开后执行的策略  registerFileOpenedCallback 和 执行方法onFileOpened
design_sdk中open_file_add_in注册打开文档后 创建Layer
onFileOpened=>doc.transactionMgr.clear

总流程 openDocument=>onFileOpened=>new Layer=>transactionMgr.clear

# 草图初始化
 场景1: 打开文档自动创建sketch 清空undo=> 画线=> 保存顶点和线
 cmd: cmd_create_curve  
 request: 新建顶点、新建curve
 初始化时初始化sketchLoop？ 不合理 保持一定有顶点

关联删除等 在model层直接从doc中删除

# 显示
## 层级结构
Gnode
    +toRenderNode() -> RenderNode
    ==>GGroup
    ==>Grep

RenderNode
    ==>RenderPoint
    ==>RenderEdge
    ==>RenderMesh
        -vertexs:Float32Array
        -indices:Unit32Array
        -normals:Float32Array
    ==>RenderText

DisplayObject(所有显示对象基类,一般只存储对象属性)
    ==>GrepDisplay(数据层显示对象)
        + gRep
        + style
    ==>GizmosBase
        ==>Gizmos2d
            ==>DimensionBase2DGizmos
                ==>DimensionLine2DGizmos(线段标注辅助体)
        ==>Gizmos3d

DisplayObjectMgr
    -_displayMap<number,DisplayObject>
    +addDisplay(displayObject:DisplayObject) 添加显示对象

DisplayObjectImpl(显示对象实现基类，监听、处理事件，操作属性)
    ==>GrepDisplayImpl
DisplayObjectMgrImpl
    -_displayImplMap<number,DisplayObjectImpl>


## grep->Object3D流程
1.ThreejsRender.render 开始执行渲染
2.DisplayObjectMgrImpl.onBeforeRender返回待处理数据
```javascript
{
    update:[{
        id
        domNodes:[]
        grep
    }],
    remove:Array<number>
}
```
3.执行update里的数据，执行_removeGrepByDisplayId=>_addGrepByDisplay
    - add的具体流程
    3.1 根据grep.grepRenderArea渲染层级 获取对应的Group
    3.2 Hub.addRootGRep->Hub.genBuckets->Grep.toRenderNode->三角化数据
    3.3 Hub.getObj3D->Hub.createObjectFromBuk->ThreeJsUtil.newObject3D->创建Object3D
    3.4 添加到对应的层级group中


## 旋转控件
1.触发创建流程:点击->
    EditorMgr.processMouseEvent->
    DefaultAction.processMouseEvent->
    DefaultAction._onClick->
    触发SELECTION_CHANGE事件->
    GizmoMgr._onSelectionChange->
    DefaultFactory.createGizmos
2.创建Rotation2DGizmo实例
3.GizmoMgr.addGizmo 添加实例->
    GizmoMgr._addDisplayGizmo添加实例下的gizmos数组->
    DisplayMgr.addDisplay添加(OperateRotation2DGizmos实例)->
    DisplayObjectMgrImpl.addDisplay创建impl实例
4.impl实例的onInit->
    绘制初始化图元->
    processMouseEvent 监听处理事件
5.如何显示出来:onRender方法返回gRep，后续同grep->Object3D流程

## 文字
    - 以显示房间名为例

## 标注
    - 添加时机
    - 线转圆弧



# Editor-子编辑环境
1.先以进入渲染为例,UI和编辑器处理过程
    1.1点击渲染->触发EnterRenderEnvCmd->EditorMgr.enterEditMode触发事件->EN_EVENT_TYPE.MESSAGE_EDIT_MODE_ENTER->RenderPlugin监听到事件->触发_initView显示渲染的UI
    1.2 优化点:触发显示渲染UI时，隐藏通用环境UI时，采用硬编码，可以通过store控制组件显隐解决

2.草图编辑环境流程
    2.1 EditorMgr.enterEditor时会启动新的事物组
    2.2 在调用进入草图子环境命令之前创建sketch?
   问题：1.创建草图现在放在进入editor之前
         2.相机会偏移，受俯瞰相机影响
         3.UI跟随变化
         4.草图环境 undo一次后 保存失败


onSave => assimilate => symbolSuccess
onCancel => rollback => symbolCancel
    2.3 逻辑修改为,进入sketchEditor，草图一定是创建好的，只负责修改



# 相机
## Editor子环境resetControl时导致相机偏移
原因：CameraControllerMgr.resetController之后，对veiwports中的所有Camera创建CameraControl，
    每个CameraControl初始化时都会触发CAMERA_CHANGE事件,因为鸟瞰相机是最后初始化的，所以导致app中监听CAMERA_CHANGE事件时 CameraOperate2DGizmos的position变为了鸟瞰相机的位置

## three中球坐标
    - y轴向上
    - phi表示极角,范围[0,PI],与y正轴的角度
    - theta表示赤道角,范围[0,2*PI],与z正轴的角度

    当前viewCube中"前"代表的targetState
    phi: 1.5707963267948966 //
    theta: 3.141592653589793  

    鸟瞰相机初始化时,camera_position的_direct属性值来源，从actionBaseTarget中做一次计算

    _vec3Rotate方法的实现原理
    - 相机对象属性有_direction和_position,他们是针对相机的目标点target对称的
    - 在旋转gizmo主动触发时,会传入相机最终要旋转成的数据过来,数据包括,phi和theta
    - 在gizmo的面信息中，旋转时使用的球坐标系是以z负轴为正方向计算的
    - 旋转流程,根据相机当前up方向,计算旋转到up为正y轴的四元数,将当前球坐标使用的向量应用四元数,
    - 计算相机最终需要旋转成的数据和当前的phi和theta的差值,球上应用旋转,将球坐标应用到向量上,向量即相机的_direct 使用四元数的反转,回到相机up为(0,0,1)的坐标系中
    - ps:自己实现的话，可以不用麻烦，在同一坐标系下直接计算旋转
   


# 拾取
 ## 拾取GNode
    1.过程：PickUtil.pickGNode->skCanvas.pick->threejs_render.viewportPick
    2.执行gpu拾取->拾取范围为方形区域,按照跑马灯方式，取索引,根据索引找rgb值,位操作后到_gnodeCollection里找



Unity component   esc
# 模型PDM相关

## MetaInstance
    -dataId: 对应PDM的3D模型中的模型ID
    -dataVersion 后台获取的 不知道有啥用
    -fieldToValue 元数据字段属性值集合
        存储方式：和fields关联 如150代表吸附属性 则存储为 [150,'adsorbFloor']
        生成方式：接口请求的meta数据中fields计算得到
    - componentIds: meta的数据中有components
        遍历components，根据code创建实例，根据values获取fieldCode对应的数据，
        存储到对应实例的codeToValue中

## ModelModel3DComponent
    -metaInstanceId
    -codeToValue:从meta的components中获取的字段值集合


# 模型保存libraryID和snapshotID
    - 当前在meta_instance和face_decorator中只保存libraryId
    - doc中保存library和snapshotId 每次snapshotId都是当前库最新的
    - 初始化加载时 会根据保存的lib和最新的snapshotId拉取资源
    - metaMgr中增加所有libraryId和snapshotId对应关系和当前使用的libraryId和snapshotId
    - TODO:库升级时处理 因为每次都存库对应最新的snapshotId
   



# 材质替换
    IFaceDecorator
        ==>MaterialFaceDecorator

    GroupFace(组合面 design_sdk的model)  
        -
            ==>Floor(房间)
       
    一个墙取threejs对象:app.getSkCanvas().renderer._scene.children[11].children[4]

    点击左侧素材替换过程
        - launch_app中注册监听点击事件onCatalogClicked,点击后触发meta对应的cmd
            进入cmd参数为(...params[meta,other])
        - 假设选中一个Floor(一个GroupFace),新生成一个decorator,初始化传入的gnodeIds为空==>调用replaceDecorator(新的decorator)
        - replaceDecorator方法中的逻辑==>找包含自己的所有groupFaces==>遍历==>给替换的decoratpr设置参数{elementId和gnodeIds}==>将decorator重新赋值给groupface的material属性

    使用替换面板过程:
        - 新增replace_material_request
        - 点击替换==>左侧弹窗==>点击确认调用request替换

    优化点1:平面视图下,hover墙也会走替换逻辑,但是点击选中后走的是选中墙修改弹窗--1
    优化点2:替换材质后,旧的materialFaceDecorator未清理,生成很多tmpView,tmpElement 很多地方都有问题，暂不处理--1

## 材质FaceDecorator使用


# 拓扑

  - 以画一个房间为例,墙有俩属性，path四条线(接头无重叠的)，crossPath四条线(接头有重叠的)

![图path](/images/wall.path.png)
![图crossPath](/images/wall.crossPath.png)
![图root](/images/wall_root.png)
![图corner](/images/wall.corner.png)
![图aux边](/images/wall_coedge_aux.png)


- room_builder中_extractGrapher2DInput提取搜环输入,遍历所有墙的crossPath，数据结构:IGrapher2DInEdge
- 开始执行搜环_handleGrapher2DSearch,执行结果root(),list(所有regions集合，第一个元素和root相同，最后一个为房间的区域)
    sortedEdgeMap:Map<IGrapher2DInEdge,IGrapher2DEdge>表示输入线和分割后线的集合 的映射
    structureOriginRegions:IGrapher2DDualRegion 墙体被分割成的的一小块一小块，拉伸出墙体的原始数据
    spaceOriginRegions:IGrapher2DDualRegion 房间的区域原始数据


_refreshRegions 重置区域
    ==>_handleGrapher2DSearch 搜环 返回原始区域数据
        ==> _extractGrapher2DInput 提取搜环区域
    ==>_genCoEdgeList 包装Coedge
        ==>_coEdge2coEdge 搜环输出的coedge转化为自定义的Coedge
    ==>_genStructureRegions 生成结构区域,拉伸墙的
    ==>_genSpaceRegions生成空间区域,地面等
    ==>_genOuterSpaceRegions 层的外轮廓
_genStructureBreps 构造拉伸体
slabBuilder.build() 更新楼板
holeBuilder.build() 开洞
faceBuilder.build() 合成面

- _genCoEdgeList执行时标记edge是否为Aux边,结果以一个墙角举例,是两个墙相交的内侧边，目的是为了区分该边是否显示。标记的原理是,判断edge对应的所有coedge所在的区域都有oldId,判断原理:看搜环结果所有regions,最外侧的即list[0]，代表最外圈的大的正方形,list中间的代表构成墙体的regions,最后一个为构成房间的regions,其中最外圈的和房间的regions是没有对应的oldId的，因为代表新生成的区域,和传入前的墙体区域无关，找Aux就变成了找到一些Edge,这些Edge对应的CoEdge都用来构成structRegion了。转化为几何数据上的表达就是,找edge的所有coedges对应的区域，都有oldId的标记为Aux，需要结合root,corner,aux边的图来理解


// 表达式绑定db的属性 ExprUtil.updateExpression(app.doc,ie,'height',EN_VALUE_TYPE.float,'#H');
// 顶点左键菜单 1
// 线段编辑 1
// 草图编辑 增加顶点 1
// 草图面板 1
// 极值情况梳理 直接报错 1
// 辅助视图 可以暂不处理 0
// 模型外框选中 1
// 草图复制 0 暂不处理
// 圆弧半径为一条边 1    
// 默认选中 1
// 弧更新持续报错 0
// 线段编辑对扫略的支持 0
// 草图孔 1.继承sketchLoop?
         2.独立的草图元素

// 继承loop=>顶点编辑=>顶点编辑，线编辑，移入loop中，改动未知
// 独立的草图元素=>sketch增加孔的管理，但是sketch的loop变成了单个，数据结构是否需要修改?
// 1.孔删除
// 2.退出校验
// 3.盲孔生成


# 几何库调试
math.Log.d() -> 复制到https://dev-math.skong.com/ 中

<!-- 拉伸体cmd -->
<!-- 草图进入退出部分 -->
<!-- UI初始化 先不填入内容 -->


// element 提供clone方法
// cmd中统一提供复制表达式 只处理一层
// 有些db的属性类型是map map的key也能赋表达式  需要扫描map的key去查询表达式

// meta_mgr中需要记多个libraryId 还需要记多个其它的libraryId 可记为map 0 下周
// cloneCmd处理需要 赋值的表达式



// 墙-faceId
['62e76ee7', '27d1dc9f', 'a380016c', 'c6de5619', 'c6b75709', 'cd1021c1']
//bool后-faceId
['62e76ee7', 'cd1021c1', 'a380016c', '62e76ee7', 'c6b75709', '27d1dc9f', 'c6de5619', '7aaf5715', 'c857c1b8', '955745cd']

// 子部件加载去除 element中有配置 需要在compound和sketch基类中添加
// 添加自定义layer测试
// 去掉特征的layer
// 草图layer改动 feature/mars-4328


 // 缓存时
[920, -920, 1301.076477383248]


// 更新参数 ==找到需要关联更新的洞



// 1.确定原点移动后在设计端展示是否正确,已确认
// 3.PDM中新增属性作为系统变量,参考gizmo中有的都是必须项,其它的可通过自定义变量实现，整理成表格
// 2.需要提供的项,
        无component，提供映射关系，类目id和类型对应关系, 整理表格
        对子部件显隐的控制 已实现
        metaInstance获取洞体方法 矩形洞提供wdh,L形洞和U形洞获取洞体 需要添加
        门窗模型各一份, 门有了，窗无


## 类目id和类型对应关系
参数化门窗不提供对应的component标识类型,直接通过类目id来区分,提供测试环境类目id和对应类型关系
门:{
    394: 平开门
    401: 双开门
    395: 套板
    396: 套线
    397: 门板
    399: 门锁
    400: 过门石
}

窗:{
    402: 一字型窗
    403: L型窗
    404: U型窗
    409: 窗扇
    410: 窗框
    411: 把手
}


## 建模规范
### 1.类目映射关系

参数化编辑器保存时不解析出component,需要根据类目id判断参数化门/窗的类型

测试环境
```javascript
    {
        394: 平开门  // 有模型
        401: 双开门
        402: 一字型窗
        403: L型窗  // 有模型
        404: U型窗
    }
```
### 2.内置变量表
设计端放置、更新过程中的gizmo、开洞等通过前端配置表的参数驱动,如拖拽门洞的顶点，更新参数W的值->更新模型
这部分使用的变量需要再PDM中创建，创建模型时自动带入

参数化门
```javascript

```
   
// 1.默认变量加载,先从类目中读，没有的创建出基础变量
// 2.U形飘窗和U形窗变量确定，交产品


## 草图报错处理
// 报错通知机制
// 1.model层的处理,添加临时属性,记录本次计算错误的地方，markGRepDirty后,写入报错信息最后一个，且图元爆红，清空临时属性，发送报错事件，在plugin中处理
// 2.多个冲突怎么办？只显示第一个 1
// 3.报错信息缓存到model上 1
// 4.单独modal管理 还是sketch统一管理?  单独的modal管理 1

// 5.外面的情况如何处理 拉伸扫略体  异常的导航结构爆红 其它的不变


// 当前的通知方法
pm.Toast.error({
        title: '当前草图异常',
        content: '当前草图存在异常，为保证模型能正常使用，此处为报错原因',
        duration: 0,
        closable: true,
        className: 'pm_toast_st',
});


## 开槽
1.拉伸体默认带topo命名
2.槽model定义
3.开槽cmd选面,生成槽

开槽平面预览 1
算法对接，先不考虑阵列 1
单独拉分支 1

GPolygon 离散时候 根据局部坐标系 获取世界坐标系的点
底面：局部坐标点 (10, 10) => 世界坐标点 (10, -10)  =>y轴负向位移拉伸体的位移 (10, -510)
想要的坐标是 (10, -10) 不参与拉伸体的位移  不合理

顶面:局部坐标 (10, 10) 世界坐标点 (10, 10) => y轴负向拉伸体偏移 (10, -490)

1.阵列算法对接 1
2.阵列更新对接 1
3.增加阵列方向 1
4.CPU pick 1
5.选中显示 0
6.贯通 1

1.删除拉伸体 关联删除槽 1
2.槽的复制 涉及到topoName的复制 0
3.选面限定 0
4.编辑草图时 拉伸体更新 0
5.更新阵列数据时,关联更新不生效 0
6.拉伸体复制支持   topo命名修改

改槽属性=>改polygons=>拉伸体更新

槽 依赖拉伸体的草图的变化

依赖关系修改为: 草图-->拉伸体,拉伸体更新时更新槽
槽数据更新 不单独计算槽polygon=>直接更新拉伸体
目前的实现:槽单独更新=>更新拉伸体
可能带来的问题:从使用场景看 1。新增槽 2.修改槽 3.删除槽 4.更新草图
新增槽->手动更新
修改=>更新拉伸体
删除=>不用管
更新草图=>更新拉伸体


1.结构导航 1
2.关联更新 0

左窗宽  #CKH+#QWP+#QQH+#ZCW+#CKH

右窗宽 #CKH*2+#ZCW+#QQH+#QWP

## 槽的关联更新
槽计算polygons放在拉伸体中计算
新建槽和修改槽属性时,手动更新对应拉伸体
修改长宽等表达式时,在extrude的关联更新中写入对应属性 进行关联更新
目前的问题:拉伸体会更新两次
原因为:先调用extrude的markGRepDirty=>更新拉伸体=>执行到calculator_extrude 的execute 方法 不知道为啥
如何解决:不知道 暂不解决

## 槽关联的topo命名改动
1.解决选面匹配问题 0
2.如果有拉伸体复制 要能根据topo找到新的拉伸体上的面赋值给新的槽 0

当前的实现只能选择最外圈的面
如何标记能选择所有草图生成的面和通孔的面
如果是盲孔 当前命名规则

## 阵列的改动
1.拉伸、扫略体等绑定阵列体 0
2.阵列的弹窗 0
3.阵列数据层的修改 & 槽
5.四元数和欧拉角

## 槽
1.选面箭头
2.取消阵列恢复默认
3.其它体的阵列关系

正在执行划线操作=>设置物体显隐为false
执行划线操作是一个cmd,可以将设置显隐的操作放在transaction中执行,可以不打断cmd

4.对于槽的修改
拉伸扫略等作为根特征 primitiveFeature

1.窗台石、窗套建模 1
2.特征建模设计修改 1
3.阵列的数据结构修改 1
4.阵列弹窗修改 0
测试阵列轴数据更新 面板更新 切换阵列方向后恢复功能
5.槽阵列改为右键方式 0
对于槽 直接按选中的来，不是槽的话，启动事务


## 湿区底盘性能分析
- 测试模型 alpha dataId = 10940
- 参数化设计工具中性能数据

 大小           生成原始拉伸体耗时   开槽耗时    拉伸体总耗时   开槽耗时占比
 3000*3000      1.1979             3439.2419  3467.2109     99.19%


pushFace 和 addEdge操作耗时主要在以下几个地方
1. faces_shells_boolean.facesShellMerge方法使用Octree加速求交的,Octree构建错误,导致求交速度下降5-6倍
  - Octree两个类OcTree和OctreeNode
  - OctreeNode主要属性为, objs, children(子级节点),depth,halfLen, center
  - 构建过程,传入objs，创建rootNode，调用rootNode.add添加子节点
  - 分割过程，超过最大深度，不继续细分。否则
  - 未细分过且对象数量小于20，不细分，否则
  - 拆分空间细分，halfLen减半，分为8个node
  - 将obj放入对应的空间中，给obj包围盒点，判断应该在哪个区域
2. detect_loop_util.getNestedLoops 方法中判断点是否在Loop中,直接用PJ.ptToLoop方法速度慢,改为先判断是否在包围盒内,不在再调算法
3. add_edge_core.createCurveEdges方法中,判断Vec3是否相等使用equals判断,创建了大量中间Vec3 导致速度变慢,改为使用GeomUtil的新增vecEqualsFast方法
4. position_judge的execute方法执行时,也有Vec之间的equals判断,改为新增vecEqualsFast方法

优化后性能指标
大小            拉槽耗时       总耗时      优化后拉槽耗时
1500*1500       180.6931       195.1059     98.4750
                160.6362       172.8330     85.5629
               

1500*2000       287.4538       302.4899     147.8449
                257.9499       273.3640     140.3039

       
2000*2000       548.2600       565.5949     270.6108
                517.3229       537.6560     229.9150

       
2500*2500       1116.8188      1138.8569    381.3608
                1048.0068      1069.1430    385.5659
                       
                       
3000*3000       1807.6640      1835.6149    404.5849
                1832.5349      1860.9499    401.4890


5. add_edges_core 中的createCurveEdges和intersectCurvesAndEdges耗时较长,需要继续优化
6. createCurveEdges中求curve是否完全重叠,修改为了先判断中点是否相等

优化前addedge耗时和拉槽总耗时
296 487
272 469
261 462
278 469
262 472
优化后
248 446
253 455
240 436
239 439
240 428

均值前
274 472
均值后
244 440
提升 10% 左右

7. 目前耗时较高方法
pt_loop_pg.execute
add_edges_core.intersectCurvesAndEdges
face_boolean.addToPointListMap
face_boolean.intersectEdges
pt_polygon_pj.execute

8. 设计端和math库中执行效率不一样
math时间 786 785左右
plane中的containsCurve 耗时很多



# 参数化编辑器草图
<!-- 结构继承关系 -->
BuildingBase
            ==>LayerElement
                            ==>JointableElement
                                                ==>Wall
            ==>DBLayerElement(layer)
                            ==>DBJointableElement
                                                ==>DbWall
            ==>Layer




1.Sketch和SketchLoop 没有grep
2.点是否要显示出来? (有倒角线 不显示)

Sketch
    C_vertexs:[]
    C_curves:[]
    <!-- vertex和curve保存为map的形式 -->
    C_loops:[SketchLoop,SketchLoop]
    C_Polygon

SketchBaseElement
    sketch
            ==> SketchVertex
                x:number
                y:number

                type:'0'|'1'|'2'
                R==fillet
                a,b == chamfer
                C_Curve:math.Curve2|undefined

            ==> SketchCurve
                startVertex:ElementId
                endVertex:ElementId
                type
                ccw
                C_Curve:math.Curve2|undefined

            ==> SketchLoop
                curves:[curveId,curveId...]
                C_Loop:math.Loop|undefined

创建图元 =>取点=>创建vertex
        =>取点=>创建vertex
        =>创建curve 和两个vertex的id=>创建SketchCurve
        =>多个SketchCurve=>创建SketchLoop

更新图元 =>更新vertex=>更新curve=>更新loop
        =>更新curve =>暂无更新
        =>更新loop=>暂无更新

删除图元 =>删除loop=>逐级删除
        =>删除curve 暂无
        =>删除vertex=>删除curve => 更新loop(始终封闭)

倒角=>(选点)=>cahmfer/fillet
                        =>创建vertex
                        =>创建curve
                        =>更新选择vertex=>记录curveId
                        =>更新关联Curve
                        =>更新Loop
添加vertex=> 选择curve
            =>创建vertex
            =>curve分割
            =>更新Loop

退出草图 清除grep
删除的逻辑需要实现 关联更新的暂不重要


倒圆计算方式
1.计算角平分线
2.根据鼠标距离 计算在角平分线上的投影
3.计算在角平分线上的投影点 到一边上的投影点距离 为半径
4.两个投影点连线 计算交点 计算起始点 根据起始点和圆心位置 计算圆弧

问题：
1.倒圆目前只支持直线-直线，是否需要支持 直线-圆弧 圆弧-圆弧 不需要
2.sketch输出polygon，loop的顺逆时针根据输入的线自动判断         算法自动处理  math.alg.SearchGraph.loopsToPolygonExes()
3.添加顶点的限制，任意位置还是选线添加，选线添加的话，限制条件？


<!-- 倒圆倒角后GRep添加辅助线 -->
<!-- 删除顶点 -->
<!-- 创建loop，将sketch的部分初始化逻辑移动到sketchLoop中 -->
<!-- 删除loop，生成polygon -->
<!-- 添加顶点 -->
<!-- 更新顶点 -->
<!-- 倒圆倒角逻辑完善 -->


# TODO
1.对接登录
2.开洞/补墙技术方案

roomBuilder==>build