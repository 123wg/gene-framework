// import { Ln2, MathUtil, Vec2 } from "@gene/core";
// import { ImageElement } from "@gene/editor-sdk";
// import { app } from "@gene/platform";

// /**
//  * 点吸附返回结果
//  */
// export type T_PointSnapResult = {
//     distance: number,
//     pos: Vec2
// }


// /**
//  * 点吸附点和线测试
//  */
// export class PPLSnap {
//     private _point: Vec2;

//     private _previous: Vec2 | undefined;

//     /**吸附强度*/
//     private _snapIntensity = 4;
//     constructor(point: Vec2, previous?: Vec2) {
//         this._point = point;
//         this._previous = previous;
//     }

//     public doSnap() {
//         const points = this.getSnapPoints();
//         // const lines = this.getSnapLines();
//         const ppSnaps: T_PointSnapResult[] = [];
//         points.forEach(p => {
//             const info = this.ppSnap(this._point, p);
//             if (info !== undefined) ppSnaps.push(info);
//         });
//         ppSnaps.sort((a, b) => a.distance - b.distance);
//         if (ppSnaps.length) {
//             console.log('吸附到了===');

//             return ppSnaps[0];
//         }
//         return this._point;
//     }

//     /**
//      * 点是否吸附
//      */
//     public ppSnap(p1: Vec2, p2: Vec2): T_PointSnapResult | undefined {
//         const distance = p1.distanceTo(p2);
//         if (distance < this._snapIntensity) {
//             return {
//                 distance,
//                 pos: p2
//             };
//         }
//     }

//     /**
//      * 线是否吸附
//      */



//     /**
//      * 获取可吸附点
//      * 暂时获取所有的物体的包围盒角点
//      */
//     public getSnapPoints() {
//         const points: Vec2[] = [];
//         const elements = app.doc.getAllElementsByCtor(ImageElement);
//         elements.map(ele => {
//             const rect = ele.getGRep().getClientRect();
//             const transform = ele.getTransform();
//             const cornorPoints = MathUtil.getCornerPoints(rect);
//             cornorPoints.forEach(p => {
//                 const pos = transform.point(p);
//                 p = new Vec2(pos);
//                 points.push(p);
//             });
//         });
//         return points;
//     }

//     /**
//      * 获取可吸附的线
//      * 暂时根据上一个点创建出的不同角度线
//      */
//     public getSnapLines() {
//         if (!this._previous) return [];
//         const lines: Ln2[] = [];
//         for (let i = 0; i < 4; i += 1) {
//             const vec = new Vec2(1, 0);
//             const dir = vec.vecRotated(i * Math.PI / 4);
//             const line = new Ln2(this._previous, dir);
//             lines.push(line);
//         }
//         return lines;
//     }
// }