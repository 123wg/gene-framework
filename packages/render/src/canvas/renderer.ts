import Konva from "konva";
import { T_RendererParams } from "../type_define/type_define";

/**
 * 渲染器
 */
export class Renderer {
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
        this._container = params.container;
        this._width = params.width ?? params.container.clientWidth;
        this._height = params.height ?? params.container.clientHeight;
        this._initStage();
    }

    private _initStage() {
        this._stage = new Konva.Stage({
            container: this._container,
            width: this._width,
            height: this._height,
            draggable: true
        });

        this._bcLayer = new Konva.Layer({
            listening: false
        });
        this._modelLayer = new Konva.Layer();
        this._activeLayer = new Konva.Layer();
        this._stage.add(this._bcLayer, this._modelLayer, this._activeLayer);

        // TODO 创建一个矩形测试
        const rect = new Konva.Rect({
            width: this._width,
            height: this._height,
            fill: '#1E1E2F',
            opacity: 0.5
        });

        this._bcLayer.add(rect);
        this._bcLayer.draw();


        setInterval(() => {
            const pos = this._stage.getPointerPosition();
            console.log(pos);
        }, 1000);
    }
}