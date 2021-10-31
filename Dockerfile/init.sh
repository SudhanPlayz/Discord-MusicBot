#! /bin/sh

echo -e "\nCONTAINER STARTED"

cd /config

if [ ! -f "/config/start.sh" ]; then
	echo "Start script not found in /config copying default start script now"
	cp /usr/local/bin/start.sh /config/start.sh
else
    echo "Start script found"
fi

echo -e "Executing start script\n"
bash /config/start.sh
