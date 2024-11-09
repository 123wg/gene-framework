import { DBElement, I_DBElementProps, T_XY } from "@gene/core";

export interface I_DBPipeProps extends I_DBElementProps {
    start: T_XY
    end: T_XY
}

export class DBPipe extends DBElement<I_DBPipeProps> {
    public start: T_XY = { x: 0, y: 0 };

    public end: T_XY = { x: 0, y: 0 };
}