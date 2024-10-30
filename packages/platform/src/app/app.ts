import { I_Document, RequestMgr } from "@gene/core";
import { CmdMgr } from "../cmd/cmd_mgr";
import { Selection } from "../selection/selection";
import { EditorMgr } from "../editor/editor_mgr";
import { EditorDefaultController } from "../editor/editor_default_controller";

/**
 * 应用
 */
export class App {
    private static _instance: App;

    private _doc: I_Document;

    public selection: Selection;

    public cmdMgr: CmdMgr;

    public requestMgr: RequestMgr;

    public editorMgr: EditorMgr;

    public get doc() {
        return this._doc;
    }

    public static instance() {
        if (!this._instance) {
            this._instance = new App();
        }
        return this._instance;
    }

    constructor() {
        this.selection = Selection.instance();
        this.cmdMgr = CmdMgr.instance();
        this.requestMgr = RequestMgr.instance();
        this.editorMgr = EditorMgr.instance();
        this.editorMgr.defaultController = new EditorDefaultController();

    }


    public start(doc: I_Document) {
        this._doc = doc;
        doc.isMainDoc = true;
        this.selection.setDoc(doc);
    }
}


export const app = App.instance();