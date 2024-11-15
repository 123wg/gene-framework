import { EN_CoreRequestIds } from "../en_request_id";
import { Request } from "../request";
import { registerRequest } from "../request_decorator";

/**
 * 撤销请求
 */
@registerRequest(EN_CoreRequestIds.REDO)
export class RedoRequest extends Request {
    public commit() {
        this.doc.transactionMgr.redo();
        this.doc.updateView();
    }

    public canTransact(): boolean {
        return false;
    }
}