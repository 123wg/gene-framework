import { I_ProcessEvent } from "../controller/i_process_event";
import { I_MouseEvent, I_KeyboardEvent } from "../type_define/type_define";

/**
 * 接收事件
 */
export class CmdMgr implements I_ProcessEvent{
    // TODO 提供实现
    processMouseEvent(_event: I_MouseEvent): boolean {
        throw new Error("Method not implemented.");
    }
    processKeyboardEvent(_docevent: I_KeyboardEvent): boolean {
        throw new Error("Method not implemented.");
    }
}
