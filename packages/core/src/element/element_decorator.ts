import { DBBase } from "../db/db_base";
import { T_DBCacheProps, T_ElementConstructor } from "../type_define/type_define";
import { T_Constructor } from "../type_define/type_guard";
import { Element } from "./element";
import { elementClassManager } from "./element_class_manager";

/**
 * DB注入
 * @param eleSerializedId element的序列化id
 * @param DBCtor 注入的db类
 */
export const injectDB = <T extends Element = Element, K extends T['db'] = T['db']>(eleSerializedId: string, DBCtor: T_Constructor<K>) => {

    // 改写db属性的set/get, 达到监听的目的
    watchDBProperties(DBCtor);

    return (EleCtor: T_ElementConstructor<T>) => {
        EleCtor.prototype.createElementDB = () => {
            return new DBCtor();
        };
        EleCtor.serializedId = { ctor: eleSerializedId };
        elementClassManager.registerCls(eleSerializedId, EleCtor);
    };
};


export function watchDBProperties<T extends DBBase = DBBase>(DBCtor: T_Constructor<T>) {
    const dbObj = new DBCtor();
    // TODO add prefix enum
    const propertieNames = Object.keys(dbObj).filter(key => !key.startsWith('_')) as unknown as T_DBCacheProps<T>[];

    propertieNames.forEach((propertyName) => {
        Object.defineProperty(DBCtor.prototype, propertyName, {
            set(value) {

            },

            get(this: T) {
                return this.cache[propertyName];
            }
        });
    });
}