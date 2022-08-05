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

First of all, click this button
[![Run on Repl.it](https://repl.it/badge/github/SudhanPlayz/Discord-MusicBot)](https://repl.it/github/SudhanPlayz/Discord-MusicBot)

Once finished cloning, ignore the errors, the default master branch dont use nix so its inevitable

1. Go to Commands => Version Control, in the branch dropdown, select `v5`. Wait until it's done and the version control buttons are clickable again.

1. Fill your config.js. For lavalink, go to [this link](https://lavalink-list.darrennathanael.com)

1. Now,all your files are created. You can now run `bash ./kickstartReplit.sh` in shell

1. Once the installation of `kickstartReplit.sh` is done, you can now click the run button or type `node index.js` in your console

## Final

Once done you can restart your bot, then invite it using this url template. `https://discord.com/oauth2/authorize?client_id=CLIENT_ID&scope=bot%20applications.commands&permissions=2205280576`

- `CLIENT_ID` needs to be replaced with your bot Id
- Permission calculator: [learn more](https://finitereality.github.io/permissions-calculator)
- You can use #generateInvite instead: [learn more](https://discord.js.org/#/docs/main/main/class/Client?scrollTo=generateInvite)

## Deploying slash commands

If you chose `y` on step 3 of the installation process then it will already be deployed. If it's still not please deploy slash commands using `npm run deploy`, you can run it on the shell. 
Do remember to give your bot applications.commands scope!



**SIDE NOTES**:
- If you're running the version 4 of the bot, please kick it and reinvite using the invite link stated in [final](#final)
