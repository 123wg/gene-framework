import Konva from "konva";

export class RenderConfig {
    /**场景默认背景样式*/
    public static stageBcStyle: Konva.RectConfig = {
        fillRadialGradientColorStops: [
            0, '#00264d',   // 中间深蓝
            0.5, '#001020', // 过渡到更深的蓝
            1, '#00264d'    // 最外围接近黑色
        ],
    };
}