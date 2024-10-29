import { EN_KeyboardEvent, EN_MouseEvent, I_KeyboardEvent, I_MouseEvent } from "../type_define/type_define";
import { I_KeyboardController } from "./i_keyboard_controller";
import { I_MouseController } from "./i_mouse_controller";

/**
 * 默认的键鼠控制器
 */
export class DefaultController implements I_MouseController, I_KeyboardController {
    public processMouseEvent(event: I_MouseEvent): boolean {
        switch (event.type) {
            case EN_MouseEvent.MouseDown:
                return this.onMouseDown(event);
            case EN_MouseEvent.MouseUp:
                return this.onMouseUp(event);
            case EN_MouseEvent.MouseMove:
                return this.onMouseMove(event);
            case EN_MouseEvent.MouseClick:
                return this.onClick(event);
            case EN_MouseEvent.MouseDblClick:
                return this.onDoubleClick(event);
            case EN_MouseEvent.MouseDragStart:
                return this.onDragStart(event);
            case EN_MouseEvent.MouseDragMove:
                return this.onDragMove(event);
            case EN_MouseEvent.MouseDragEnd:
                return this.onDragEnd(event);
            case EN_MouseEvent.MouseDragCancel:
                return this.onDragCancel(event);
            default:
                return false;
        }
    }
    public onMouseDown(_event: I_MouseEvent): boolean {
        return false;
    }
    public onMouseUp(_event: I_MouseEvent): boolean {
        return false;
    }
    public onMouseMove(_event: I_MouseEvent): boolean {
        return false;
    }
    public onClick(_event: I_MouseEvent): boolean {
        return false;
    }
    public onDoubleClick(_event: I_MouseEvent): boolean {
        return false;
    }
    public onDragStart(_event: I_MouseEvent): boolean {
        return false;
    }
    public onDragMove(_event: I_MouseEvent): boolean {
        return false;
    }
    public onDragEnd(_event: I_MouseEvent): boolean {
        return false;
    }
    public onDragCancel(_event: I_MouseEvent): boolean {
        return false;
    }
    public processKeyboardEvent(event: I_KeyboardEvent): boolean {
        switch (event.type) {
            case EN_KeyboardEvent.KeyDown:
                return this.onKeyDown(event);
            case EN_KeyboardEvent.KeyUp:
                return this.onKeyUp(event);
            case EN_KeyboardEvent.KeyPress:
                return this.onKeyPress(event);
            default:
                return false;
        }
    }
    public onKeyDown(_event: I_KeyboardEvent): boolean {
        return false;
    }
    public onKeyUp(_event: I_KeyboardEvent): boolean {
        return false;
    }
    public onKeyPress(_event: I_KeyboardEvent): boolean {
        return false;
    }
}
