/*!
    Copyright (c) 2024 JHunt
    Licensed under the MIT License (MIT)
    https://github.com/jhuntdev/sql-string-qb
*/
declare class SqlString {
    strings: string[];
    values: any[];
    constructor(strings: string[], values?: any[]);
    toString(): string;
    get sql(): string;
    get text(): string;
    get statement(): string;
    get query(): string;
    [Symbol.iterator](): Generator<string | any[], void, unknown>;
}
declare const qb: {
    (...args: any[]): SqlString;
    t(strings: TemplateStringsArray, ...values: any[]): SqlString;
    unescaped(sql: string): SqlString;
    set(keyValues: {
        [key: string]: any;
    }): SqlString;
    values(keyValueArray: {
        [key: string]: any;
    } | {
        [key: string]: any;
    }[]): SqlString;
};
export default qb;
