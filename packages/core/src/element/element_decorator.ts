import { T_ElementConstructor } from "../type_define/type_define";
import { T_Constructor } from "../type_define/type_guard";
import { Element } from "./element";
import { elementClassManager } from "./element_class_manager";


/**Element构造函数类型*/


/**
 * DB注入
 * @param eleSerializedId element的序列化id
 * @param DBCtor 注入的db类
 */
export const injectDB = <T extends Element = Element, K extends T['db'] = T['db']>(eleSerializedId: string, DBCtor: T_Constructor<K>) => {

    // 改写db属性的get/set,达到监听的目的

    return (EleCtor: T_ElementConstructor<T>) => {
        EleCtor.prototype.createElementDB = () => {
            return new DBCtor();
        };
        EleCtor.serializedId = { ctor: eleSerializedId };
        elementClassManager.registerCls(eleSerializedId, EleCtor);
    };
};