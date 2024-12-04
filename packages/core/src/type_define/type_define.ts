import { T_SerializedId } from "../element/element";
import { GNode, T_NodeGeoAttrs, T_NodeStyle } from "../grep/gnode";
import { Vec2 } from "../math/vec2";
import { Request } from "../request/request";
import { Transaction } from "../transaction/transaction";
import { T_Constructor } from "./type_guard";

/**db中需要保存的属性类型定义*/
export interface I_DBBaseProps { }

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

/**
 * 坐标类型
 */
export interface I_Vec2 {
    x: number,
    y: number
}

/**
 * 矩形类型
 */
export type T_Rect = I_Vec2 & {
    width: number,
    height: number
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

/**
 * 图元类型 和渲染库一一对应
 */
export enum EN_RenderShapeType {
    LINE = 'Line',
    CIRCLE = 'Circle',
    RECT = 'Rect',
    ARROW = 'Arrow',
    TEXT = 'Text',
    IMAGE = 'Image',
    GROUP = 'Group',
    REG_POLYGON = 'RegularPolygon'
}

/**
 * GGroup拆解出的可供渲染的图元属性
 */
export type T_GRepRenderAttrs = {
    ctorName: EN_RenderShapeType
    attrs: T_NodeGeoAttrs & T_NodeStyle
    children?: Array<T_GRepRenderAttrs>
    gnode: GNode
}

/**
 * 模型层视图变化类型
 */
export enum EN_ModelViewChanged {
    ELEMENT_CREATE,
    ELEMENT_UPDATE,
    ELEMENT_DELETE
}

/**
 * 属性的变化应该被缓存到模型视图的枚举
 */
export enum EN_PropNameShouldCacheToView {
    C_GREP = 'C_GRep',
    VISIBLE = 'visible'
}

/**
 * commitRequest发送的事件参数类型
 */
export type T_CommitRequestEventData = {
    request: Request,
    transaction: Transaction
}

/**
 * Transform decompose的结果类型
 */
export type T_TransformDecomposeResult = {
    x: number,
    y: number,
    rotation: number,
    scaleX: number,
    scaleY: number,
    skewX: number,
    skewY: number,
}

/**
 * 区间类型
 */
export type T_Interval = [number, number]

/**
 * 几何吸附类型
 */
export enum EN_GeoSnapType {
    POINT_POINT = 'p.p',
    POINT_LINE = 'p.l'
}

/**
 * 几何吸附返回结果
 */
export type T_GeoSnapResult<T> = {
    /**类型*/
    type: EN_GeoSnapType,
    /**吸附的几何体*/
    geo: T
    /**dx值*/
    dx: number
    /**dy值*/
    dy: number
    /**吸附到的点*/
    snapPos: Vec2
    /**吸附距离*/
    distance: number
}

/**
 * 吸附结果
 */
export type T_SnapResult = {
    dx: number,
    dy: number,
    snapPos: Vec2,
    snapped: boolean
}

/**
 * 吸附类型
 */
export enum EN_SnapType {
    /**点吸多点*/
    POINT_TO_POINTS = 'p.ps',
    /**点吸多线*/
    POINT_TO_LINES = 'p.ls',
    /**点吸多个水平竖直线*/
    POINTS_TO_HVLINES = 'ps.hvls'
}