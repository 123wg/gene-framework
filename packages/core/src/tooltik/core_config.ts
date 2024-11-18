import { T_CircleStyle } from "../grep/gcircle";

export class CoreConfig {
    /**管道内部线颜色*/
    public static pipeInnerStroke = '#406080';

    /**管道外部线颜色*/
    public static pipeOuterStroke = '#204060';

    /**管道外部线宽*/
    public static pipeOuterWidth = 10;

    /**管道内部线宽*/
    public static pipeInnerWidth = 5;

    /**管道内部线dash*/
    public static pipeInnerDash = [19, 5];

    /**默认圆样式*/
    public static circleStyle: T_CircleStyle = {
        stroke: '#4a70a3',
        strokeWidth: 5,
    };
}