# Installation on a Linux server

## Prerequisites

- [Discord Application](#create-a-discord-application)
- [NodeJS & NPM](#install-nodejs-npm)

### Create a Discord Application

- go to the [Discord Developer portal](https://discord.com/developers/applications)
- create a new application + bot
- create a bot invitelink using it's client id [here](https://discordapi.com/permissions.html)
- save the bot token for later

### Install nodejs & npm

follow [those](https://github.com/nodesource/distributions) instructions

## Installation

- [Configuration](#configuration)
- [Lavalink](#lavalink)
- [Final Steps](#final-steps)

### Configuration

- run `git clone https://github.com/SudhanPlayz/Discord-MusicBot.git`
- go into the folder with `cd Discord-MusicBot`
- edit the config.js with the tokens from earlier

### lavalink

use [public lavalink](https://lavalink-list.darrennathanael.com)

or [host your own](https://code.darrennathanael.com/how-to-lavalink)

### Final steps

- run `npm install`
- deploy the slash command by using `npm run deploy` or `yarn deploy`
- start the bot with `npm run start` or `yarn start`

### Dashboard setup.

> You can do this in 2 ways, with a custom domain or with your vps/server ip.

### Dashboard with custom domain

##### With Nginx

Create a new file in `/etc/nginx/sites-available`

> you can use whatever your favorite text editor, but I'll be using vim cause I'm used to it

Do `vi /etc/nginx/sites-available/musicbot.conf`
Then enter this example config

```c
server {
    listen 80;
    server_name foo.bar;

    location / {
        proxy_set_header   X-Forwarded-For $remote_addr;
        proxy_set_header   Host $http_host;
        proxy_pass         http://127.0.0.1:3000;
    }
}
```

then saved it and quit `:wq`

> Replace `foo.bar` with your domain
> for https support use https://letsencrypt.org/

##### With Apache

**Apache Conf file**
Go to your apache configuration file then paste this in

```apache
<VirtualHost *:80>
    ServerAdmin wilbur@example.com
    DocumentRoot "/path/to/bot/file"
    ServerName example.com
    ServerAlias example.com
    #errorDocument 404 /404.html


	#Referenced reverse proxy rule, if commented, the configured reverse proxy will be invalid
    #Take a note of this dir
	IncludeOptional /server/apache/proxy/example.com/*.conf

    #DENY FILES
     <Files ~ (\.user.ini|\.htaccess|\.git|\.svn|\.project|LICENSE|README.md)$>
       Order allow,deny
       Deny from all
    </Files>

</VirtualHost>
```

**Apache Reverse Proxy file**

> put it in /server/apache/proxy/example.com/discordbot.conf

Make a new file at your config dir, above for reference

```apache
#PROXY-START/
<IfModule mod_proxy.c>
    ProxyRequests Off
    SSLProxyEngine on
    ProxyPass / http://127.0.0.1:3000/
    ProxyPassReverse / http://127.0.0.1:3000/
    </IfModule>
#PROXY-END/
```

Then once done save it then restart apache.

> Replace `example.com` with your domain
> for https support use https://letsencrypt.org/

### Dashboard with IP

- open port 80, Then edit the `botconfig.js` and change the `Port` on line `5`, change it to 80, `Website` line `18` to **Example**`https://192.168.0.1`

- Go to the Discord Developer Portal under the OAuth2 tab. Then put your server ip in this format `http://192.168.0.1/api/callback`
