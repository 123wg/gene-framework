import { registerRequest, Request, I_Vec2 } from "@gene/core";
import { PipeElement } from "../element/pipe_element";
import { EN_AppRequestId } from "../app_request_id";

@registerRequest(EN_AppRequestId.CREATE_PIPE)
export class CreatePipeRequest extends Request {
    public points: I_Vec2[] = [];
    constructor(points: I_Vec2[]) {
        super();
        this.points = points;
    }
    public commit() {
        const pipe = this.doc.create(PipeElement);
        pipe.points = this.points;
        pipe.markGRepDirty();
        return pipe;
    }
}