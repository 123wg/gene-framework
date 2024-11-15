import { CmdActionController } from "./cmd_action_controller";

export class Cmd extends CmdActionController<unknown> {
    /**
     * cmd是否立即执行
     * 如果有交互,设置为false
     */
    public executeImmediately = true;
}
