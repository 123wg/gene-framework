import { I_ProcessKeyboardEvent } from "./i_keyboard_controller";
import { I_ProcessMouseEvent } from "./i_mouse_controller";

/**
 * 处理键鼠事件的抽象类型
 */
export interface I_ProcessEvent extends I_ProcessMouseEvent,I_ProcessKeyboardEvent{

}
