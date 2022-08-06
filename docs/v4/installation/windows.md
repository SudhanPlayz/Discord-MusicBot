# Prerequisites
## Create a Discord Application
- go to the [Discord Developer portal](https://discord.com/developers/applications)
- create a new application + bot
- create a bot invitelink using it's client id [here](https://discordapi.com/permissions.html)
- save the bot token for later
## get a Spotify Client ID + Secret
- login [here](https://developer.spotify.com/dashboard/) and create an application
## Install nodejs + npm + git
go to [this link](https://nodejs.org) and download the LTS version
for git, go to [this link](https://git-scm.com/download/win) and download the right package for your machine

# Installation
## Configuration
- Open powershell
- Run `git clone https://github.com/SudhanPlayz/Discord-MusicBot.git`
- go to the folder `cd Discord-MusicBot`
- Using your favorite text editor, edit botconfig.js with the creditentials for earlier

### lavalink
use [public lavalink](https://lavalink-list.darrennathanael.com/)


or [host your own](https://code.darrennathanael.com/how-to-lavalink)

## Final steps
- run `npm install`
- start the bot with `node index.js`

### Dashboard setup 
- In powershell or cmd, run `ipconfig` and grab your ip address
- In [discord developer portal](https://discord.com/developers/applications), go to your app then Oauth2 => Redirects. Put `http://<your-ipv4>/api/callback`
- In botconfig.js, edit line `5` and put the porr `80`, edit line `20` and put `http://<your-ipv4>`
- Run the code and visit `http://<your-ipv4>`

