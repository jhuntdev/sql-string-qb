'use strict';

/*!
    Copyright (c) 2024 JHunt
    Licensed under the MIT License (MIT)
    https://github.com/jhuntdev/sql-string-qb
*/
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (undefined && undefined.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var SqlString = (function () {
    function SqlString(strings, values) {
        if (values === void 0) { values = []; }
        this.strings = strings;
        this.values = values;
    }
    SqlString.prototype.toString = function () {
        return this.sql;
    };
    Object.defineProperty(SqlString.prototype, "sql", {
        get: function () {
            return this.strings.join('?');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SqlString.prototype, "text", {
        get: function () {
            return this.strings.reduce(function (prev, curr, i) { return prev + '$' + i + curr; });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SqlString.prototype, "statement", {
        get: function () {
            return this.strings.reduce(function (prev, curr, i) { return prev + ':' + i + curr; });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SqlString.prototype, "query", {
        get: function () {
            return this.sql;
        },
        enumerable: false,
        configurable: true
    });
    SqlString.prototype[Symbol.iterator] = function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, this.sql];
                case 1:
                    _a.sent();
                    return [4, this.values];
                case 2:
                    _a.sent();
                    return [2];
            }
        });
    };
    return SqlString;
}());
var append = function (strings, newStrings) {
    if (!newStrings.length) {
        return strings;
    }
    else if (strings.length) {
        return __spreadArray(__spreadArray(__spreadArray([], strings.slice(0, strings.length - 1), true), [
            strings[strings.length - 1] + ' ' + newStrings[0]
        ], false), newStrings.slice(1), true);
    }
    else {
        return newStrings;
    }
};
var qb = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var strings = [];
    var values = [];
    for (var i = 0; i < args.length; i++) {
        var arg = args[i];
        if (!arg) {
            continue;
        }
        else if (Array.isArray(arg)) {
            strings = append(strings, arg[0]);
            values.push.apply(values, arg[1]);
        }
        else if (typeof arg === 'object') {
            strings = append(strings, arg.strings);
            values.push.apply(values, arg.values);
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
qb.t = function (strings) {
    var values = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        values[_i - 1] = arguments[_i];
    }
    return new SqlString(strings.map(function (s) { return String(s); }), values);
};
qb.set = function (keyValues) {
    var strings = [];
    var values = [];
    var keys = Object.keys(keyValues).filter(function (key) { return keyValues.hasOwnProperty(key); });
    var keysLength = keys.length;
    for (var i = 0; i < keysLength; i++) {
        var key = keys[i];
        strings.push("".concat(i === 0 ? 'SET ' : ', ').concat(key, " = "));
        values.push(keyValues[key]);
    }
    strings.push('');
    return [strings, values];
};
qb.values = function (keyValueArray) {
    var strings = [];
    var values = [];
    var array = Array.isArray(keyValueArray) ? keyValueArray : [keyValueArray];
    var keyValues = array[0];
    var keys = Object.keys(keyValues).filter(function (key) { return keyValues.hasOwnProperty(key); });
    var keysLength = keys.length;
    for (var i = 0; i < array.length; i++) {
        if (i === 0) {
            strings.push("(".concat(keys.join(', '), ") VALUES ("));
        }
        else {
            strings.push("), (");
        }
        var item = array[i];
        for (var j = 0; j < keysLength; j++) {
            var key = keys[j];
            if (j > 0) {
                strings.push(', ');
            }
            values.push(item[key]);
        }
    }
    strings.push(')');
    return [strings, values];
};
qb.in = function (values) {
    var strings = ['IN ('];
    var valuesLength = values.length;
    for (var i = 1; i < valuesLength; i++) {
        strings.push(', ');
    }
    strings.push(')');
    return [strings, values];
};

module.exports = qb;
