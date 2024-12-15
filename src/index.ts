/*!
	Copyright (c) 2024 JHunt
	Licensed under the MIT License (MIT)
	https://github.com/jhuntdev/sql-string-qb
*/

class SqlString {
  private strings: string[];
  values: any[];

  constructor(strings: string[], values: any[] = []) {
    this.strings = strings;
    this.values = values;
  }

  toString(): string {
    return this.sql;
  }

  // mysql, mysql2
  get sql() {
    return this.strings.join('?');
  }

  // node-postgres
  get text() {
    return this.strings.reduce((prev, curr, i) => prev + '$' + i + curr);
  }

  // oracle
  get statement() {
    return this.strings.reduce((prev, curr, i) => prev + ':' + i + curr);
  }

  // sequelize
  get query() {
    return this.sql; // this.prepared ? this.text : this.sql
  }

  *[Symbol.iterator]() {
    yield this.sql;
    yield this.values;
  }
}

const append = (strings: string[], newStrings: string[]) => {
  if (!newStrings.length) {
    return strings;
  } else if (strings.length) {
    return [
      ...strings.slice(0, strings.length - 1),
      strings[strings.length - 1] + ' ' + newStrings[0],
      ...newStrings.slice(1)
    ];
  } else {
    return newStrings;
  }
}

const qb = (...args: any[]): SqlString => {
  let strings: string[] = [];
  const values: any[] = [];
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (!arg) {
      continue;
    } else if (Array.isArray(arg)) {
      strings = append(strings, arg[0]);
      values.push(...arg[1]);
    } else if (typeof arg === 'object') {
      strings = append(strings, arg.strings);
      values.push(...arg.values);
    } else if (typeof arg === 'string') {
      strings = append(strings, [arg]);
    } else {
      throw new Error('Arguments should be strings or arrays');
    }
  }
  return new SqlString(strings, values);
}

qb.t = (strings:TemplateStringsArray, ...values:any[]) => {
  return new SqlString(strings.map((s) => String(s)), values);
}

qb.set = (keyValues:{[key:string]:any}) => {
  // SET key1 = $0, key2 = $1
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
}

qb.values = (keyValueArray:{[key:string]:any}|{[key:string]:any}[]) => {
  // (key1, key2) VALUES ($0, $1), ($2, $3)
  const strings = [];
  const values = [];
  const array = Array.isArray(keyValueArray) ? keyValueArray : [keyValueArray];
  const keyValues = array[0];
  const keys = Object.keys(keyValues).filter((key) => keyValues.hasOwnProperty(key));
  const keysLength = keys.length;
  for (let i = 0; i < array.length; i++) {
    if (i === 0) {
      strings.push(`(${keys.join(', ')}) VALUES (`);
    } else {
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
}

qb.in = (values:any[]) =>{
  // IN ($0, $1)
  const strings = ['IN ('];
  const valuesLength = values.length;
  for (let i = 1; i < valuesLength; i++) {
    strings.push(', ');
  }
  strings.push(')');
  return [strings, values];
}

export default qb;