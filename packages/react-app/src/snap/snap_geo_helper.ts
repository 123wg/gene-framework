import { Ln2, MathUtil, TransformElement, Vec2 } from "@gene/core";
import { PipeElement } from "@gene/editor-sdk";
import { app } from "@gene/platform";

/**
 * 获取吸附时几何数据的辅助类
 */
export class SnapGeoHelper {
    /**
     * 根据点生成45度间隔线
     */
    public static getAngleLineByPoint(point: Vec2) {
        const lines: Ln2[] = [];
        for (let i = 0; i < 4; i += 1) {
            const dir = Vec2.X().vecRotate(Math.PI / 4 * i);
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
     * 获取变换图元变换后角点
     */
    public static getAllTransformedCorners() {
        const transEles = app.doc.filterElements(ele => ele.isLike(TransformElement)) as TransformElement[];
        const points: Vec2[] = [];
        transEles.forEach(ele => {
            const transform = ele.getTransform();
            const rect = ele.getGRep().getClientRect();
            const rPoints = MathUtil.getCornerPoints(rect);
            rPoints.forEach(p => {
                const realPos = transform.point(p);
                points.push(new Vec2(realPos));
            });
        });
        return points;
    }

    /**
     * 获取绘制管道时可吸附点
     */
    public static getPipeDrawSnapPoints() {
        const ps1 = this.getAllPipePoints();
        const ps2 = this.getAllTransformedCorners();
        const points = ps1.concat(ps2);
        return points;
    }
}