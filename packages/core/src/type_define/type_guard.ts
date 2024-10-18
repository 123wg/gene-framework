/*
* Author: Gene
* Description:类型安全的辅助类型集合,与业务无关
* Last Modified: 2024-10-18
*/


/**
 * 返回对象、类上的属性和类型为新的类型
 */
// export type T_Properties<T> = {
//     [K in keyof T as T[K] extends Function ? never : K]: T[K];
// };

/**
 * 返回构造函数类型
 */
export type T_Constructor<T> = {
    new(...args: unknown[]): T
    prototype: T
}