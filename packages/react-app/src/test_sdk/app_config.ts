import { T_CircleStyle } from "@gene/core/src/grep/gcircle";

export class AppConfig {
    /**绘制圆时预览线样式*/
    public static circlePreviewStyle: T_CircleStyle = {
        stroke: '#00d4ff',
        strokeWidth: 1,
        dash: [5, 5]
    };
}