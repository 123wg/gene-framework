import { T_SerializedId } from "../element/element";
import { T_Constructor } from "./type_guard";


/**db中需要保存的属性类型定义*/
export interface I_DBBaseProps { }

/**提取DBElement的泛型*/
// export type T_DBElementGeneric<T> = T extends DBBase<infer P> ? P : never;

/**
 * Element的构造函数类型
 */
export type T_ElementConstructor<T> = T_Constructor<T> & {
    serializedId: T_SerializedId
}

/**Element静态配置类型*/
export type T_ElementStaticConfig = {
    /**不保存到文件*/
    dontSave?: boolean
    /**不在视图中显示*/
    dontShowView?: boolean
}

export interface I_SignalEvent<S, D> {
    type?: string
    subject?: S
    data?: D
}

export type T_SignalCallbackFn<S = unknown, D = unknown> = (data: I_SignalEvent<S, D>) => void

export interface I_SignalCallbackItem<S = unknown, D = unknown> {
    listener?: unknown
    fn: T_SignalCallbackFn<S, D>;
}

/**Element修改的属性类型*/
export type T_ModifiedProps = {
    propertyName: string;
    oldValue: unknown;
    newValue: unknown;
}

export type T_XY = {
    x: number,
    y: number
}

/**线连接处样式*/
export enum EN_LineJoin {
    /**圆角*/
    round = 'round',
    /**斜角*/
    bevel = 'bevel',
    /**尖角*/
    miter = 'miter'
}
/**线末端样式*/
export enum EN_LineCap {
    /**平头*/
    butt = 'butt',
    /**圆头*/
    round = 'round',
    /**方头*/
    square = 'square'
}

/**渲染节点公共样式*/
export type T_NodeStyle = {
    opacity?: number
}

export type T_ShapeStyle = T_NodeStyle & {
    fill?: string | CanvasGradient;
    stroke?: string | CanvasGradient;
    strokeWidth?: number;
    lineJoin?: EN_LineJoin;
    lineCap?: EN_LineCap;
    dash?: number[];
    dashOffset?: number;
}

export type T_LineStyle = T_ShapeStyle & {}

export type T_Style = {
    line?: T_LineStyle
}

export type T_NodeAttrs = T_NodeStyle & {
    id?: string
    x?: number;
    y?: number;
    width?: number;
    height?: number;
}

export type T_ShapeAttrs = T_NodeStyle & {}

export type T_LineAttrs = T_LineStyle & {
    points: number[]
}

/**
 * 模型层视图变化类型
 */
export enum EN_ModelViewChanged {
    ELEMENT_CREATE,
    ELEMENT_UPDATE,
    ELEMENT_DELETE
}