import { RedoRequest } from "@gene/core";
import { app } from "../../app/app";
import { Cmd } from "../cmd";
import { registerCmd } from "../cmd_decorator";
import { EN_PlatFormCmdIds } from "../en_cmd_ids";

/**
 * 恢复命令
 */
@registerCmd(EN_PlatFormCmdIds.CMD_REDO)
export class RedoCmd extends Cmd {
    public executeImmediately = true;

    public async execute() {
        const req = app.requestMgr.createRequest(RedoRequest);
        app.requestMgr.commitRequest(req);
    }
}