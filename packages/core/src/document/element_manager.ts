import { Element } from "../element/element";

export class ElementMgr {
    /**文档中所有对象*/
    private readonly _allElements:Map<number,Element>;

    /**对象的序列化ID到对象的映射*/
    private readonly _ctorToElements:Map<string,Set<Element>>;

    constructor(){
        this._allElements = new Map();
        this._ctorToElements = new Map();
    }

    /**
     * 清空element
     */
    public clear(){
        this._allElements.clear();
        this._ctorToElements.clear();
    }


    /**
     * 获取所有element
     */
    public getAllElements():Element[]{
        return [...this._allElements.values()];
    }

    public getElementsMap(){
        return this._allElements;
    }

    /**
     * 根据ID获取Element
     */
    public getElementById<T=Element>(id:number){
        return this._allElements.get(id) as T;
    }


    /**
     * 根据类名获取类的所有实例
     */
    public getElementByCtor(serializedId:string):Element[]{
        const eles = this._ctorToElements.get(serializedId);
        if(!eles) return [];
        return [...eles];
    }

    /**
     * 添加Element
     */
    public add(ele:Element, force = true){
        if(!force && this._allElements.get(ele.id.asInt())){
            return false;
        }

        this._allElements.set(ele.id.asInt(), ele);
        const eles = this._ctorToElements.get(ele.getSerialId());
        if(eles){
            eles.add(ele);
        }else {
            this._ctorToElements.set(ele.getSerialId(), new Set([ele]));
        }

        return true;
    }

    /**
     * 删除Element
     */
    public delete(ele:Element){
        this._allElements.delete(ele.id.asInt());
        const eles = this._ctorToElements.get(ele.getSerialId());
        if(eles){
            eles.delete(ele);
        }
    }
}

