import Konva from "konva";
import { T_RendererParams } from "../type_define/type_define";
import { GRep, IRender } from "@gene/core";

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

    // TODO 测试添加和删除
    private _eIdToGNodesMap: Map<number, Konva.Node[]> = new Map();

    constructor(params: T_RendererParams) {
        super();
        this._container = params.container;
        this._width = params.width ?? params.container.clientWidth;
        this._height = params.height ?? params.container.clientHeight;
        this._initStage();
    }

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
            fill: '#1E1E2F',
            opacity: 0.5
        });

        this._bcLayer.add(rect);
        this._bcLayer.draw();

        // 关闭自动绘制
        Konva.autoDrawEnabled = false;
    }

    public updateView(): void {
        this._modelLayer.batchDraw();
    }

    public addGrep(grep: GRep): void {
        const nodes = grep.getChildrenRenderAttrs();
        const added = nodes.map(_ => {
            const obj = new Konva[_.ctorName](_.attrs);
            console.log(obj);
            this._modelLayer.add(obj);
            return obj;
        });
        this._eIdToGNodesMap.set(grep.elementId.asInt(), added);
    }

    public removeGRep(eId: number): void {
        const nodes = this._eIdToGNodesMap.get(eId)?.values();
        if (nodes) nodes.forEach(_ => _.destroy());
        this._eIdToGNodesMap.delete(eId);
    }
}