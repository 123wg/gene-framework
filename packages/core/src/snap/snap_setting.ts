/**
 * 吸附设置
 */
export class SnapSetting {
    /**点点吸附强度*/
    private _ppDistance: number;

    /**点线吸附强度*/
    private _plDistance: number;

    public static _instance: SnapSetting;

    public static instance() {
        if (!this._instance) {
            this._instance = new SnapSetting();
        }
        return this._instance;
    }

    constructor() {
        this.reset();
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
        this._ppDistance = 4;
        this._plDistance = 4;
    }
}