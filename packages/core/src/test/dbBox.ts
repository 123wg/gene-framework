import { DBElement, I_DBElementProps } from "../db/db_element";

export interface I_DBBoxProps extends I_DBElementProps {
    x: number;
    y: number;
    width: number;
    height: number;
}

export class DBBox extends DBElement<I_DBBoxProps> {
    public x: number = 2;

    public y: number = 3;

    public width: number = 4;

    public height: number = 5;
}