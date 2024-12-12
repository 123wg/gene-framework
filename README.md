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
```
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
```
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
