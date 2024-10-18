/**
 * Element元素装饰器
 * 用于处理db注入和属性更新监听
 */

import { T_Constructor } from "../type_guard";
import { Element } from "./element";


export const injectDB = <T extends Element = Element>(clsSerializeId: string, dbCls: T_Constructor<T['db']>) => {
    return (elementCls: T){

    }
};
