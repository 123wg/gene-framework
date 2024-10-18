/**
 * 调试工具
 */
export class DebugUtil {
    /**
     * 断言,会抛出错误,阻碍程序执行
     * @param value 需要断言的值
     * @param message 提示信息
     * @param name 报告人
     * @param time 报告时间
     */
    public static assert(value: unknown, message: string, name: string, time: string) {
        if (!value) {
            const errorMsg = `${message}\n报告人:${name}\n报告时间:${time}\n`;
            throw new Error(errorMsg);
        }
    }
}