import Konva from "konva";
import { T_GizmoRenderData, T_RendererParams } from "../type_define/type_define";
import { GRep, IRender, T_XY } from "@gene/core";
import { T_GRepRenderAttrs } from "@gene/core";
import { renderState } from "./render_state";
import { GizmoMgr } from "../gizmo/gizmo_mgr";
import { RenderConfig } from "../toolkit/render_config";
import { RenderBucket } from "./render_bucket";

/**
 * 渲染器
 */
export class Renderer extends IRender {
    private _container: HTMLDivElement;

    /**
     * 对象存储桶,存储各种映射关系
     */
    private bucket: RenderBucket;

    private _width: number;

    private _height: number;

    /**舞台*/
    private _stage: Konva.Stage;

    /**背景层*/
    private _bcLayer: Konva.Layer;

    /**模型层*/
    private _modelLayer: Konva.Layer;

    /**交互层*/
    private _activeLayer: Konva.Layer;

    /**背景对象*/
    private _bcRect: Konva.Rect;


    constructor(params: T_RendererParams) {
        super();
        this._container = params.container;
        this._width = params.width ?? params.container.clientWidth;
        this._height = params.height ?? params.container.clientHeight;
        this.bucket = new RenderBucket();
        GizmoMgr.instance().setRender(this);
        this._initStage();
        this.render();
    }

    /**
     * 画布初始化&背景
     */
    private _initStage() {
        // 关闭自动绘制
        Konva.autoDrawEnabled = false;
        // Stage的构造函数中会默认给创建出的div绑定一堆事件,在此禁掉
        Konva.Stage.prototype._bindContentEvents = () => {
            console.log('去除事件绑定');
        };

        this._stage = new Konva.Stage({
            container: this._container,
            width: this._width,
            height: this._height
        });
        this._bcLayer = new Konva.Layer();
        this._modelLayer = new Konva.Layer();
        this._activeLayer = new Konva.Layer();

        // 禁用layer层事件监听 由框架层接管
        this._bcLayer.listening(false);
        // TODO 这里放开不知道会不会影响性能，但是不放开的话Layer上无法获取选中图形
        // this._modelLayer.listening(false);
        // this._activeLayer.listening(false);

        this._stage.add(this._bcLayer, this._modelLayer, this._activeLayer);

        // 创建背景
        this._bcRect = new Konva.Rect({
            width: this._width,
            height: this._height,
            fillRadialGradientStartPoint: { x: this._width / 2, y: this._height / 2 }, // 椭圆中心
            fillRadialGradientEndPoint: { x: this._width / 2, y: this._height / 2 },   // 椭圆终点
            fillRadialGradientStartRadius: 0,                                             // 从中心开始
            fillRadialGradientEndRadius: Math.max(this._width, this._height),         // 椭圆半径（最大值）
            ...RenderConfig.stageBcStyle
        });

        this._bcLayer.add(this._bcRect);
        this._bcLayer.draw();
    }

    /**
     * GRep转渲染的Group
     * @param grep 要转换的grep
     * @param saveKnodeToGNode 是否保存knode和gnode的关联关系
     * @returns Konva.Group
     */
    private _GRepToGroup(grep: GRep, saveKnodeToGNode = false): Konva.Group {
        const renderAttr = grep.getRenderAttr();
        const attrsToGroup = (attrs: T_GRepRenderAttrs[]) => {
            const children: Array<Konva.Group | Konva.Shape> = [];
            attrs.forEach(attr => {
                // @ts-expect-error GRep层确保attr和Konva对应正确
                const node = new Konva[attr.ctorName](attr.attrs);
                if (saveKnodeToGNode) this.bucket.setKnodeGnode(node, attr.gnode);
                if (attr.children) {
                    (node as Konva.Group).add(...attrsToGroup(attr.children));
                }
                children.push(node);

                // 设置矩形外框,无math库的hack操作,不一定准确
                attr.gnode.setClientRect(node.getClientRect({ skipTransform: true }));
            });
            return children;
        };

        const groups = attrsToGroup([renderAttr]);
        if (saveKnodeToGNode) this.bucket.setKnodeGnode(groups[0], renderAttr.gnode);
        return groups[0] as Konva.Group;
    }

