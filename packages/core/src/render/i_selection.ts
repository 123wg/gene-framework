import { Element } from "../element/element";

export interface I_Selection {
    getSelectedElements(): Element[]
    getSelectedElementIds(): number[]
}