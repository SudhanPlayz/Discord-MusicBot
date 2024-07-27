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
- [Lavalink Server](https://blog.darrennathanael.com/post/how-to-lavalink/)
  - v5 is currently compatible with Lavalink v3. 
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
Update the `docker/application.yml` file with your desired password and port. Change config.js to match your configuration.

Docker is currently using lavalink v3.7.12 as you can see in the `Dockerfile`. If you want to use a different version, you can change the `LAVA_LINK_VERSION` environment variable in the `docker-compose.yml` file.



You should configure the `config.js` file with the host `"lavalink"`, using the same `password` and `port` as specified in `docker/application.yml`.

Build and start bot and lavalink
```sh
docker-compose up -d --build
```

If you want to view logs for both applications in your console upon running the command, you can remove the `-d` flag.

### 💪🏻 Non-Docker
> The `config.js` file should be configured first. Don't forget to add a lavalink host

Create a folder named lavalink and place the lavalink.jar file in it, alongside the application.yml file. Follow [this guide](https://blog.darrennathanael.com/post/how-to-lavalink/) to setup Lavalink. Make sure to use configs for v3 (and to inspect the `docker/application.yml` file to see how the youtube plugin is currently being set.)

Install all dependencies and deploy Slash Commands
```sh
npm install
npm run deploy
```

If you're setting up your own lavalink, initiate it:
```sh
cd lavalink/
java -Xmx2G -jar Lavalink.jar
```

And finally start the bot
```sh
node index.js
```

To run the commands on your server, if everything was done right, upon pressing `/` you should see your bot options. Typing /play <some music> should work. In case you set up your own lavalink/is running docker without the --d flag, you can view your lavalink connections/attempts in the console, aswell as the bot logs.

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
