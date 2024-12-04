// import { I_SnapGeoHelper, MathUtil, TransformElement, Vec2 } from "@gene/core";
// import { PipeElement } from "@gene/editor-sdk";
// import { app } from "@gene/platform";


// /**
//  * 获取可吸附体几何对象
//  */
// export class AppSnapGeoHelper implements I_SnapGeoHelper {
//     public getAllElementsRectPoints(): Array<Vec2> {
//         const result: Array<Vec2> = [];
//         const elements = app.doc.filterElements(ele => !ele.isTemporary());
//         elements.forEach(ele => {
//             if (ele.isLike(TransformElement)) {
//                 const rect = ele.getGRep().getClientRect();
//                 const points = MathUtil.getCornerPoints(rect);
//                 const transform = ele.getTransform();
//                 points.forEach(p => {
//                     const realPos = transform.point(p);
//                     result.push(new Vec2(realPos));
//                 });
//             }
//             if (ele.isLike(PipeElement)) {
//                 const points = ele.points;
//                 points.forEach(p => {
//                     result.push(new Vec2(p));
//                 });
//             }
//         });
//         return result;
//     }
// }