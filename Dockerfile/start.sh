#! /bin/sh

cd /config

if [ -f "/config/starting.txt" ]; then
	while [ -f "/config/starting.txt" ]
	do
		echo "/config/starting.txt found waiting for 10 secs"
		sleep 10
	done
else
	touch /config/starting.txt
	if [ ! -d "/config/bot" ]; then
		echo "Bot directory not found cloning from github & installing with npm"
		git clone https://github.com/swarupdas02/Discord-MusicBot.git ./bot
		cd ./bot
		npm install
	else
		echo "Bot directory found"
		cd ./bot
		echo "Syncing with github"
		git fetch -a
		git reset --hard
		git pull
	fi
	rm /config/starting.txt
fi

cd /config/bot

chmod -R 777 /config

echo -e "\nStarting bot\n"
node ./index.js
