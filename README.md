<h1 align="center"><img src="./assets/logo.gif" width="30px"> Discord Music Bot <img src="./assets/logo.gif" width="30px"></h1>

## ✨Latest Updates

v5.1 Is in development! Go check it out [HERE!](https://github.com/wtfnotavailable/Discord-MusicBot)

What do you gain from it? Let us explain:
 - Completely modular docker environment for easier development and deployment
 - A WORKING DASHBOARD!!!
 - DB Integration for you to save your favorite songs in
 - Integrated self hosted Lavalink
 - Dedicated query channel
 - More commands and functionalities
 - And so much more to come!

## 🚧 | Prerequisites

- [Node.js 16+](https://nodejs.org/en/download/)
- [Lavalink Server](https://code.darrennathanael.com/how-to-lavalink)
- You'll need to run `npm run deploy` or `yarn deploy`. to initialized the slash commands. _You can do this on your pc
  locally_

> NOTE: Lavalink is needed for music functionality. You need to have a working Lavalink server to make the bot work.

## 📝 | Important Note if you're Switching from v4 to v5

1. Download and configure v5 in a seperate folder.
2. Kick your bot out of your server.
3. Reinvite the Bot with the right
   scopes. [Example Invite URL (Change CLIENT_ID)](https://discord.com/oauth2/authorize?client_id=CLIENT_ID&permissions=277083450689&scope=bot%20applications.commands)
4. Run `npm run deploy` or `yarn deploy` to initialize the slash commands. _You can do this on your pc locally_

## 📝 | Tutorial

### 🐳 Docker
> The `config.js` file should be configured with the host `"lavalink"`, and you should use the same `password` as in `docker/application.yml`.

Build and start bot and lavalink
```sh
docker-compose up -d --build
```
### 💪🏻 Non-Docker
> The `config.js` file should be configured first. Don't forget to add a lavalink host

Install all dependencies and deploy Slash Commands
```sh
npm install
npm run deploy
```
Start the bot
```sh
node index.js
```

## 📝 | [Support Server](https://discord.gg/sbySMS7m3v)

If you have major coding issues with this bot, please join and ask for help.

## 📸 | Screenshots

Soon

## 🚀 | Deploy

[![Deploy to heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/SudhanPlayz/Discord-MusicBot/tree/v5)
[![Open in Gitpod](https://camo.githubusercontent.com/76e60919474807718793857d8eb615e7a50b18b04050577e5a35c19421f260a3/68747470733a2f2f676974706f642e696f2f627574746f6e2f6f70656e2d696e2d676974706f642e737667)](https://gitpod.io/#https://github.com/SudhanPlayz/Discord-MusicBot/tree/v5)

## ✨ | Contributors

Contributions are always welcomed :D Make sure to follow [Contributing.md](/CONTRIBUTING.md)

<a href="https://github.com/SudhanPlayz/Discord-MusicBot/graphs/contributors">
  <img src="https://contributors-img.web.app/image?repo=SudhanPlayz/Discord-MusicBot" />
</a>

## 🌟 | Made with

- [Discord.js](https://discord.js.org/)
- [Lavalink](https://github.com/freyacodes/Lavalink) with erela.js
- [Express](https://expressjs.com/)
- [Next JS](https://nextjs.org/)
- [Next UI](https://nextui.org)
- [Material UI Icons](https://mui.com/material-ui/material-icons/)
