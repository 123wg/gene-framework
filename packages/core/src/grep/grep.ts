import { ElementId } from "../element/element_id";
import { GGroup } from "./ggroup";

export class GRep extends GGroup {
    private _refElementId: ElementId;
    public static get empty() {
        return new GRep();
    }

    public get elementId() {
        return this._refElementId;
    }

    public set elementId(eId: ElementId) {
        this._refElementId = eId;
    }
}