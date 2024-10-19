import { Element } from "../element/element";
import { ElementId } from "../element/element_id";

export interface I_Document {
    getElementById(eleId:ElementId | number):Element | undefined
    checkIfCanModifyDoc():void
}
