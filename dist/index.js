/*!
    Copyright (c) 2024-2025 JHunt
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
        return addSemicolon(this.strings.join('?'));
    }
    get text() {
        return addSemicolon(this.strings.reduce((prev, curr, i) => prev + '$' + i + curr));
    }
    get statement() {
        return addSemicolon(this.strings.reduce((prev, curr, i) => prev + ':' + i + curr));
    }
    get query() {
        return addSemicolon(this.sql);
    }
    *[Symbol.iterator]() {
        yield this.sql;
        yield this.values;
    }
}
;
const addSemicolon = (finalString) => {
    if (finalString && finalString[finalString.length - 1] !== ';') {
        return finalString + ';';
    }
    else {
        return finalString;
    }
};
const append = (strings, newStrings) => {
    const stringsLength = strings.length;
    if (!newStrings.length) {
        return strings;
    }
    else if (stringsLength) {
        const allButLastString = strings.slice(0, stringsLength - 1);
        const lastString = strings[stringsLength - 1];
        const lastStringChar = lastString.charAt(lastString.length - 1);
        const firstStringChar = newStrings[0].charAt(0);
        return [
            ...allButLastString,
            lastString + (lastStringChar === ' ' || firstStringChar === ' ' || !firstStringChar ? '' : ' ') + newStrings[0],
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
            if (Array.isArray(arg[0])) {
                strings = append(strings, arg[0]);
                values.push(...arg[1]);
            }
            else {
                for (let j = 0; j < arg.length; i++) {
                    const argJ = arg[j];
                    strings = append(strings, argJ.strings);
                    values.push(...argJ.values);
                }
            }
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
    let newStrings = [];
    const newValues = [];
    let appendNextString = false;
    for (let i = 0; i < values.length; i++) {
        const value = values[i];
        if (value instanceof SqlString) {
            newStrings.push(strings[i]);
            newStrings = append(newStrings, value.strings);
            newValues.push(...value.values);
            appendNextString = true;
        }
        else {
            if (appendNextString) {
                newStrings = append(newStrings, [strings[i]]);
                appendNextString = false;
            }
            else {
                newStrings.push(strings[i]);
            }
            newValues.push(value);
        }
    }
    if (appendNextString) {
        newStrings = append(newStrings, [strings[strings.length - 1]]);
        appendNextString = false;
    }
    else {
        newStrings.push(strings[strings.length - 1]);
    }
    return new SqlString(newStrings, newValues);
};
qb.unescaped = (sql) => new SqlString([sql]);
const keyValueList = (keyValues, prefix = '') => {
    const strings = [];
    const values = [];
    const keys = Object.keys(keyValues).filter((key) => keyValues.hasOwnProperty(key) && keyValues[key] !== undefined);
    const keysLength = keys.length;
    let endString = '';
    for (let i = 0; i < keysLength; i++) {
        const key = keys[i];
        const value = keyValues[key];
        const baseString = `${i === 0 ? (prefix ? prefix + ' ' : '') : endString + ', '}${key} = `;
        if (value instanceof SqlString) {
            strings.push(...[baseString + value.strings[0], ...value.strings.slice(1, value.strings.length - 2)]);
            endString = value.strings[value.strings.length - 1];
            values.push(...value.values);
        }
        else {
            strings.push(endString + baseString);
            values.push(value);
            endString = '';
        }
    }
    strings.push(endString);
    return new SqlString(strings, values);
};
qb.set = (keyValues) => keyValueList(keyValues, 'SET');
qb.values = (firstArg, ...otherArgs) => {
    const strings = [];
    const values = [];
    const array = Array.isArray(firstArg) ? firstArg : [firstArg, ...otherArgs];
    const keyValues = array[0];
    const keys = Object.keys(keyValues).filter((key) => keyValues.hasOwnProperty(key));
    const keysLength = keys.length;
    let endString = '';
    for (let i = 0; i < array.length; i++) {
        if (i === 0) {
            strings.push(`(${keys.map((key) => key).join(', ')}) VALUES (`);
        }
        else {
            strings.push(endString + '), (');
        }
        const item = array[i];
        for (let j = 0; j < keysLength; j++) {
            const key = keys[j];
            const value = item[key];
            const baseString = j > 0 ? endString + ', ' : '';
            if (value instanceof SqlString) {
                strings.push(...[baseString + value.strings[0], ...value.strings.slice(1, value.strings.length - 2)]);
                endString = value.strings[value.strings.length - 1];
                values.push(...value.values);
            }
            else {
                if (j > 0) {
                    strings.push(baseString);
                }
                values.push(item[key]);
                endString = '';
            }
        }
    }
    strings.push(endString + ')');
    return new SqlString(strings, values);
};
qb.in = (firstArg, ...otherArgs) => {
    const strings = [];
    const newValues = [];
    const valuesArray = Array.isArray(firstArg) ? firstArg : [firstArg, ...otherArgs];
    const valuesLength = valuesArray.length;
    let endString = '';
    for (let i = 0; i < valuesLength; i++) {
        const baseString = i === 0 ? 'IN (' : endString + ', ';
        const value = valuesArray[i];
        if (value instanceof SqlString) {
            strings.push(...[baseString + value.strings[0], ...value.strings.slice(1, value.strings.length - 2)]);
            endString = value.strings[value.strings.length - 1];
            newValues.push(...value.values);
        }
        else {
            strings.push(baseString);
            newValues.push(value);
        }
    }
    if (valuesLength) {
        strings.push(endString + ')');
    }
    return new SqlString(strings, newValues);
};
export default qb;
