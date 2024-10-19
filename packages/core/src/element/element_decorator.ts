import { DBElement, I_DBElementProps } from "../db/db_element";
import { I_Document } from "../document/i_document";
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

        Object.defineProperty(DBCtor.prototype, propName, {
            set(this:T, value:K[typeof propName]) {
                const doc:I_Document = this.getDoc();

                // id合法说明Element进入了doc容器
                const e = doc.getElementById(this.id);
                if(e){
                    // 非临时对象需要再事务中修改
                    if(!e.isTemporary()){
                        doc.checkIfCanModifyDoc();
                        // TODO  通知undoredoEntity修改的element
                        this.cache[propName] = value;
                    }else {
                        this.db[propName] = value;
                    }
                    // TODO 判断如果需要将变化缓存到view层的 通知
                }else{
                    this.db[propName] = value;
                }
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
