/*
* Author: Gene
* Description:业务无关的辅助类型
* Last Modified: 2024-10-18
*/

/**
 * 返回构造函数类型
 */
export type T_Constructor<T> = {
    // eslint-disable-next-line
    new(...args: any[]): T
    prototype: T
}

/**
 * JSON数据格式
 */
export type T_JSON = {
    [k: string]: unknown
}

/**
 * 基础数据类型
 */
export type T_BasicType = string | number | boolean | undefined | void