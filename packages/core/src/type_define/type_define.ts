import { T_SerializedId } from "../element/element";
import { T_Constructor } from "./type_guard";

/**
 * Element的构造函数类型
 */
export type T_ElementConstructor<T> = T_Constructor<T> & {
    serializedId: T_SerializedId
}