/**
 * 渲染状态管理
 */
export class Renderstate {
    /**选中是否更新*/
    private _isSelectionUpdate = false;

    /**Element是否更新*/
    private _isElementUpdate = false;

    /**是否需要重新渲染*/
    private _isNeedRendering = false;

    public get isSelectionUpdate() {
        return this._isSelectionUpdate;
    }

    public get isElementUpdate() {
        return this._isElementUpdate;
    }

    public get isNeedRendering() {
        return this._isNeedRendering;
    }

    public requestUpdateElement() {
        this._isElementUpdate = true;
    }

    public requestUpdateSelection() {
        this._isSelectionUpdate = true;
    }

    public requestUpdateView() {
        this._isNeedRendering = true;
    }

    /**
     * 提交了一帧, 清除状态
     */
    public submittedAFrame() {
        this._isNeedRendering = false;
        this._isElementUpdate = false;
        this._isSelectionUpdate = false;
    }
}

export const renderState = new Renderstate();