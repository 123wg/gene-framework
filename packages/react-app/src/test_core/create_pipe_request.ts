import { registerRequest, Request } from "@gene/core";
import { PipeElement } from "./pipe_element";
import { EN_AppRequestId } from "./config";

@registerRequest(EN_AppRequestId.CREATE_PIPE)
export class CreatePipeRequest extends Request {
    public onCommit() {
        const pipe = this._doc.create(PipeElement);
        pipe.outerStart = { x: 100, y: 300 };
        pipe.outerEnd = { x: 405, y: 300 };
        pipe.innerStart = { x: 100, y: 300 };
        pipe.innerEnd = { x: 405, y: 300 };
        pipe.markGRepDirty();
    }
}