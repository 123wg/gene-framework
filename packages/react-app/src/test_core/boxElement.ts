import { Element, injectDB } from "@gene/core";
import { DBBox } from "./dbBox";

@injectDB('fb9c3175-e01c-4396-8779-c72af3deed75', DBBox)
export class BoxElement extends Element<DBBox> {
    public get x(){
        return this.db.x;
    }

    public set x(v:number){
        this.db.x = v;
    }

    public get y(){
        return this.db.y;
    }

    public set y(v:number){
        this.db.y = v;
    }

    public getArea(){
        return this.x *  this.y;
    }
}
