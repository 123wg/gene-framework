import { Ln2, TransformElement, Vec2 } from "@gene/core";
import { PipeElement } from "@gene/editor-sdk";
import { app } from "@gene/platform";

/**
 * 获取吸附时几何数据的辅助类
 */
export class SnapGeoHelper {
    /**
     * 根据点生成45度间隔线
     */
    public static getLinesRotate45(point: Vec2) {
        const lines: Ln2[] = [];
        for (let i = 0; i < 4; i += 1) {
            const dir = Vec2.X().vecRotate(Math.PI / 4 * i);
            const line = new Ln2(point, point.added(dir));
            lines.push(line);
        }
        return lines;
    }

    /**
     * 根据点生成90度间隔线
     */
    public static getLinesRotate90(point: Vec2) {
        const lines: Ln2[] = [];
        for (let i = 0; i < 2; i += 1) {
            const dir = Vec2.X().vecRotate(Math.PI / 2 * i);
            const line = new Ln2(point, point.added(dir));
            lines.push(line);
        }
        return lines;
    }

    /**
     * 获取所有管道点
     */
    public static getAllPipePoints() {
        const pipes = app.doc.getAllElementsByCtor(PipeElement);
        const pPoints = pipes.reduce<Vec2[]>((points, pipe) => {
            const arr = pipe.points.map(p => new Vec2(p));
            return points.concat(arr);
        }, []);
        return pPoints;
    }

    /**
     * 获取绘制管道时可吸附点
     */
    public static getPipeDrawSnapPoints() {
        const ps1 = this.getAllPipePoints();
        const transEles = app.doc.filterElements(ele => ele.isLike(TransformElement)) as TransformElement[];
        const ps2 = transEles.map(ele => ele.getTransformedCorners()).flat();
        const points = ps1.concat(ps2);
        return points;
    }
}