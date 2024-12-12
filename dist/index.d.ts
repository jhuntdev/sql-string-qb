/*!
    Copyright (c) 2024 JHunt
    Licensed under the MIT License (MIT)
    https://github.com/jhuntdev/sql-string-qb
*/
export declare class SqlString {
    private strings;
    values: any[];
    constructor(strings: string[], values?: any[]);
    toString(): string;
    get sql(): string;
    get text(): string;
    get statement(): string;
    get query(): string;
    [Symbol.iterator](): Generator<string | any[], void, unknown>;
}
export declare const qb: {
    (...args: any[]): SqlString;
    t(strings: string[], ...values: any[]): SqlString;
    set(keyValues: {
        [key: string]: any;
    }): any[][];
    values(keyValueArray: {
        [key: string]: any;
    } | {
        [key: string]: any;
    }[]): any[][];
    in(values: any[]): any[][];
};
export default qb;
