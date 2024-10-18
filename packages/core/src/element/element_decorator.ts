import { DBElement, I_DBElementProps } from "../db/db_element";
import { T_ElementConstructor } from "../type_define/type_define";
import { T_Constructor } from "../type_define/type_guard";
import { Element } from "./element";
import { elementClassManager } from "./element_class_manager";

/**
 * DB注入
 * @param eleSerializedId element的序列化id
 * @param DBCtor 注入的db类
 */
export const injectDB = <T extends Element>
    (eleSerializedId: string, DBCtor: T_Constructor<T['db']>) => {

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


export function watchDBProperties<T extends DBElement<K>, K extends I_DBElementProps>(DBCtor: T_Constructor<T>) {
    const dbObj = new DBCtor();
    const propertieNames = Object.keys(dbObj).filter(key => !key.startsWith('_'));

    propertieNames.forEach((propertyName) => {
        const propName = propertyName as keyof K;

        Object.defineProperty(DBCtor.prototype, propertyName, {
            set(this:K,value) {
                // 设置逻辑
            },

            get(this: T) {
                if (this.cache[propName] !== undefined) {
                    return this.cache[propName];
                }
                return this.db[propName];
            }
        });
    });
}
