/**
 * 渲染状态管理
 */
export class Renderstate {
    /**选中是否更新*/
    private _isSelectionUpdate = false;

    /**Element是否更新*/
    private _isElementUpdate = false;

    /**gizmo是否更新*/
    private _isGizmoUpdate = false;

    /**是否需要重新渲染*/
    private _isNeedRendering = false;

    /**是否重置画布大小*/
    private _isNeedResize = false;


    public get isSelectionUpdate() {
        return this._isSelectionUpdate;
    }

    public get isElementUpdate() {
        return this._isElementUpdate;
    }

    public get isGizmoUpdate() {
        return this._isGizmoUpdate;
    }

    public get isNeedRendering() {
        return this._isNeedRendering;
    }

    public get isNeedResize() {
        return this._isNeedResize;
    }

    public requestUpdateElement() {
        this._isElementUpdate = true;
    }

    public requestUpdateSelection() {
        this._isSelectionUpdate = true;
    }

    public requestUpdateGizmo() {
        this._isGizmoUpdate = true;
    }

    public requestUpdateView() {
        this._isNeedRendering = true;
    }

    public requestResize() {
        this._isNeedResize = true;
    }

    /**
     * 提交了一帧, 清除状态
     */
    public submittedAFrame() {
        this._isNeedRendering = false;
        this._isElementUpdate = false;
        this._isSelectionUpdate = false;
        this._isGizmoUpdate = false;
        this._isNeedResize = false;
    }
}

export const renderState = new Renderstate();