import { DBElement, I_DBElementProps, T_XY } from "@gene/core";

export interface I_DBPipeProps extends I_DBElementProps {
    outerStart: T_XY
    outerEnd: T_XY
    innerStart: T_XY
    innerEnd: T_XY
}

export class DBPipe extends DBElement<I_DBPipeProps> {
    public outerStart: T_XY = { x: 0, y: 0 };

    public outerEnd: T_XY = { x: 0, y: 0 };

    public innerStart: T_XY = { x: 0, y: 0 };

    public innerEnd: T_XY = { x: 0, y: 0 };
}