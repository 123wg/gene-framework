/**
 * 吸附设置
 */
export class SnapSetting {
    /**点点吸附强度*/
    private _ppDistance = 3;

    /**点线吸附强度*/
    private _plDistance = 3;

    public static _instance: SnapSetting;

    public static instance() {
        if (!this._instance) {
            this._instance = new SnapSetting();
        }
        return this._instance;
    }


    public get ppDistance() {
        return this._ppDistance;
    }

    public set ppDistance(value: number) {
        this._ppDistance = value;
    }

    public get plDistance() {
        return this._plDistance;
    }

    public set plDistance(value: number) {
        this._plDistance = value;
    }

    /**
     * 重置到默认值
     */
    public reset() {
        this._ppDistance = 3;
        this._plDistance = 3;
    }
}