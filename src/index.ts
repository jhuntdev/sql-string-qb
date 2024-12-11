/*!
	Copyright (c) 2024 JHunt.
	Licensed under the MIT License (MIT), see
	https//qb.jhunt.dev
*/

export const qb = (...args:(string|any[]|null|undefined|false)[]) => {
    let str = '';
    const vars:any[] = [];

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (!arg) {
            continue;
        } else if (Array.isArray(arg)) {
            str = append(str, arg[0])
            vars.push(...arg[1])
        } else if (typeof arg === 'string') {
            str = append(str, arg)
        } else {
            throw new Error('Arguments should be strings or arrays')
        }
    }

    return vars.length > 0 ? [str, vars] : [str]
}

qb.t = (strings:string[], ...values:any[]) => {
    let staticParts = [];
    let dynamicParts = [];
    
    for (let i = 0; i < strings.length; i++) {
        staticParts.push(strings[i]);
        if (i < values.length) {
            dynamicParts.push(values[i]);
        }
    }
    
    return [staticParts.join('?'), dynamicParts];
}

const append = (str:string, newStr:string) => {
    if (!newStr) {
        return str;
    }

    if (str) {
        return str + ' ' + newStr;
    }

    return str + newStr;
}

export default qb