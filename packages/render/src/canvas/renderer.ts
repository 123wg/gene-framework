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
        // 禁用所有事件监听,由container接管所有事件
        // this._stage.listening(false);
        this._bcLayer.listening(false);
        this._modelLayer.listening(false);
        // this._activeLayer.listening(false);
        this._stage.add(this._bcLayer, this._modelLayer, this._activeLayer);

        // TODO 创建一个矩形测试 测试完成删除
        const rect = new Konva.Rect({
            width: this._width,
            height: this._height,
            fill: '#1E1E2F',
            opacity: 0.5
        });

        this._bcLayer.add(rect);
        this._bcLayer.draw();


        // const rect1 = new Konva.Rect({
        //     width: 100,
        //     height: 200,
        //     x: 300,
        //     y: 100,
        //     fill: 'red',
        //     draggable: true
        // });
        // this._modelLayer.add(rect1);
        // this._modelLayer.draw();
        // 测试transformer
        // const transformer = new Konva.Transformer({
        //     nodes: [rect1]
        // });
        // this._activeLayer.add(transformer);
        // this._activeLayer.draw();

        // TODO 关闭Konva的自动更新 启动条件渲染
    }

    public updateView(): void {

    }

    public addGrep(grep: GRep): void {

    }

    public removeGRep(eId: number): void {

    }
}