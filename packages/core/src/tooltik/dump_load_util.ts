import { I_DumpLoad } from "../type_define/type_define";

export class DumpLoadUtil {
    public static isDumpLoad(obj: unknown): obj is I_DumpLoad {
        return !!obj &&
            (obj as I_DumpLoad).dump instanceof Function &&
            (obj as I_DumpLoad).load instanceof Function;
    }
}