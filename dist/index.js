/*!
    Copyright (c) 2024 JHunt
    Licensed under the MIT License (MIT)
    https://github.com/jhuntdev/sql-string-qb
*/
class SqlString {
    strings;
    values;
    constructor(strings, values = []) {
        this.strings = strings;
        this.values = values;
    }
    toString() {
        return this.sql;
    }
    get sql() {
        return this.strings.join('?');
    }
    get text() {
        return this.strings.reduce((prev, curr, i) => prev + '$' + i + curr);
    }
    get statement() {
        return this.strings.reduce((prev, curr, i) => prev + ':' + i + curr);
    }
    get query() {
        return this.sql;
    }
    *[Symbol.iterator]() {
        yield this.sql;
        yield this.values;
    }
}
const append = (strings, newStrings) => {
    if (!newStrings.length) {
        return strings;
    }
    else if (strings.length) {
        return [
            ...strings.slice(0, strings.length - 1),
            strings[strings.length - 1] + ' ' + newStrings[0],
            ...newStrings.slice(1)
        ];
    }
    else {
        return newStrings;
    }
};
const qb = (...args) => {
    let strings = [];
    const values = [];
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (!arg) {
            continue;
        }
        else if (Array.isArray(arg)) {
            strings = append(strings, arg[0]);
            values.push(...arg[1]);
        }
        else if (typeof arg === 'object') {
            strings = append(strings, arg.strings);
            values.push(...arg.values);
        }
        else if (typeof arg === 'string') {
            strings = append(strings, [arg]);
        }
        else {
            throw new Error('Arguments should be strings or arrays');
        }
    }
    return new SqlString(strings, values);
};
qb.t = (strings, ...values) => {
    return new SqlString(strings.map((s) => String(s)), values);
};
qb.set = (keyValues) => {
    const strings = [];
    const values = [];
    const keys = Object.keys(keyValues).filter((key) => keyValues.hasOwnProperty(key));
    const keysLength = keys.length;
    for (let i = 0; i < keysLength; i++) {
        const key = keys[i];
        strings.push(`${i === 0 ? 'SET ' : ', '}${key} = `);
        values.push(keyValues[key]);
    }
    strings.push('');
    return [strings, values];
};
qb.values = (keyValueArray) => {
    const strings = [];
    const values = [];
    const array = Array.isArray(keyValueArray) ? keyValueArray : [keyValueArray];
    const keyValues = array[0];
    const keys = Object.keys(keyValues).filter((key) => keyValues.hasOwnProperty(key));
    const keysLength = keys.length;
    for (let i = 0; i < array.length; i++) {
        if (i === 0) {
            strings.push(`(${keys.join(', ')}) VALUES (`);
        }
        else {
            strings.push(`), (`);
        }
        const item = array[i];
        for (let j = 0; j < keysLength; j++) {
            const key = keys[j];
            if (j > 0) {
                strings.push(', ');
            }
            values.push(item[key]);
        }
    }
    strings.push(')');
    return [strings, values];
};
qb.in = (values) => {
    const strings = ['IN ('];
    const valuesLength = values.length;
    for (let i = 1; i < valuesLength; i++) {
        strings.push(', ');
    }
    strings.push(')');
    return [strings, values];
};
export default qb;
