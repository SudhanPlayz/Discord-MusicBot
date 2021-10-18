const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const getConfig = require('../util/getConfig');
const LoadCommands = require("../util/loadCommands");

(async () => {
    console.log("Please wait this may take a while")

    const config = await getConfig()
    const rest = new REST({ version: '9' }).setToken(config.token);
    const commands = await LoadCommands()

    //will do tmrw 
});