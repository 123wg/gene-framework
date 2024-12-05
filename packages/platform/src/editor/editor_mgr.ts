import { I_KeyboardEvent, I_MouseEvent, I_ProcessEvent } from "@gene/render";
import { Editor } from "./editor";
import type { EditorDefaultController } from "./editor_default_controller";

/**
 * 编辑环境管理器
 */
export class EditorMgr implements I_ProcessEvent {
    private static _instance: EditorMgr;

    private _currentEditor?: Editor;

    public defaultController: EditorDefaultController;

    public static instance(): EditorMgr {
        if (!this._instance) {
            this._instance = new EditorMgr();
        }
        return this._instance;
    }

    public get editor() {
        return this._currentEditor;
    }

    /**
     * 处理键盘事件
     */
    public processKeyboardEvent(event: I_KeyboardEvent): boolean {
        return !![this.defaultController].find(_ => {
            return _.processKeyboardEvent(event);
        });
    }

    /**
     * 处理鼠标事件
     */
    public processMouseEvent(event: I_MouseEvent): boolean {
        return !![this.defaultController].find(_ => {
            return _.processMouseEvent(event);
        });
    }
}
