# Installation on Repl.it

## Prerequisites

- [Discord Application](#create-a-discord-application)

### Create a Discord Application

- go to the [Discord Developer portal](https://discord.com/developers/applications)
- create a new application + bot
- create a bot invitelink using it's client id [here](https://discordapi.com/permissions.html)
- save the bot token for later

## Installation

> We have changed the way v5 is installed, we now use and utilise the nix environment.

1. In replit, [create a blank repl](https://replit.com/@replit/Blank-Repl) 

1. Open your shell. Git clone the v5 branch using the command 
```
rm .replit replit.nix README.md; rm -rf .cache && git clone -b v5 https://github.com/sudhanplayz/discord-musicbot .
```

> If you're wondering why there's `rm -rf .cache`, it's to remove the `.cache` folder and to make the directory clean for the second command

3. Fill your config.js. For lavalink, go to [this link](https://lavalink-list.darrennathanael.com)

4. Now,all your files are created. You can now run `bash ./kickstartReplit.sh` in either console or shell

Wait for the installation and then your bot is now running! The next time you run your bot,you just need to type `node index.js` in your shell!

## Final

Once done you can restart your bot, then invite it using this url template. `https://discord.com/oauth2/authorize?client_id=CLIENT_ID&scope=bot%20applications.commands&permissions=2205280576`

- `CLIENT_ID` needs to be replaced with your bot Id
- Permission calculator: [learn more](https://finitereality.github.io/permissions-calculator)
- You can use #generateInvite instead: [learn more](https://discord.js.org/#/docs/main/main/class/Client?scrollTo=generateInvite)

## Deploying slash commands

This should already be done in step 4 on installation but if you don't have the `applications.commands` scope, You can deploy slash commands using `npm run deploy`

**SIDE NOTES**:
- If you're running the version 4 of the bot, please kick it and reinvite using the invite link stated in [final](#final)
