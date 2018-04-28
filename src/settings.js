'use strict';

const LINE_SEPARATOR = require('os').EOL; // Was '\n' before

const BLANK_FILE = [
    // Maybe get rid of this line if always intended to be consumed as ES6 modules?
    "'use strict';", 
    "",
    "const Table = {",
    "    __proto__: Array.prototype,",
    "    _eval() {",
    "        const t = this, iterator_pairs = [];",
    "        const defProp = Object.defineProperty;",
    "        for (let [h, iterable] of Object.entries(t)) {",
    "            delete t[h];", // TODO: make col self-memoising instead of creating now. Also, do we need to delete?
    "            iterator_pairs.push([h, iterable[Symbol.iterator]()]);",
    "            defProp(t, h, {value: []});",
    "        };",
    "        defProp(t, '_evaled', {value: true, writable: true});",
    "        defProp(t, 'length', {value: 0, writable: true});",
    "        if (iterator_pairs.length === 0) { return }",
    "        let row, done = false;",
    "        for (;;) {",
    "            t.push(row = {});",
    "            for (let [h, iterator] of iterator_pairs) {",
    "                defProp(row, h, {",
    "                    configurable: true, // We delete the prop later",
    "                    get() {",
    "                        const item = iterator.next();",
    "                        if (item.done) {done = true; return}",
    "                        const v = item.value; t[h].push(v);",
    "                        delete this[h]; return this[h] = v;",
    "                    }",
    "                });",
    "            }",
    "            for (let [h, _] of iterator_pairs) { row[h] }",
    "            if (done) {t.pop(); return t}",
    "        }",
    "    }",
    "}",
    "",
    "const Sheet = {",
    "    get _getCache() {",
    "        return this.hasOwnProperty('_cache')",
    "            ? this._cache",
    "            : this._cache = {};",
    "    },",
    "    defineMemoProperty(k, fn) {",
    "        return Object.defineProperty(this, k, {",
    "            get() {",
    "                const c = this._getCache;",
    "                if (k in c) return c[k];",
    "                const v = c[k] = fn(this);",
    "                if (Table.isPrototypeOf(v) && !(v._evaled)) v._eval();",
    "                return v",
    "            },",
    "        });",
    "   }",
    "}",
    "",
    "const DATA = [];",
    "",
    "// Transform data into a spreadsheet object",
    "const $ = {__proto__: Sheet};",
    "for (let [k, _, fn] of DATA) {",
    "   $.defineMemoProperty(k, fn);",
    "}",
    // TODO Add ES6 export line?
].join(LINE_SEPARATOR);

module.exports = { LINE_SEPARATOR, BLANK_FILE }