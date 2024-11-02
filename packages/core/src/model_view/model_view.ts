import { ModelChangedCache } from "./model_changed_cache";

/**
 * ModelView,模型层视图,与UI无关的view
 * 将刷新视图的接口开放给用户,只有用户主动调用了刷新视图的接口,视图才刷新,否则只将变化缓存
 */
export class ModelView {
    // TODO 关联的渲染器

    /**
     * 视图缓存
     */
    public readonly cacheForView = new ModelChangedCache();

}