    /**
     * 添加Element关联GRep
     */
    public addGrep(grep: GRep): void {
        const group = this._GRepToGroup(grep, true);
        this.bucket.setEidGroup(grep.elementId.asInt(), group);
        this._modelLayer.add(group);
        renderState.requestUpdateElement();
    }

    /**
     * 移除Element关联GRep
     */
    public removeGRep(eId: number): void {
        const group = this.bucket.getEidGroup(eId);
        if (group) {
            this.bucket.delKnodeGNodeByGroup(group);
            group.destroy();
            this.bucket.delEidGroup(eId);
            renderState.requestUpdateElement();
        }
    }

    /**
     * 绘制选中
     */
    public drawSelections(greps: GRep[]): void {
        const groups: Konva.Group[] = [];
        for (const grep of greps) {
            const group = this._GRepToGroup(grep);
            const eid = grep.elementId.asInt();
            this.bucket.setSelEidGroup(eid, group);
            groups.push(group);
        }
        this._activeLayer.add(...groups);
        renderState.requestUpdateSelection();
    }

    /**
     * 清理选中
     */
    public clearSelection(): void {
        const groups = this.bucket.getAllSelIdGroups();
        groups.forEach(_ => _.destroy());
        this.bucket.clearSelEidGroupMap();
        renderState.requestUpdateSelection();
    }

    /**
     * 添加Gizmo关联GRep
     */
    private _addGizmoGRep(data: T_GizmoRenderData) {
        if (data.grep) {
            const group = this.bucket.getGizmoIdGroup(data.gizmoId);
            if (group) this._removeGizmoGRep(data.gizmoId);
            const newGroup = this._GRepToGroup(data.grep, true);
            this.bucket.setGizmoIdGroup(data.gizmoId, newGroup);
            this._activeLayer.add(newGroup);
            renderState.requestUpdateGizmo();
        }
    }

    /**
     * 移除gizmo关联grep
     */
    private _removeGizmoGRep(gizmoId: number) {
        const group = this.bucket.getGizmoIdGroup(gizmoId);
        if (group) {
            this.bucket.delKnodeGNodeByGroup(group);
            group.destroy();
            renderState.requestUpdateGizmo();
        }
    }

    /**
     * 选择Element对应的GNode
     */
    public pickElement(pos: T_XY) {
        const knode = this._modelLayer.getIntersection(pos);
        if (knode) {
            const gNode = this.bucket.getKnodeGnode(knode);
            return gNode;
        }
    }

    /**
     * 选择Gizmo对应的GNode
     */
    public pickGizmo(pos: T_XY) {
        const knode = this._activeLayer.getIntersection(pos);
        if (knode) {
            const gnode = this.bucket.getKnodeGnode(knode);
            return gnode;
        }
    }

    /**
     * 更新视图
     */
    public updateView(): void {
        renderState.requestUpdateView();
    }

    /**
     * 执行渲染
     */
    public render() {
        const { update, remove } = GizmoMgr.instance().onBeforeRender();
        remove.forEach(gId => {
            this._removeGizmoGRep(gId);
        });
        update.forEach(data => {
            this._addGizmoGRep(data);
        });


        if (renderState.isNeedRendering) {
            if (renderState.isElementUpdate) {
                this._modelLayer.draw();
            }
            if (renderState.isSelectionUpdate || renderState.isGizmoUpdate) {
                this._activeLayer.draw();
            }
            if (renderState.isNeedResize) {
                this.onResize();
            }
            renderState.submittedAFrame();
        }
        window.requestAnimationFrame(() => this.render());
    }

    /**
     * 鼠标事件转位置
     */
    public mouseEventToStagePos(event: MouseEvent): T_XY {
        this._stage.setPointersPositions(event);
        const pos = this._stage.getPointerPosition();
        return { x: pos?.x ?? 0, y: pos?.y ?? 0 };
    }

    /**
     * 重置渲染器大小
     */
    public onResize() {
        this._width = this._container.clientWidth;
        this._height = this._container.clientHeight;
        this._stage.width(this._width);
        this._stage.height(this._height);
        this._bcRect.width(this._width);
        this._bcRect.height(this._height);
        this._bcRect.fillRadialGradientStartPoint({ x: this._width / 2, y: this._height / 2 });
        this._bcRect.fillRadialGradientEndPoint({ x: this._width / 2, y: this._height / 2 });
        this._bcRect.fillRadialGradientEndRadius(Math.max(this._width, this._height));
        this._stage.batchDraw();
    }
}