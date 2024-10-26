import { I_MouseEvent } from "../type_define/type_define";

/**
 * 鼠标事件控制接口
 */
export interface I_MouseController {
    /**
     * 处理鼠标事件并展开
     * 若返回true则不在向上冒泡
     */
    processMouseEvent(event:I_MouseEvent):boolean

    onMouseDown(event:I_MouseEvent):boolean

    onMouseUp(event:I_MouseEvent):boolean

    onMouseMove(event:I_MouseEvent):boolean

    onClick(event:I_MouseEvent):boolean

    onDoubleClick(event:I_MouseEvent):boolean

    onDragStart(event:I_MouseEvent):boolean

    onDragMove(event:I_MouseEvent):boolean

    onDragEnd(event:I_MouseEvent):boolean

    onDragCancel(event:I_MouseEvent):boolean
}
