import * as ShortUUID from 'short-uuid';
export { ShortUUID };
// db
export { DBElement } from './db/db_element';
export type { I_DBElementProps } from './db/db_element';

// document
export type { I_Document } from './document/i_document';
export { Document } from './document/document';
export { ElementMgr } from './document/element_manager';

// element
export { ElementId } from './element/element_id';
export { Element } from './element/element';
export { injectDB } from './element/element_decorator';

// grep
export { GArrow } from './grep/garrow';
export { GCircle } from './grep/gcircle';
export { GGroup } from './grep/ggroup';
export { GImage } from './grep/gimage';
export { GLine } from './grep/gline';
export { GNode } from './grep/gnode';
export { GRect } from './grep/grect';
export { GRegPolygon } from './grep/gRegPolygon';
export { GRep } from './grep/grep';
export { GShape } from './grep/gshape';
export { GText } from './grep/gtext';

// math
export { Transform } from './math/transform';

// model_view

// render
export { IRender } from './render/i_render';
export type { I_Selection } from './render/i_selection';
export { TmpElementPainter } from './element/tmp_element/tmp_element_painter';

// request
export { Request } from './request/request';
export { RequestMgr } from './request/request_mgr';
export { registerRequest } from './request/request_decorator';
export { UndoRequest } from './request/built_in_request.ts/undo_request';
export { RedoRequest } from './request/built_in_request.ts/redo_request';
export { EN_CoreRequestIds } from './request/en_request_id';

// tooltik
export { ClassManager } from './tooltik/class_manager';
export { DebugUtil } from './tooltik/debug_util';
export { Signal } from './tooltik/signal';
export { SignalHook } from './tooltik/signalHook';
export { EN_UserName } from './tooltik/user_name';
export { CoreConfig } from './tooltik/core_config';
export { MathUtil } from './tooltik/math_util';
export { AssetsMgr } from './tooltik/assets_mgr';

// transaction
export type { I_TransactionBase } from './transaction/i_transaction_base';
export type { I_Transaction } from './transaction/i_transaction';
export type { I_TransactionGroup } from './transaction/i_transaction_group';
export { Transaction } from './transaction/transaction';
export { TransactionGroup } from './transaction/transaction_group';

// type_define
export type {
    I_DBBaseProps,
    T_ElementConstructor,
    I_SignalEvent,
    T_SignalCallbackFn,
    I_SignalCallbackItem,
    T_Vec2,
    T_Rect,
    T_GRepRenderAttrs,
    T_CommitRequestEventData
} from './type_define/type_define';
export { EN_RenderShapeType } from './type_define/type_define';

export type {
    T_Constructor
} from './type_define/type_guard';
