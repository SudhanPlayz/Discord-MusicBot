## ⛔ | Prerequisites

- [Node.js 17+](https://nodejs.org/en/download/) (if you're not using the docker setup)
- [Lavalink Server](https://code.darrennathanael.com/how-to-lavalink) (if you're planning on hosting your own lavlink server)

> NOTE: Lavalink is needed for music functionality. You need to have a working Lavalink server to make the bot work.


## 📝 | Important Note if you're Switching from v4 to v5

1. Download and configure v5 in a seperate folder.
2. Kick your bot out of your server.
3. Reinvite the Bot with the right
   scopes. [Example Invite URL (Change CLIENT_ID)](https://discord.com/oauth2/authorize?client_id=CLIENT_ID&permissions=277083450689&scope=bot%20applications.commands)
4. Run `npm run deploy` or `yarn deploy` to initialize the slash commands. _You can do this on your pc locally_

## 🏃‍♂ | Installing and running the bot from scratch

### First of all you'll need to create a new bot application for your discord bot client:
  - Go to [Discord Developer Portal](https://discord.com/developers/applications/)
  - Click on the button "New Application" and give it a name
    - On the main page you can mess around and give your bot a description, tags and a Profile picture
  - Click on "Bot" in the panel on the left and "Add Bot" to create a new Discord Bot Client
    - Here you can enable some really neat API features for your bot, the one's you'll be needing are: "Server Member Intent" and "Message Content Intent" (Also disable "Public Bot" if you want)
  - Now go to the "OAuth2" section and press on the "URL Generator" Tab
    - Select the "bot" and "applications.commands" scopes (A new table should open upon clicking on the "bot" scope)
    - In the "Bot Permissions" table you can select what permissions your bot will ask to have upon entering a new server, as you're setting it up it might be useful to give it "Administrator"
  - Now a link will have generated at the bottom which you can copy and paste in your browser search bar, this will allow you to invite the first instance of the bot in your server
(It should look something like `https://discord.com/oauth2/authorize?client_id={clientId}&permissions={permissions}&scope=bot%20applications.commands` Obviously replace the {variables} with the correct values if you intend to write it out yourself)

### Now that everything is set up on the discord side of things:
  - You will need to fill in all the blanks in the `config.js` with the appropriate contents of your discord bot application or make a `.env` file and fill in the contents in this manner (lines marked with `*` are optional):
```bash
TOKEN=botToken
CLIENTID=botClientId
CLIENTSECRET=botClientSecretToken
DEVUID=yourDiscordUID *
DATABASE_URL="dbArch://user:pass@host:port/db" * # If you want DB functionality
```
  - To actually set up the bot and get it running you need to install all required dependencies and post slash commands to the discord bot application:
```bash
npm run update
npm run deploy # this should be a one time thing
```
  - To run the bot:
```bash
npm run start
# or
npm run db-start # if you have your own DB setup
```