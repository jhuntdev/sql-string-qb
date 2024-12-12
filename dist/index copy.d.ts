/*!
    Copyright (c) 2024 JHunt
    Licensed under the MIT License (MIT)
    https://github.com/jhuntdev/sql-string-qb
*/
export declare class SqlString {
    private strings;
    values: any[];
    constructor(strings: string[], values?: any[]);
    /** Returns the SQL Statement for Sequelize */
    get query(): any;
    /** Returns the SQL Statement for node-postgres */
    get text(): string;
    get length(): number;
    toString(): string;
    charAt(index: number): string;
    replace(searchValue: string | RegExp, replaceValue: string): SqlString;
    toUpperCase(): SqlString;
    toLowerCase(): SqlString;
    substring(start: number, end?: number): SqlString;
    includes(searchString: string): boolean;
    split(separator: string | RegExp, limit?: number): string[];
    trim(): SqlString;
    toArray(): string[];
    concat(...strings: string[]): SqlString;
    startsWith(searchString: string): boolean;
    endsWith(searchString: string): boolean;
    charCodeAt(index: number): number;
    match(regexp: RegExp): string[] | null;
    repeat(count: number): SqlString;
    padStart(targetLength: number, padString?: string): SqlString;
    padEnd(targetLength: number, padString?: string): SqlString;
    [Symbol.iterator](): Generator<any, void, unknown>;
}
export type SqlStringDialect = 'mysql' | 'mssql' | 'sqlite' | 'postgres';
export declare const SqlStringQB: (dialect?: SqlStringDialect) => {
    (...args: number[]): SqlString;
    t(strings: string[], ...values: any[]): (string | any[])[];
    set(keyValues: {
        [key: string]: any;
    }): void;
    values(keyValues: {
        [key: string]: any;
    }): void;
    in(values: any[]): void;
};
export default SqlStringQB;
