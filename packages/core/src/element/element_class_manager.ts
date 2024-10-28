import { ClassManager } from "../tooltik/class_manager";
import { T_Constructor } from "../type_define/type_guard";
import { Element } from "./element";

/**element类管理器*/
export const elementClassManager = new ClassManager<string, T_Constructor<Element>>();
