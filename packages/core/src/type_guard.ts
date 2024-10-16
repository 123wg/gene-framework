/**
 * 返回对象、类上的属性和类型为新的类型
 * eg:
 */
export type T_Properties<T> = {
    [K in keyof T as T[K] extends (...args: any[]) => any ? never : K]: T[K];
};
