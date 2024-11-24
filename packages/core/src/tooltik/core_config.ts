import { T_CircleStyle } from "../grep/gcircle";
import { T_LineStyle } from "../grep/gline";
import { T_ShapeStyle } from "../grep/gshape";

// TODO 业务层样式不应该放这里,只需要提供系统通用的,主题色,一些交互用到的如点默认大小等
export class CoreConfig {
    /**绘制过程中点颜色*/
    public static previewPointStroke = '#00d4ff';
    /**绘制过程点大小*/
    public static previewPointSize = 3;
    /**绘制过程中虚线颜色*/
    public static previewDashLineStroke = '#00d4ff';
    /**绘制过程中点样式*/
    public static previewPointStyle: T_CircleStyle = {
        stroke: CoreConfig.previewPointStroke,
    };
    /**绘制过程中虚线样式*/
    public static previewDashLineStyle: T_LineStyle = {
        stroke: CoreConfig.previewDashLineStroke,
        strokeWidth: 1,
        dash: [5, 5]
    };
    /**管道内部颜色*/
    public static pipeInnerStroke = '#406080';
    /**管道外部颜色*/
    public static pipeOuterStroke = '#204060';
    /**管道外部样式*/
    public static pipeOuterStyle: T_LineStyle = {
        stroke: CoreConfig.pipeOuterStroke,
        strokeWidth: 10
    };
    /**管道内部样式*/
    public static pipeInnerStyle: T_LineStyle = {
        stroke: CoreConfig.pipeInnerStroke,
        dash: [19, 5],
        strokeWidth: 5
    };
    /**圆、多边形等线绘制后样式*/
    public static defaultLineEleStyle: T_ShapeStyle = {
        stroke: '#4a70a3',
        strokeWidth: 2
    };

    /**预览图片默认宽度*/
    public static previewImgWidth = 100;

    /**变换器点默认样式*/
    public static resizeGizmoPointStyle: T_CircleStyle = {
        stroke: CoreConfig.previewPointStroke,
        strokeWidth: 1,
        fill: 'white'
    };

    /**变换器背景样式*/
    public static resizeGizmoBgStyle: T_ShapeStyle = {
        stroke: CoreConfig.previewPointStroke,
        strokeWidth: 1
    };
}