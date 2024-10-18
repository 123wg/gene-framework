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
}