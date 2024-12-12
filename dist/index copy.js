/*!
    Copyright (c) 2024 JHunt
    Licensed under the MIT License (MIT)
    https://github.com/jhuntdev/sql-string-qb
*/
var __generator = (this && this.__generator) || function (thisArg, body) {
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
var SqlString = /** @class */ (function () {
    function SqlString(strings, values) {
        if (values === void 0) { values = []; }
        this.strings = strings;
        this.values = values;
    }
    Object.defineProperty(SqlString.prototype, "query", {
        /** Returns the SQL Statement for Sequelize */
        get: function () {
            return this.bind ? this.text : this.sql;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SqlString.prototype, "text", {
        /** Returns the SQL Statement for node-postgres */
        get: function () {
            return this.strings.reduce(function (prev, curr, i) { return prev + '$' + i + curr; });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SqlString.prototype, "length", {
        get: function () {
            return this.value.length;
        },
        enumerable: false,
        configurable: true
    });
    SqlString.prototype.toString = function () {
        return this.value;
    };
    SqlString.prototype.charAt = function (index) {
        return this.value.charAt(index);
    };
    SqlString.prototype.replace = function (searchValue, replaceValue) {
        return new SqlString(this.value.replace(searchValue, replaceValue));
    };
    SqlString.prototype.toUpperCase = function () {
        return new SqlString(this.value.toUpperCase());
    };
    SqlString.prototype.toLowerCase = function () {
        return new SqlString(this.value.toLowerCase());
    };
    SqlString.prototype.substring = function (start, end) {
        return new SqlString(this.value.substring(start, end));
    };
    SqlString.prototype.includes = function (searchString) {
        return this.value.includes(searchString);
    };
    SqlString.prototype.split = function (separator, limit) {
        return this.value.split(separator, limit);
    };
    SqlString.prototype.trim = function () {
        return new SqlString(this.value.trim());
    };
    SqlString.prototype.toArray = function () {
        return Array.from(this.value);
    };
    SqlString.prototype.concat = function () {
        var _a;
        var strings = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            strings[_i] = arguments[_i];
        }
        return new SqlString((_a = this.value).concat.apply(_a, strings));
    };
    SqlString.prototype.startsWith = function (searchString) {
        return this.value.startsWith(searchString);
    };
    SqlString.prototype.endsWith = function (searchString) {
        return this.value.endsWith(searchString);
    };
    SqlString.prototype.charCodeAt = function (index) {
        return this.value.charCodeAt(index);
    };
    SqlString.prototype.match = function (regexp) {
        return this.value.match(regexp);
    };
    SqlString.prototype.repeat = function (count) {
        return new SqlString(this.value.repeat(count));
    };
    SqlString.prototype.padStart = function (targetLength, padString) {
        if (padString === void 0) { padString = ' '; }
        return new SqlString(this.value.padStart(targetLength, padString));
    };
    SqlString.prototype.padEnd = function (targetLength, padString) {
        if (padString === void 0) { padString = ' '; }
        return new SqlString(this.value.padEnd(targetLength, padString));
    };
    SqlString.prototype[Symbol.iterator] = function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.toString()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, this.params];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    };
    return SqlString;
}());
export { SqlString };
export var SqlStringQB = function (dialect) {
    if (dialect === void 0) { dialect = 'mysql'; }
    var append = function (str, newStr) {
        if (!newStr) {
            return str;
        }
        else if (str) {
            return str + ' ' + newStr;
        }
        else {
            return str + newStr;
        }
    };
    var qb = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var value = '';
        var params = [];
        for (var i = 0; i < args.length; i++) {
            var arg = args[i];
            if (!arg) {
                continue;
            }
            else if (Array.isArray(arg)) {
                value = append(value, arg[0]);
                params.push.apply(params, arg[1]);
            }
            else if (typeof arg === 'string') {
                value = append(value, arg);
            }
            else {
                throw new Error('Arguments should be strings or arrays');
            }
        }
        return params.length > 0 ? new SqlString(value, params) : new SqlString(value);
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
        return [dialect === 'postgres' ? staticParts.reduce(function (str, part, index) {
                if (index === 0)
                    return str + part;
                return str + '$' + index + part;
            }, '') : staticParts.join('?'), dynamicParts];
    };
    qb.set = function (keyValues) {
        // SET key1 = $0, key2 = $1
    };
    qb.values = function (keyValues) {
        // (key1, key2) VALUES ($0, $1), ($2, $3)
    };
    // qb.and = () => {}
    // qb.or = () => {}
    qb.in = function (values) {
    };
    return qb;
};
export default SqlStringQB;
// export class SqlStringQB {
//   private dialect: SqlStringDialect;
//   constructor(dialect: SqlStringDialect = 'mysql') {
//       this.dialect = dialect;
//   }
//   call(...args: number[]): SqlString {
//       let value = '';
//       const params:any[] = [];
//       for (let i = 0; i < args.length; i++) {
//           const arg = args[i];
//           if (!arg) {
//               continue;
//           } else if (Array.isArray(arg)) {
//               value = this.append(value, arg[0])
//               params.push(...arg[1])
//           } else if (typeof arg === 'string') {
//               value = this.append(value, arg)
//           } else {
//               throw new Error('Arguments should be strings or arrays')
//           }
//       }
//       return params.length > 0 ? new SqlString(value, params) : new SqlString(value)
//   }
//   apply(...args: number[]): SqlString {
//       return this.call(...args);
//   }
//   public t(strings:string[], ...values:any[]) {
//       let staticParts = [];
//       let dynamicParts = [];
//       for (let i = 0; i < strings.length; i++) {
//           staticParts.push(strings[i]);
//           if (i < values.length) {
//               dynamicParts.push(values[i]);
//           }
//       }
//       return [this.dialect === 'postgres' ? staticParts.reduce((str, part, index) => {
//           if (index === 0) return str + part;
//           return str + '$' + index + part;
//       }, '') : staticParts.join('?'), dynamicParts];
//   }
//   private append(str:string, newStr:string) {
//       if (!newStr) {
//           return str;
//       }
//       if (str) {
//           return str + ' ' + newStr;
//       }
//       return str + newStr;
//   }
// }
// export const qb = (...args:(string|any[]|null|undefined|false)[]): SqlString => {
//     let value = '';
//     const params:any[] = [];
//     for (let i = 0; i < args.length; i++) {
//         const arg = args[i];
//         if (!arg) {
//             continue;
//         } else if (Array.isArray(arg)) {
//             value = append(value, arg[0])
//             params.push(...arg[1])
//         } else if (typeof arg === 'string') {
//             value = append(value, arg, mode)
//         } else {
//             throw new Error('Arguments should be strings or arrays')
//         }
//     }
//     return params.length > 0 ? new SqlString(value, params) : new SqlString(value)
// }
// qb.t = (strings:string[], ...values:any[]) => {
//     let staticParts = [];
//     let dynamicParts = [];
//     for (let i = 0; i < strings.length; i++) {
//         staticParts.push(strings[i]);
//         if (i < values.length) {
//             dynamicParts.push(values[i]);
//         }
//     }
//     return [staticParts.join('?'), dynamicParts];
// }
// const append = (str:string, newStr:string) => {
//     if (!newStr) {
//         return str;
//     }
//     if (str) {
//         return str + ' ' + newStr;
//     }
//     return str + newStr;
// }
