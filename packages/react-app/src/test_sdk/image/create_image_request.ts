import { registerRequest, Request } from "@gene/core";
import { EN_AppRequestId } from "../app_request_id";
import { ImageElement } from "./image_element";

@registerRequest(EN_AppRequestId.CREATE_IMAGE)
export class CreateImageRequest extends Request {
    public src: string;
    constructor(src: string) {
        super();
        this.src = src;
    }
    public commit() {
        const pipe = this.doc.create(ImageElement);
        pipe.src = this.src;
        pipe.markGRepDirty();
        return pipe;
    }
}