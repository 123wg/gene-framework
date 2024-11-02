/*
 * Author: Gene
 * Description:
 * Last Modified: 2024-10-17
 */

import { ElementId } from "../element/element_id";
import { GRep } from "../grep/grep";
import { I_DBBaseProps } from "../type_define/type_define";
import { DBBase } from "./db_base";

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

    /**显示对象*/
    public C_GRep = GRep.empty;
}
