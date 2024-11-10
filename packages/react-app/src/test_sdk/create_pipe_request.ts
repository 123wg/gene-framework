import { registerRequest, Request } from "@gene/core";
import { PipeElement } from "./pipe_element";
import { EN_AppRequestId } from "./config";

@registerRequest(EN_AppRequestId.CREATE_PIPE)
export class CreatePipeRequest extends Request {
    public commit() {
        const pipe = this.doc.create(PipeElement);
        pipe.start = { x: 100, y: 300 };
        pipe.end = { x: 405, y: 300 };
        pipe.markGRepDirty();
    }
}