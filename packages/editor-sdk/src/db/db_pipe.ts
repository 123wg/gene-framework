import { DBElement, I_DBElementProps, I_Vec2 } from "@gene/core";

export interface I_DBPipeProps extends I_DBElementProps {
    points: I_Vec2[]
}

export class DBPipe extends DBElement<I_DBPipeProps> implements I_DBPipeProps {
    public points: I_Vec2[] = [{ x: 0, y: 0 }];
}