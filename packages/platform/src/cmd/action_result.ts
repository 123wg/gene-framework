import { EN_ActionStatus } from "../type_define/type_define";

/**
 * Action返回结果
 */
export class ActionResult<T> {
    private _status: EN_ActionStatus;

    private _data?: T;

    constructor(status: EN_ActionStatus, data?: T) {
        this._status = status;
        this._data = data;
    }

    public get data() {
        return this._data;
    }

    public get isSuccess(): boolean {
        return this._status === EN_ActionStatus.OK;
    }

    public get isCanceled(): boolean {
        return this._status === EN_ActionStatus.CANCEL;
    }
}