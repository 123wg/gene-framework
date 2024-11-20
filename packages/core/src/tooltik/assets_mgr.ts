/**
 * 静态资源管理器
 * 目前主要用来处理图片预加载,解决同步渲染问题
 */
export class AssetsMgr {

    private _imgMap: Map<string, HTMLOrSVGImageElement> = new Map();

    private static _instance: AssetsMgr;

    public static instance() {
        if (!this._instance) {
            this._instance = new AssetsMgr();
        }
        return this._instance;
    }

    /**
     * 预加载图片
     */
    public async preloadImg(src: string[]) {
        const promiseArr: Array<Promise<HTMLOrSVGElement>> = [];
        src.forEach(_ => {
            if (this._imgMap.has(_)) return;
            const image = new Image();
            image.src = _;
            const promise = new Promise<HTMLOrSVGElement>((resolve) => {
                image.onload = () => {
                    this._imgMap.set(_, image);
                    resolve(image);
                };
            });
            promiseArr.push(promise);
        });
        await Promise.all(promiseArr);
    }

    /**
     * 获取图片对象
     */
    public getImage(src: string) {
        return this._imgMap.get(src);
    }

    /**
     * 获取图片对象
     */
    public getImageEnsure(src: string) {
        const image = this.getImage(src);
        if (!image) throw new Error('图片不存在');
        return image;
    }

    /**
     * 随机给一个图片路径
     */
    public randomImgSrc() {
        const length = this._imgMap.size;
        const srcs = Array.from(this._imgMap.keys());
        return srcs[Math.floor(Math.random() * length)];
    }
}