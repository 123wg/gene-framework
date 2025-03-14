import { registerRequest, Request } from "@gene/core";
import { ImageElement } from "../element/image_element";
import { EN_EditorRequestId } from "./request_id";

@registerRequest(EN_EditorRequestId.CREATE_IMAGE)
export class CreateImageRequest extends Request {
    public src: string;
    public x: number;
    public y: number;
    public width: number;
    public height: number;
    constructor(src: string, x: number, y: number, width: number, height: number) {
        super();
        this.src = src;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    public commit() {
        const image = this.doc.create(ImageElement);
        image.src = this.src;
        image.x = this.x;
        image.y = this.y;
        image.width = this.width;
        image.height = this.height;
        image.markGRepDirty();
        return image;
    }
}