import Konva from "konva";
import { T_GizmoRenderData, T_RendererParams } from "../type_define/type_define";
import { GNode, GRep, IRender, T_XY } from "@gene/core";
import { T_GRepRenderAttrs } from "@gene/core";
import { renderState } from "./render_state";
import { GizmoMgr } from "../gizmo/gizmo_mgr";

/**
 * 渲染器
 */
export class Renderer extends IRender {
    private _container: HTMLDivElement;

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

    /**
     * 图元id到Konva节点映射
     */
    private _eIdToGroupMap: Map<number, Konva.Group> = new Map();

    /**
     * Konva节点到GNode映射
     */
    private _shapeToGNodeMap: Map<Konva.Shape, GNode> = new Map();

    /**
     * 图元id到Konva节点id集合映射
     */
    private _eIdToShapeIdsMap: Map<number, Set<string>> = new Map();

    /**
     * 选中图元id到konva节点映射
     */
    private _selIdToGroupMap: Map<number, Konva.Group> = new Map();


    /**gizmoId到Konva节点映射*/
    private _gizmoIdToGroupMap: Map<number, Konva.Group> = new Map();

    constructor(params: T_RendererParams) {
        super();
        this._container = params.container;
        this._width = params.width ?? params.container.clientWidth;
        this._height = params.height ?? params.container.clientHeight;
        GizmoMgr.instance().setRender(this);
        this._initStage();
        this.render();
    }

    /**
     * 画布初始化&背景
     */
    // TODO 对背景提供更多操作
    private _initStage() {
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
        // this._modelLayer.listening(false);
        // this._activeLayer.listening(false);
        this._stage.add(this._bcLayer, this._modelLayer, this._activeLayer);

        // 创建背景
        const rect = new Konva.Rect({
            width: this._width,
            height: this._height,
            fill: 'black',
            // opacity: 0.5
        });

        this._bcLayer.add(rect);
        this._bcLayer.draw();

        // 关闭自动绘制
        // Konva.autoDrawEnabled = false;
        // this._stage.on('mousemove', (e) => {
        //     this.pick({
        //         x: e.evt.pageX,
        //         y: e.evt.pageY
        //     });
        // });
    }

    /**
     * GRep转渲染的Group
     * @param grep 要转换的grep
     * @param shapeGNodeMap 转换后Konva.Shape到GNode的映射关系
     * @param eIdToShapeIdsMap 转换后eId到Shape.id集合映射关系
     * @returns Konva.Group
     */
    private _GRepToGroup(grep: GRep, shapeGNodeMap?: Map<Konva.Shape, GNode>, eIdToShapeIdsMap?: Map<number, Set<string>>): Konva.Group {
        const renderAttr = grep.getRenderAttr();
        const attrsToGroup = (attrs: T_GRepRenderAttrs[]) => {
            const children: Array<Konva.Group | Konva.Shape> = [];
            attrs.forEach(attr => {
                const node = new Konva[attr.ctorName](attr.attrs);
                if (attr.children) {
                    (node as Konva.Group).add(...attrsToGroup(attr.children));
                }
                if (attr.grep.canPick()) {
                    shapeGNodeMap?.set((node as Konva.Shape), attr.grep);
                    const shapeIds = eIdToShapeIdsMap?.get(attr.grep.elementId.asInt());
                    if (shapeIds) shapeIds.add(node.id());
                    else eIdToShapeIdsMap?.set(attr.grep.elementId.asInt(), new Set([node.id()]));
                }
                children.push(node);
            });
            return children;
        };

        const groups = attrsToGroup([renderAttr]);
        return groups[0] as Konva.Group;
    }

    /**
     * 添加Element关联GRep
     */
    public addGrep(grep: GRep): void {
        const group = this._GRepToGroup(grep, this._shapeToGNodeMap, this._eIdToShapeIdsMap);
        this._eIdToGroupMap.set(grep.elementId.asInt(), group);
        this._modelLayer.add(group);
        renderState.requestUpdateElement();
    }

    /**
     * 移除Element关联GRep
     */
    public removeGRep(eId: number): void {
        const group = this._eIdToGroupMap.get(eId);
        if (group) {
            const groupIdSet = this._eIdToShapeIdsMap.get(eId);
            this._shapeToGNodeMap.forEach((_, shape) => {
                if (groupIdSet?.has(shape.id())) this._shapeToGNodeMap.delete(shape);
            });
            this._eIdToShapeIdsMap.delete(eId);
            group.destroy();
            this._eIdToGroupMap.delete(eId);
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
            this._selIdToGroupMap.set(eid, group);
            groups.push(group);
        }
        this._activeLayer.add(...groups);
        renderState.requestUpdateSelection();
    }

    /**
     * 清理选中
     */
    public clearSelection(): void {
        for (const g of this._selIdToGroupMap.values()) {
            g.destroy();
        }
        this._selIdToGroupMap.clear();
        renderState.requestUpdateSelection();
    }

    /**
     * 添加Gizmo关联GRep
     */
    private _addGizmoGRep(data: T_GizmoRenderData) {
        if (data.grep) {
            const group = this._gizmoIdToGroupMap.get(data.gizmoId);
            if (group) this._removeGizmoGRep(data.gizmoId);
            const newGroup = this._GRepToGroup(data.grep);
            this._gizmoIdToGroupMap.set(data.gizmoId, newGroup);
            renderState.requestUpdateGizmo();
        }
    }

    /**
     * 移除gizmo关联grep
     */
    private _removeGizmoGRep(gizmoId: number) {
        const group = this._gizmoIdToGroupMap.get(gizmoId);
        if (group) {
            group.destroy();
            renderState.requestUpdateGizmo();
        }
    }

    /**
     * 选择Element对应的GNode
     */
    public pick(pos: T_XY) {
        const node = this._modelLayer.getIntersection(pos);
        if (node) {
            const gNode = this._shapeToGNodeMap.get(node);
            return gNode;
        }
        return undefined;
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
                this._modelLayer.batchDraw();
            }
            if (renderState.isSelectionUpdate || renderState.isGizmoUpdate) {
                this._activeLayer.batchDraw();
            }
            renderState.submittedAFrame();
        }
        window.requestAnimationFrame(() => this.render());
    }
}