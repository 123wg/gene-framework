import { Element } from "../element/element";
import { EN_ModelViewChanged } from "../type_define/type_define";

/**
 * 缓存视图发生的变化,当用户调用updateView时才会刷新视图,并清空缓存
 */
export class ModelChangedCache {
    public container = new Map<EN_ModelViewChanged, Set<number>>();

    constructor() {
        this.container.set(EN_ModelViewChanged.ELEMENT_CREATE, new Set());
        this.container.set(EN_ModelViewChanged.ELEMENT_UPDATE, new Set());
        this.container.set(EN_ModelViewChanged.ELEMENT_DELETE, new Set());
    }


    /**
     * 缓存变化的Element
     */
    public cacheElementChanged(type: EN_ModelViewChanged, elements: Element[]) {
        const elements = elements.filter(_ => !_.getStaticConfig()?.dontShowView);
        // const modifiedContainer = 
    }
}