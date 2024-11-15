import { Cmd, registerCmd } from "@gene/platform";
import { EN_AppCmd } from "./cmd_id";

@registerCmd(EN_AppCmd.DRAW_PIPE_CMD)
export class DrawpipeCmd extends Cmd {
    public executeImmediately = false;

    public async execute() {
        console.log('开始执行');
    }
}