import { Element } from "../element/element";
import { injectDB } from "../element/element_decorator";
import { DBBox } from "./dbBox";

@injectDB('dddd', DBBox)
export class BoxElement extends Element<DBBox> {
    public calcArea() {

    }
}
