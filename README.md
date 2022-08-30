<h1 align="center"><img src="./assets/logo.gif" width="30px"> Discord Music Bot <img src="./assets/logo.gif" width="30px"></h1>

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

Soon
## 🐳 | Docker Compose Tutorial
1. Clone this repo and switch to v5 branch
```
git clone https://github.com/SudhanPlayz/Discord-MusicBot.git
git checkout v5
```
2. Edit Dockerfile to use v16.16.0 node 
```
nano Dockerfile

########################

FROM node:16.16.0-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run deploy

CMD [ "node", "index.js" ]
```
3. Build your Dockerfile
```
docker build <path to bot directory> 
```
4. Fill config.js with your tokens and in the lavalink settings set the host as ``music-lavalink`` and the password as ``bonsoirDocker``
```
	nodes: [
	  {
		identifier: "Main Node", //- Used for indentifier in stats commands.
		host: "music-lavalink", //- The host name or IP of the lavalink server.
		port: 2333, // The port that lavalink is listening to. This must be a number!
		password: "bonsoirDocker", //- The password of the lavalink server.
		retryAmount: 200, //- The amount of times to retry connecting to the node if connection got dropped.
		retryDelay: 40, //- Delay between reconnect attempts if connection is lost.
		secure: false, //- Can be either true or false. Only use true if ssl is enabled!
	  },
	],
```
5. (Optional) If you want to use dashboard, you need to edit the ``docker-compose.yml`` file to expose the port you set for the API and Dashboard
```
services:
  discord-musicbot:
    build: .
    ports:
      - "3000:3000"
```
6. Run ``docker compose up -d`` and you have it running 

        

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
