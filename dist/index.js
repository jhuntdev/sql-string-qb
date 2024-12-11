/*!
    Copyright (c) 2024 JHunt.
    Licensed under the MIT License (MIT), see
    https//qb.jhunt.dev
*/
export var qb = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var str = '';
    var vars = [];
    for (var i = 0; i < args.length; i++) {
        var arg = args[i];
        if (!arg) {
            continue;
        }
        else if (Array.isArray(arg)) {
            str = append(str, arg[0]);
            vars.push.apply(vars, arg[1]);
        }
        else if (typeof arg === 'string') {
            str = append(str, arg);
        }
        else {
            throw new Error('Arguments should be strings or arrays');
        }
    }
    return vars.length > 0 ? [str, vars] : [str];
};
qb.t = function (strings) {
    var values = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        values[_i - 1] = arguments[_i];
    }
    var staticParts = [];
    var dynamicParts = [];
    for (var i = 0; i < strings.length; i++) {
        staticParts.push(strings[i]);
        if (i < values.length) {
            dynamicParts.push(values[i]);
        }
    }
    return [staticParts.join('?'), dynamicParts];
};
var append = function (str, newStr) {
    if (!newStr) {
        return str;
    }
    if (str) {
        return str + ' ' + newStr;
    }
    return str + newStr;
};
export default qb;
