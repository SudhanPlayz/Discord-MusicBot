<h1 align="center"><img src="./assets/logo.gif" width="30px"> Discord Music Bot <img src="./assets/logo.gif" width="30px"></h1>

## 🚧 | Prerequisites

- [Docker](https://www.docker.com/)
- Optionally: [GNU Make](https://www.gnu.org/software/make/)

## 📝 | Tutorial

### Written Setup

- Follow the [installation](https://github.com/BioCla/Discord-MusicBot/blob/feature/DJSv14/djs-bot/README.md) procedure for the bot
- Make sure you have [Docker](https://www.docker.com/) (and [CMake](https://cmake.org/)) installed on your machine
  - If you are planning on running the bot through docker on windows, then you'll have to use WSL and set up the appropriate docker configurations for that [(click here)](https://docs.docker.com/desktop/windows/wsl/)
- Open a terminal session in in the root directory of the project
- Run `make help` to see the list of available commands
  - If you don't have or can't install makefile utilities then run `./dc.sh help`

### Docker setup

Setup the ports in a docker-compose.override.yml file in the docker directory. 
 - Or rename the docker-compose.override.yml.dist file to docker-compose.override.yml and fill in the values if they are not already filled in.

The file should look like this:
```yml
version: '3'

services:
  postgres-db:
    ports:
      - xxxx:xxxx
  lavalink:
    ports:
      - 2333:2333
```

Make a `.env` in the same directory as the docker-compose.override.yml file. 
 - Or rename the `.env.dist` file to `.env` and fill in the values if they are not already filled in.

The file should look like this:
```bash
POSTGRES_DB=base
POSTGRES_USER=root
POSTGRES_PASSWORD=root
```

- Run `make up log` to start the docker environment and view the logs. 
- You can also run `make up` to start the docker environment in the background.

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
- [Lavalink](https://github.com/freyacodes/Lavalink) with erela.js