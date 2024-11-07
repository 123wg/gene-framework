import Konva from "konva";
import { T_GizmoRenderData, T_RendererParams } from "../type_define/type_define";
import { GRep, IRender } from "@gene/core";
import { EN_RenderShapeType, T_GRepRenderAttrs } from "@gene/core";
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

    /**grepId和生成图元的映射*/
    private _modelEidToGroup: Map<number, Konva.Group> = new Map();

    /**
     * 选中ElementId和生成图元映射
     */
    private _selectionEidToGroup: Map<number, Konva.Group> = new Map();

    /**
     * GizmoId和生成图元映射
     */
    private _gizmoIdToGroup: Map<number, Konva.Group> = new Map();

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
        this._modelLayer.listening(false);
        this._activeLayer.listening(false);
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
        Konva.autoDrawEnabled = false;
    }

    public updateView(): void {
        renderState.requestUpdateView();
    }

    /**
     * 添加Element关联GRep
     */
    public addGrep(grep: GRep): void {
        const group = this._GRepToGroup(grep);
        this._modelEidToGroup.set(grep.elementId.asInt(), group);
        this._modelLayer.add(group);
        renderState.requestUpdateElement();
    }

    /**
     * 移除Element关联GRep
     */
    public removeGRep(eId: number): void {
        const group = this._modelEidToGroup.get(eId);
        if (group) {
            group.destroy();
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
            this._selectionEidToGroup.set(eid, group);
            groups.push(group);
        }
        this._activeLayer.add(...groups);
        renderState.requestUpdateSelection();
    }

    /**
     * 清理选中
     */
    public clearSelection(): void {
        for (const g of this._selectionEidToGroup.values()) {
            g.destroy();
        }
        this._selectionEidToGroup.clear();
        renderState.requestUpdateSelection();
    }

    /**
     * 添加Gizmo关联GRep
     */
    private _addGizmoGRep(data: T_GizmoRenderData) {
        if (data.grep) {
            const group = this._gizmoIdToGroup.get(data.gizmoId);
            if (group) this._removeGizmoGRep(data.gizmoId);
            const newGroup = this._GRepToGroup(data.grep);
            this._gizmoIdToGroup.set(data.gizmoId, newGroup);
            renderState.requestUpdateGizmo();
        }
    }

    /**
     * 移除gizmo关联grep
     */
    private _removeGizmoGRep(gizmoId: number) {
        const group = this._gizmoIdToGroup.get(gizmoId);
        if (group) {
            group.destroy();
            renderState.requestUpdateGizmo();
        }
    }

    /**
     * GRep转渲染的Group
     */
    private _GRepToGroup(grep: GRep): Konva.Group {
        const renderAttrs = grep.getChildrenRenderAttrs();
        const attrsToGroup = (attrs: T_GRepRenderAttrs) => {
            const children: Array<Konva.Shape | Konva.Group> = [];
            for (const child of attrs.children || []) {
                if (child.ctorName === EN_RenderShapeType.GROUP) {
                    children.push(attrsToGroup(child));
                } else {
                    const node = new Konva[child.ctorName](child.attrs);
                    children.push(node);
                }
            }
            const group = new Konva.Group(attrs.attrs);
            group.add(...children);
            return group;
        };

        const group = attrsToGroup(renderAttrs);
        return group;
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
            console.log('渲染===');

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