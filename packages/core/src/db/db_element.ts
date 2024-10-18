/*
 * Author: Gene
 * Description:
 * Last Modified: 2024-10-17
 */

import { ElementId } from "../element/element_id";
import { DBBase, I_DBBaseProps } from "./db_base";

export interface I_DBElementProps extends I_DBBaseProps {
    id: ElementId,
    name: string
    visible: boolean
}

export class DBElement
    <T extends I_DBElementProps = I_DBElementProps>
    extends DBBase<T> {

    /**文档级别唯一标识*/
    public id: ElementId = ElementId.INVALID;

    /**名称*/
    public name: string = '';

    /**可见性*/
    public visible: boolean = true;
}