"use strict";

const { readdirSync, mkdirSync } = require("fs");
const { join } = require("path");
const { get, set, create, remove } = require("./db");

const _guildDbDir = ".guild_dbs";
let _guildDbDirExist = false;

try {
    readdirSync(_guildDbDir);
    _guildDbDirExist = true;
    } catch (e) {
    try {
        mkdirSync(_guildDbDir);
        _guildDbDirExist = true;
    } catch (e) {
        console.error("[ERROR] Can't create guild database folder, module will not work.");
        _guildDbDirExist = false;
    }
}

const _getGuildDbName = (guild_id) => {
    return "guild-"+guild_id;
}

const _createGuildDbPath = (guild_id) => {
    return join(_guildDbDir, _getGuildDbName(guild_id)+".json");
}

const _getOrCreateGuildDb = (guild_id) => {
    const dbName = _getGuildDbName(guild_id);

    let d;
    try {
        d = get(dbName);
    } catch (e) {
        if (r.message.startsWith("No database with name ")) {
            create(dbName,_createGuildDbPath(guild_id));
            d = {};
        } else {
            console.error("[ERROR] Unexpected error:");
            console.error(e);
        }
    }
    return d;
}

/**
 * Set guild dj-only mode
 * @param {string} guild_id 
 * @param {boolean} djOnly 
 */
const setDjOnly = (guild_id, djOnly) => {
    const d = _getOrCreateGuildDb(guild_id);
    d.djOnly = djOnly;

    set(_getGuildDbName(guild_id), d);
}

/**
 * Get guild dj-only mode
 * @param {string} guild_id 
 * @returns {boolean}
 */
const getDjOnly = (guild_id) => {
    return !!_getOrCreateGuildDb(guild_id)?.djOnly;
}

// TODO: Write more stuff here



module.exports = _guildDbDirExist ? {
    setDjOnly,
    getDjOnly,
    // new export here
} : {}
