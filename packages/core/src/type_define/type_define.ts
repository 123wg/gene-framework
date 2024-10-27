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
    x:number,
    y:number
}
