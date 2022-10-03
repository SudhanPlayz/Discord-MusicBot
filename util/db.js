/**
 * This only implement global database.
 * Bugs are expected, contact Shasha on discord or fix it yourself.
 * TODO: Implement guild database, store each guild data on its own json file.
 * 
 * CAUTION: Beware on providing path, all path to json file must be absolute path!!!
 */

"use strict";

const { writeFileSync, readdirSync, unlinkSync } = require("fs");
const { join } = require("path");

const _dbName = "db.json";
const _dbListName = "dbList.json"
const _globalDbDir = join(__dirname, "..");
const _globalDbPath = join(_globalDbDir, _dbName);
const _dbListPath = join(_globalDbDir, _dbListName);

let _hasGlobalDb = false;
let _hasDbList = false;

try {
    const l = readdirSync(_globalDbDir);
    _hasGlobalDb = l.includes(_dbName);
    _hasDbList = l.includes(_dbListName);
} catch (e) {
    console.warn("[DB] No global database exist");
}

/**
 * @typedef {object} DbList
 * @property {string} name - Database name
 * @property {path} path - Absolute path to json
 */

/**
 * @typedef {object} DbData
 * @property {string} path - Absolute path to json
 * @property {object} data - Json to write
 */

/**
 * @type {DbList[]}
 */
const _dbList = _hasDbList ? require(_dbListPath) || [] : [];

/**
* @type {Map<string, DbData>}
*/
const _dbs = new Map([
    [
        "global",
        {
            path: _globalDbPath,
            data: _hasGlobalDb ? require(_globalDbPath) || {} : {}
        }
    ],
]);

for (const v of _dbList) {
    try {
        _dbs.set(v.name, {
            path: v.path,
            data: require(v.path) || {}
        });
    } catch (e) {
        console.error("[DB] Can't load database '" + v.name + "' in '" + v.path + "'");
    }
}

/**
 * Idiot checker
 * @param {string} path 
 */
const _validateDbPath = (path) => {
    if (typeof path !== "string") throw TypeError("path isn't string");
    if (!path.endsWith(".json")) throw TypeError("path doesn't point to json file");
}

/**
 * Write to global db.
 * 
 * @param {string} path - Absolute path to json
 * @param {object} data - Json to write
 * 
 * @returns {boolean}
 */
const _write = (path, data) => {
    _validateDbPath(path);
    try {
        // you don't need it to be in human readable format, it will still be valid json
        writeFileSync(path, JSON.stringify(data));
        return true;
    } catch (e) {
        console.error("[DB] Can't write to '" + path + "', data is lost");
        return false;
    }
};

/**
 * Delete database of path
 * @param {string} path - Absolute path to delete
 * @returns {boolean}
 */
const _delete = (path) => {
    _validateDbPath(path);
    try {
        unlinkSync(path);
        return true;
    } catch (e) {
        console.error("[DB] Can't delete '" + path + "'");
        return false;
    }
}

/**
 * Write queue
 * @type {DbData[]}
 */
const _wQueue = [];

/**
 * Delete queue
 * @type {string[]}
 */
const _dQueue = [];

// queue loop
const _run = async () => {
    while (true) {
        await new Promise((r, j) => setTimeout(r, 100));

        while (_wQueue.length) {
            const q = _wQueue.shift();
            if (!q) continue;
            _write(q.path, q.data);
        }

        while (_dQueue.length) {
            const q = _dQueue.shift();
            if (!q?.length) continue;
            _delete(q);
        }
    }
}

_run();

const _addDbList = (name, path) => {
    if (!name?.length) throw new TypeError("name undefined");
    _validateDbPath(path);
    _dbList.push({ name, path });
    _wQueue.push({ path: _dbListPath, data: _dbList });
}

const _removeDbList = (name) => {
    if (!name?.length) throw new TypeError("name undefined");

    for (let i = 0; i < _dbList.length;) {
        if (_dbList[i] && _dbList[i].name === name) {
            _dbList.splice(i, 1);
        }
        else i++;
    }
    _wQueue.push({ path: _dbListPath, data: _dbList });
}

/**
 * Get database data
 * @param {string} name - Database name
 * @returns {object} Data
 */
const get = (name) => {
    if (!name?.length) throw new TypeError("name undefined");
    const d = _dbs.get(name);
    if (!d) throw new RangeError("No database with name " + name);
    return d.data;
}

/**
 * Create new database with name
 * @param {string} name - Database name
 * @param {string} path - Absolute path to json file
 * @param {object} initialData - Initial value
 * 
 * @returns {boolean}
 */
const create = (name, path, initialData = {}) => {
    if (!name?.length) throw new TypeError("name undefined");
    _validateDbPath(path);
    if (typeof initialData !== "object") throw new TypeError("initialData is not object");
    
    for (const [n,d] of _dbs) {
        if (n === name)
            throw new Error("Database '" + name + "' already exist");
        if (d.path === path) {
            throw new Error("Database in path '" + path + "' already exist with name '" + n + "'");
        }
    }

    const d = {
        path: path,
        data: initialData
    };

    _wQueue.push(d);
    _addDbList(name, path);
    return !!_dbs.set(name, d);
}

/**
 * Set data to associated database name
 * @param {string} name - Database name
 * @param {object} data - Data to set, must be plain javascript object
 * 
 * @returns {boolean}
 */
const set = (name, data) => {
    if (!name?.length) throw new TypeError("name undefined");
    if (!data) throw new TypeError("data undefined");
    if (typeof data !== "object") throw new TypeError("data is not object");

    const d = _dbs.get(name);
    if (!d) throw new RangeError("No database with name " + name);
    d.data = data;

    _wQueue.push(d);
    return !!_dbs.set(name, d);
}

/**
 * Delete database
 * @param {string} name - Database name
 * @returns {boolean}
 */
const remove = (name) => {
    if (!name?.length) throw new TypeError("name undefined");

    const d = _dbs.get(name);
    if (!d) throw new RangeError("No database with name " + name);

    _dQueue.push(d.path);
    _removeDbList(name);
    return _dbs.delete(name);
}

module.exports = {
    get,
    create,
    set,
    remove,
}
