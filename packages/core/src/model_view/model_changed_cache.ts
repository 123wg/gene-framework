import { Element } from "../element/element";
import { EN_ModelViewChanged } from "../type_define/type_define";

/**
 * 缓存视图发生的变化,当用户调用updateView时才会刷新视图,并清空缓存
 */
export class ModelChangedCache {
    public container = new Map<EN_ModelViewChanged, Set<number>>();

    // TODO 选择集

    constructor() {
        this.container.set(EN_ModelViewChanged.ELEMENT_CREATE, new Set());
        this.container.set(EN_ModelViewChanged.ELEMENT_UPDATE, new Set());
        this.container.set(EN_ModelViewChanged.ELEMENT_DELETE, new Set());
    }

    /**
     * 是否发生改变
     */
    public isChanged() {
        for (const set of this.container.values()) {
            if (set.size) return true;
        }
        return false;
    }


    /**
     * 缓存变化的Element
     */
    public cacheElementChanged(type: EN_ModelViewChanged, elements: Element[]) {
        const fElements = elements.filter(_ => !_.getStaticConfig()?.dontShowView);
        const modifiedContainer = this.container.get(EN_ModelViewChanged.ELEMENT_CREATE);
        const deleteContainer = this.container.get(EN_ModelViewChanged.ELEMENT_DELETE);
        if (EN_ModelViewChanged.ELEMENT_CREATE === type || EN_ModelViewChanged.ELEMENT_UPDATE === type) {
            fElements.forEach(e => {
                if (deleteContainer?.has(e.id.asInt())) {
                    deleteContainer.delete(e.id.asInt());
                }
                modifiedContainer?.add(e.id.asInt());
            });
        } else if (EN_ModelViewChanged.ELEMENT_DELETE === type) {
            fElements.forEach(e => {
                if (modifiedContainer?.has(e.id.asInt())) {
                    modifiedContainer.delete(e.id.asInt());
                }
                deleteContainer?.add(e.id.asInt());
            });
        }
    }

    /**
     * 清空缓存
     */
    public clear() {
        for (const set of this.container.values()) {
            set.clear();
        }
    }
}