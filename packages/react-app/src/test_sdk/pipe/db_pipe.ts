import { DBElement, I_DBElementProps, T_XY } from "@gene/core";

export interface I_DBPipeProps extends I_DBElementProps {
    points: T_XY[]
}

export class DBPipe extends DBElement<I_DBPipeProps> implements I_DBPipeProps {
    points: T_XY[] = [{ x: 0, y: 0 }];
}