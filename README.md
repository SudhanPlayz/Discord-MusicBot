<h1 align="center"> Discord Music Bot </h1>

## 🚧 | Prerequisites

- [Docker](https://www.docker.com/)
- Optionally: [GNU Make](https://www.gnu.org/software/make/)

## 📝 | Tutorial

### Written Setup

- Follow the [installation](https://github.com/BioCla/Discord-MusicBot/blob/feature/DJSv14/djs-bot/README.md) procedure for the bot
  - Do keep in mind that this is the ONLY part of the tutorial that you need to follow from the original repo, which is the core of the bot

#### For everything else:
- Make sure you have [Docker](https://www.docker.com/) (and [GNU Make](https://www.gnu.org/software/make/)) installed on your machine
  - If you are planning on running the bot through docker on windows, then you'll have to use WSL and set up the appropriate docker configurations for that [(click here)](https://docs.docker.com/desktop/windows/wsl/)
- Open a terminal session in in the root directory of the project
- Run `make help` to see the list of available commands
  - If you don't have or can't install makefile utilities then run `./dc.sh help`
  - If you're having trouble running the script due to lack of permissions be sure to `chmod +x dc.sh`

#### Docker setup

- Run `make up` to start the docker environment with all services active 
  - If you don't want a particular service to start up on `make up` you can simply add a `no` flag to the command. For example: `make up nodb` will start the docker environment without the DB.

#### Local setup

- Run `make up no-docker` to start the bot locally

- Run `make up help` to see the list of available commands and options
- Remember to remove the DB related environment variables from the `./djs-bot/.env` file if you are not using the DB at all.

## 📝 | [Support Server](https://discord.gg/sbySMS7m3v)

If you have major coding issues with this bot, please join and ask for help.

## 📸 | Screenshots

Soon

## 🚀 | Deploy

- No deployment options have been configured yet

## ✨ | Contributors

Contributions are always welcomed :D Make sure to follow [Contributing.md](/CONTRIBUTING.md)

<a href="https://github.com/SudhanPlayz/Discord-MusicBot/graphs/contributors">
  <img src="https://contributors-img.web.app/image?repo=SudhanPlayz/Discord-MusicBot" />
</a>

## 🌟 | Made with

- [Discord.js](https://discord.js.org/)
- [Lavalink](https://github.com/freyacodes/Lavalink) with erela.js, Cosmicord.js
