import { Cmd } from "../cmd";
import { registerCmd } from "../cmd_decorator";
import { EN_PlatFormCmdIds } from "../en_cmd_ids";
import { app } from "../../app/app";
import { UndoRequest } from "@gene/core";

/**
 * 撤销命令
 */
@registerCmd(EN_PlatFormCmdIds.CMD_UNDO)
export class UndoCmd extends Cmd {
    public executeImmediately = true;

    public async execute() {
        const req = app.requestMgr.createRequest(UndoRequest);
        app.requestMgr.commitRequest(req);
    }
}