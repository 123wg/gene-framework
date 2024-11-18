/**
 * 选择过滤器
 */

import { EN_RenderShapeType, GNode } from "@gene/core";
// TODO 先放这
export class PickFilter {
    /**所有可选类型*/
    public static allTypes = [
        EN_RenderShapeType.ARROW,
        EN_RenderShapeType.CIRCLE,
        EN_RenderShapeType.IMAGE,
        EN_RenderShapeType.LINE,
        EN_RenderShapeType.RECT,
        EN_RenderShapeType.TEXT
    ];

    /**过滤出的可pick类型*/
    private _filterTypes: Set<EN_RenderShapeType> = new Set();

    /**自定义的filter,返回false不允许pick*/
    private _customFilter: (ele: GNode) => boolean;

    /**
     * 允许拾取所有类型
     */
    public allowAll(): this {
        PickFilter.allTypes.forEach(type => {
            this.allow(type);
        });
        return this;
    }

    /**
     * 允许拾取某类型
     */
    public allow(type: EN_RenderShapeType) {
        this._filterTypes.add(type);
        return this;
    }

    /**
     * 不允许拾取
     */
    public disallow(type: EN_RenderShapeType) {
        this._filterTypes.delete(type);
        return this;
    }

    /**
     * 设置自定义过滤
     */
    public setCustomFilter(filter: (gnode: GNode) => boolean) {
        this._customFilter = filter;
        return this;
    }

    /**
     * 判断gnode是否允许拾取
     */
    public isEnable(gnode: GNode): boolean {
        const result = this._filterTypes.has(gnode.getShapeType());
        if (!result) return false;

        if (this._customFilter) {
            return this._customFilter(gnode);
        }
        return true;
    }
}