# Installation on Repl.it

## Prerequisites

- [Discord Application](#create-a-discord-application)

### Create a Discord Application

- go to the [Discord Developer portal](https://discord.com/developers/applications)
- create a new application + bot
- create a bot invitelink using it's client id [here](https://discordapi.com/permissions.html)
- save the bot token for later

## Installation

Click [![Run on Repl.it](https://repl.it/github/ModelBuses/DiscordMusic)](https://repl.it/github/SudhanPlayz/Discord-MusicBot)

Then let it load the project, It may take 1 - 5 min.

Then you'll need to edit the `config.js` and fill in the [Lavalink](https://github.com/freyacodes/Lavalink), Token, ClientSecret, ClientId.

> If you want to host lavalink on replit you can check out this [repo](https://github.com/DarrenOfficial/lavalink-replit)

## Deploying slash commands

run `yarn deploy` or `npm run deploy`
## Final

Once done you can restart your bot, then invite it using this url template. https://discord.com/oauth2/authorize?client_id=CLIENT_ID&scope=bot%20applications.commands&permissions=2205280576

- CLIENT_ID needs to be replaced with your bot Id
- Permission calculator: [learn more](https://finitereality.github.io/permissions-calculator)
- You can use #generateInvite instead: [learn more](https://discord.js.org/#/docs/main/main/class/Client?scrollTo=generateInvite)
